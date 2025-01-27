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

  it("createAccount successfully", async () => {
    const query = `
      mutation {
        createAccount(input: {name: "John Doe", cpf: "986.453.580-34"}) {
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


    expect(response.body.data.createAccount.name).toBe("John Doe");
    expect(response.body.data.createAccount.cpf).toBe("98645358034");
    expect(response.body.data.createAccount.balance).toBe(1000);

  })

  it("createAccount fails when creating account with same cpf twice", async () => {
    const query = `
      mutation {
        createAccount(input: {name: "John Doe", cpf: "986.453.580-34"}) {
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

    expect(response.body.data.createAccount.__typename).toBe("AccountAlrealdyExist")
  })

  it("createAccount fails when passing invalid cpf", async () => {
    const query = `
      mutation {
        createAccount(input: {name: "John Doe", cpf: "986.453.580-35"}) {
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

    expect(response.body.data.createAccount.__typename).toBe("InvalidCpf");
  })

  const accountMutation = (name: string, cpf: string) =>
    `
    mutation {
      createAccount(input: {name: "${name}", cpf: "${cpf}"}) {
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

    const senderId = accountOne.body.data.createAccount._id
    const receiverId = accountTwo.body.data.createAccount._id

    const query = 
      `
      mutation {
        createTransaction(input: {
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

    expect(response.body.data.createTransaction.sender.name).toBe("John Sender");
    expect(response.body.data.createTransaction.sender.balance).toBe(990);

    expect(response.body.data.createTransaction.receiver.name).toBe("Jane Receiver");
    expect(response.body.data.createTransaction.receiver.balance).toBe(1010);
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

    const senderId = accountOne.body.data.createAccount._id
    const receiverId = accountTwo.body.data.createAccount._id

    const query = 
      `
      mutation {
        createTransaction(input: {
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

    expect(transactionOne.body.data.createTransaction._id)
      .toBe(transactionTwo.body.data.createTransaction._id)
  })
})