import { beforeAll } from "@jest/globals"
import { app } from "../server/app"
import http from "http"
import request  from "supertest";
import { connectMemoryDatabase, disconnectDatabase } from "../server/config/db"
import mongoose from "mongoose";
import { Account } from "../server/modules/account/AccountModel";


describe("Account", () => {

  let server: http.Server;

  beforeAll(async () => {
    await connectMemoryDatabase()
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
})