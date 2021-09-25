import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection : Connection;

describe("Create new users", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () =>{
    const user = await request(app)
      .post("/api/v1/users")
      .send({
        name: "josephs",
        email: "josephsa@gmail.com",
        password:"1234"
      });

      expect(user.status).toBe(201);
  });

  it("should not be able to create a new user with the same email", async () =>{

    const user = await request(app)
      .post("/api/v1/users")
      .send({
        name: "josephs",
        email: "josephsa@gmail.com",
        password:"1234"
      });
      expect(user.status).toBe(400);
  });

});
