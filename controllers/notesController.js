const Note = require("../models/note");


const create = async(req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });
  
  try {
    const savedNote = await note.save();
    res.json(savedNote);
  } catch(err) {
    res.status(500).send({ message: err.message});
  }
};

const findAll = async (req,res) => {
  try {
    const notes = await Note.find();
    if (notes.length == 0) {
      res.status(404).send({ message: "Notes not found" });
    } else {
      return res.status(200).send(notes);
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};


const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (note == null) res.status(404).send({ message: "Message not found with id " + id});
    res.json(note);
  } catch(err) {
    res.status(400).send({ message: err.message });
  }
};


const updateById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndUpdate(id, {
      title: req.body.title,
      content: req.body.content
    }, { new: true });
    res.send({ updatedNote : note });
  } catch(err) {
    if (err.kind === "ObjectId") {
      res.status(404).send({ message: "Message not found with id " + id});
    } else {
      res.status(500).send({ message: "Error updating message with id " + id });
    }
  } 
};


const deleteById = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.redirect("/api/notes");
  } catch(err) {
    res.status(500).send({ message: err.message});
  }
};

const deleteAll = async (req, res) => {
  try {
    await Note.deleteMany({});
    res.redirect("/api/notes");
  } catch(err) {
    res.status(500).send({ message : err.message });
  }
};


module.exports = { create, findAll, updateById, findById, deleteById, deleteAll};
