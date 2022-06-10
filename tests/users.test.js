const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { api, usersInDb } = require("./helpers");

describe("create a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("pswd", 10);
    const user = new User({ name: "root", username: "root", passwordHash });

    await user.save();
  });

  test("work as expected creating a new username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "testUsername",
      name: "testName",
      password: "1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test("creation fails if does not have unique username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: "testName",
      username: "root",
      password: "1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("creation fails if password does not have required lenght", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: "testName",
      username: "root",
      password: "124",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password should have at least 3 characters"
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("creation fails if password consist of empty spaces or does not exist", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: "testName",
      username: "root",
      password: "      ",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("password is required");

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails if name field is empty", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: "",
      username: "rootlp",
      password: "kkkkkk",
    };

    const user = await new User(newUser);
    await expect(user.validate()).rejects.toThrow(
      "User validation failed: name: Path `name` is required."
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails if username field is missing", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: "test",
      password: "12345"
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .catch((e) => expect(e).toMatch(/required/));
    console.log(res.body);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  mongoose.connection.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
