const app = require("../app");
const supertest = require("supertest");
const User = require("../models/user");
const Notes = require("../models/note");

const api = supertest(app);

const initialNotes = [
  {
    title: "1 test note",
    content: "TEST note content",
  },
  {
    title: "2 test note",
    content: "Content for test :D",
  },
];

const getAllContentFromNotes = async (token) => {
  const response = await api.get("/api/notes").set("Authorization", `bearer ${token}`);

  return {
    contents: response.body.map((note) => note.content),
    response,
  };
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const notesInDb = async () => {

  return await Notes.find();
};

module.exports = { initialNotes, api, getAllContentFromNotes, usersInDb, notesInDb };
