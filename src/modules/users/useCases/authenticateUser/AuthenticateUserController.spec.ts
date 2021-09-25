import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection : Connection;

describe("Authenticate users", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an existing user", async () =>{
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "joseph",
        email: "joseph@gmail.com",
        password:"1234"
      });

      const user = await request(app)
        .post("/api/v1/sessions")
        .send({
          email: "joseph@gmail.com",
          password: "1234"
        });

      expect(user.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an unexisting user", async () => {
    const user = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "joaninha@gmail.com",
      password: "sfdasdf"
    });
    expect(user.status).toBe(401);
  });

});
