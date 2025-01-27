import { beforeAll } from "@jest/globals"
import { app } from "../server/app"
import http from "http"
import request  from "supertest";
import { connectMemoryDatabase, disconnectDatabase } from "../server/config/db"
import mongoose from "mongoose";
import { connectToRedis } from "../server/config/redis";


describe("Account", () => {

  let server: http.Server;

  beforeAll(async () => {
    await connectMemoryDatabase()
    await connectToRedis();
    server = http.createServer(app.callback());
    server.listen();
  })

  afterAll(async () => {
    server.close();
  })

  beforeEach(async () => {
    await mongoose.connection.dropDatabase()
  })

  it("accountCreate successfully", async () => {
    const query = `
      mutation {
        accountCreate(input: {name: "John Doe", cpf: "986.453.580-34"}) {
          ... on Account {
            name
            cpf
            balance
          }
        }
      }
    `

    const response = await request(server)
      .post("/graphql")
      .send({ query })
      .expect(200)


    expect(response.body.data.accountCreate.name).toBe("John Doe");
    expect(response.body.data.accountCreate.cpf).toBe("98645358034");
    expect(response.body.data.accountCreate.balance).toBe(1000);

  })

  it("accountCreate fails when creating account with same cpf twice", async () => {
    const query = `
      mutation {
        accountCreate(input: {name: "John Doe", cpf: "986.453.580-34"}) {
          ... on AccountAlrealdyExist {
                __typename
              }
        }
      }
    `

    const _ = await request(server)
      .post("/graphql")
      .send({ query })
      .expect(200)

    const response = await request(server)
      .post("/graphql")
      .send({ query })
      .expect(200)

    expect(response.body.data.accountCreate.__typename).toBe("AccountAlrealdyExist")
  })

  it("accountCreate fails when passing invalid cpf", async () => {
    const query = `
      mutation {
        accountCreate(input: {name: "John Doe", cpf: "986.453.580-35"}) {
          ... on InvalidCpf {
            __typename
          }
        }
      }
    `

    const response = await request(server)
      .post("/graphql")
      .send({ query })
      .expect(200)

    expect(response.body.data.accountCreate.__typename).toBe("InvalidCpf");
  })

  const accountMutation = (name: string, cpf: string) =>
    `
    mutation {
      accountCreate(input: {name: "${name}", cpf: "${cpf}"}) {
        ... on Account {
          _id
          name
          cpf
          balance
        }
      }
    }  
    `

  it("transactionCreate successfully", async () => {
  
    const accountOnePromise = request(server)
      .post("/graphql")
      .send({ query: accountMutation("John Sender", "986.453.580-34") })
      .expect(200);
      
    const accountTwoPromise = request(server)
      .post("/graphql")
      .send({ query: accountMutation("Jane Receiver", "886.484.990-46") })
      .expect(200);

    const [accountOne, accountTwo] = await Promise.all([
      accountOnePromise,
      accountTwoPromise
    ]);

    const senderId = accountOne.body.data.accountCreate._id
    const receiverId = accountTwo.body.data.accountCreate._id

    const query = 
      `
      mutation {
        transactionCreate(input: {
          senderId: "${senderId}",
          receiverId: "${receiverId}",
          amount: 10,
          idempotencyId: "uuid1234"
        }) {
          ...on Transaction {
            _id
            amount
            sender {
              name
              balance
            }
            receiver {
              name
              balance
            }
            createdAt
            updatedAt
          }
        } 
      }
      `
    const response = await request(server)
      .post("/graphql")
      .send({query})
      .expect(200)

    expect(response.body.data.transactionCreate.sender.name).toBe("John Sender");
    expect(response.body.data.transactionCreate.sender.balance).toBe(990);

    expect(response.body.data.transactionCreate.receiver.name).toBe("Jane Receiver");
    expect(response.body.data.transactionCreate.receiver.balance).toBe(1010);
  })

  it("transactionCreate idempotency", async () => {
    const accountOnePromise = request(server)
    .post("/graphql")
    .send({ query: accountMutation("John Sender", "986.453.580-34") })
    .expect(200);
    
    const accountTwoPromise = request(server)
      .post("/graphql")
      .send({ query: accountMutation("Jane Receiver", "886.484.990-46") })
      .expect(200);

    const [accountOne, accountTwo] = await Promise.all([
      accountOnePromise,
      accountTwoPromise
    ]);

    const senderId = accountOne.body.data.accountCreate._id
    const receiverId = accountTwo.body.data.accountCreate._id

    const query = 
      `
      mutation {
        transactionCreate(input: {
          senderId: "${senderId}",
          receiverId: "${receiverId}",
          amount: 15,
          idempotencyId: "uuid12345"
        }) {
          ...on Transaction {
            _id
          }
        } 
      }
      `
    
    const transactionOne = await request(server)
      .post("/graphql")
      .send({query})
      .expect(200)
    
    const transactionTwo = await request(server)
      .post("/graphql")
      .send({query})
      .expect(200)

    expect(transactionOne.body.data.transactionCreate._id)
      .toBe(transactionTwo.body.data.transactionCreate._id)
  })
})