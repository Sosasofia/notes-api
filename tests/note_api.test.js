const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { api, initialNotes } = require("./helpers");
const helper = require("./helpers");

let token;

beforeEach(async () => {
  await Note.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("123456", 10);
  const user = new User({
    username: "test",
    name: "test",
    passwordHash
  });

  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);

  for (const note of initialNotes) {
    note.user = savedUser._id;
    const noteObject = new Note(note);
    await noteObject.save();
  }
});

describe("GET /api/notes", function () {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .set("Authorization", `bearer ${token}`)
      .expect("Content-Type", /application\/json/)
      .expect(200);
  });

  test("there are two notes", async () => {
    const response = await api
      .get("/api/notes")
      .set("Authorization", `bearer ${token}`);

    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("a specific note can be view", async () => {
    const notes = await api
      .get("/api/notes")
      .set("Authorization", `bearer ${token}`);
    const noteToView = notes.body[0];

    const fetchNote = await api
      .get("/api/notes/" + noteToView.id)
      .set("Authorization", `bearer ${token}`);

    expect(fetchNote.body.content).toBe(noteToView.content);
    expect(fetchNote.body.title).toBe(noteToView.title);
  });
});

describe("POST /api/notes/", () => {
  test("is possible with a valid note", async () => {
    const newNote = {
      title: "test note",
      content: "test post note"
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

   
    const notesInDb = await helper.notesInDb();
    expect(notesInDb).toHaveLength(initialNotes.length + 1);

    const contents = notesInDb.map((note) => note.content);
    expect(contents).toContain(newNote.content);
  });

  test("is not possible with an invalid note", async () => {
    const newNote = {
      title: "test",
    };

    await api
      .post("/api/notes")
      .set("Authorization", `bearer ${token}`)
      .send(newNote)
      .expect(400);
    
    const notesInDb = await helper.notesInDb();
    expect(notesInDb).toHaveLength(initialNotes.length);

  });
});

describe("PUT update note by id", () => {
  test("is posible with a valid id", async () => {
    const { response } = await helper.getAllContentFromNotes(token);
    const noteToUpdate = response.body[0];

    const data = {
      title: "update test",
      content: "content updated note",
    };

    const updatedNote = await api
      .put("/api/notes/" + noteToUpdate.id)
      .set("Authorization", `bearer ${token}`)
      .send(data);

    //Check response
    expect(updatedNote.body.content).toBe(data.content);
    expect(updatedNote.body.title).toBe(data.title);

    //Check data in db
    const updatedNoteInDB = await api
      .get("/api/notes/" + noteToUpdate.id)
      .set("Authorization", `bearer ${token}`);

    expect(updatedNoteInDB.body.content).toBe(data.content);
    expect(updatedNoteInDB.body.title).toBe(data.title);
  });
});

describe("DELETE /api/notes/", () => {
  test("is possible with a valid id", async () => {
    const { response } = await helper.getAllContentFromNotes(token);
    const noteToDelete = response.body[0];

    await api
      .delete("/api/notes/" + noteToDelete.id)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const notesAfterDelete = await api
      .get("/api/notes")
      .set("Authorization", `bearer ${token}`);

    expect(notesAfterDelete.body).toHaveLength(initialNotes.length - 1);

    const { contents } = await helper.getAllContentFromNotes(token);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(async () => {
  mongoose.connection.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
