const app = require("../index"); // Link to your server file
const request = require("supertest");
const User = require("../endpoints/user/UserModel");
const logger = require("../config/winston");
const { close } = require("../database/db");
let authToken = "";
let user = {};

test("should create user", async () => {
  await request(app)
    .post("/users/register")
    .send({
      username: "test",
      password: "testpw",
      email: "shirleyurban@outlook.de",
    })
    .expect(201);

  user = await User.findOne({ username: "test" });
});

test("should verify user", async () => {
  await request(app)
    .get("/authenticate/verify?token=" + user.token)
    .expect(200);
});

test("should login user", async () => {
  await request(app)
    .post("/authenticate/login")
    .set(
      "Authorization",
      "Basic " + Buffer.from("test:testpw").toString("base64")
    )
    .expect(200)
    .then((r) => {
      authToken = r.headers.authorization;
    });
});

test("should get user", async () => {
  await request(app)
    .get("/users/id")
    .set("Authorization", authToken)
    .send({
      id: user._id,
    })
    .expect(200);
});

afterAll(async () => {
  await User.deleteMany({});
  close();
  });
