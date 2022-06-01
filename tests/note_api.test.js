const mongoose = require("mongoose");
const Note = require("../models/Note");
const { api, initialNotes, getAllContentFromNotes } = require("./helpers");


beforeEach(async () => {
  await Note.deleteMany({});

  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
});

describe("GET /api/notes", function () {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect("Content-Type", /application\/json/)
      .expect(200);
  });

  test("there are two notes", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("a specific note can be view", async () => {
    const notes = await api.get("/api/notes");
    const noteToView = notes.body[0];

    const fetchNote = await api.get("/api/notes/" + noteToView.id);

    expect(fetchNote.body.content).toBe(noteToView.content);
    expect(fetchNote.body.title).toBe(noteToView.title);
  });
});

describe("POST /api/notes/", () => {
  test("is possible with a valid note", async () => {
    const newNote = {
      title: "3 nota",
      content: "test post note",
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { contents, response } = await getAllContentFromNotes();

    expect(response.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
  });

  test("is not possible with an invalid note", async () => {
    const newNote = {
      title: "nope",
    };

    await api.post("/api/notes").send(newNote).expect(400);

    const { response } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });
});

describe("PUT update note by id", () => {
  test("is posible with a valid id", async () => {
    const { response } = await getAllContentFromNotes();
    const noteToUpdate = response.body[0];

    const data = {
      title: "update test",
      content: "content updated note"
    };

    const updatedNote = await api.put("/api/notes/" + noteToUpdate.id).send(data);

    //Check response
    expect(updatedNote.body.content).toBe(data.content);
    expect(updatedNote.body.title).toBe(data.title);

    //Check data in db
    const updatedNoteInDB = await api.get("/api/notes/" + noteToUpdate.id);
    expect(updatedNoteInDB.body.content).toBe(data.content);
    expect(updatedNoteInDB.body.title).toBe(data.title);
  });
});

describe("DELETE /api/notes/", () => {
  test("is possible with a valid id", async () => {
    const { response } = await getAllContentFromNotes();
    const noteToDelete = response.body[0];

    await api
      .delete("/api/notes/" + noteToDelete.id)
      .expect(204);
    
    await api
      .get("/api/notes/" + noteToDelete.id)
      .expect(404);

    const notesAfterDelete = await api.get("/api/notes");
    expect(notesAfterDelete.body).toHaveLength(initialNotes.length - 1);

    const { contents } = await getAllContentFromNotes();
    expect(contents).not.toContain(noteToDelete.content);
    
  });
  test("delete all", async () => {
    await api
      .delete("/api/notes")
      .expect(204);

    const { response } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(0);
  });
});


afterAll(async () => {
  mongoose.connection.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
