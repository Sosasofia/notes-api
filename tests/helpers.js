const { app } = require("../app");
const supertest = require("supertest");

const api = supertest(app);

const initialNotes = [
  {
    title: "1 test note",
    content: "TEST note content"
  },
  {
    title: "2 test note",
    content: "Content for test :D"
  }
];

const getAllContentFromNotes = async () => {
  const response = await api.get("/api/notes");
  return {
    contents: response.body.map(note => note.content),
    response
  };
};

module.exports = { initialNotes, api, getAllContentFromNotes};