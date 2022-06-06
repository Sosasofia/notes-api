const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { api, usersInDb } = require("./helpers");

describe("create a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("pswd", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("work as expected creating a new username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "testUsername",
      name: "testName",
      password: "123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails if does not have unique username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "root",
      name: "testName",
      password: "123",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Username must be unique");

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  mongoose.connection.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
