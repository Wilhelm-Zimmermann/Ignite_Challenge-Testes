import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection : Connection;

describe("Show user profile", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () =>{
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "josephs",
        email: "josephsa@gmail.com",
        password:"1234"
      });

    const user = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "josephsa@gmail.com",
        password: "1234"
      });

    const token = user.body.token;

    const userProfile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}`})

      expect(userProfile.body).toHaveProperty("id");
  });

  it("should not be able to show profile for non existing user", async () =>{

    const userProfile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer asdkfjl`})

      expect(userProfile.status).toBe(401);
  });
});
