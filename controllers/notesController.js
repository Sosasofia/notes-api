const Note = require("../models/note");
const User = require("../models/user");
const mongoose = require("mongoose");

const create = async (req, res) => {
  const body = req.body;
  const { userId } = req;

  const user = await User.findById(userId);

  const note = new Note({
    title: body.title,
    content: body.content,
    user: user._id,
  });


  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
  
  
};

const findAll = async (req, res) => {
  const { userId } = req;

  const id = mongoose.Types.ObjectId(userId);
  const notes = await Note.find({ user: id }).populate("user", {
    username: 1,
    name: 1,
  });

  res.json(notes);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const note = await Note.findById(id);
  if (note.user._id.toString() === userId) {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).end();
    }
  } else {
    return res.status(401).json({
      error: "unauthorized to access",
    });
  }
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { content, title } = req.body;
  const { userId } = req;

  const note = await Note.findById(id);
  const newNoteInfo = {
    title: title,
    content: content,
  };

  if (note.user._id.toString() === userId) {
    const savedNote = await Note.findByIdAndUpdate(id, newNoteInfo, {
      new: true,
      runValidators: true,
    });
    res.status(201).json(savedNote);
  } else {
    return res.status(401).json({
      error: "unauthorized to access",
    });
  }
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const note = await Note.findById(id);
  if (note.user._id.toString() === userId) {
    await Note.findByIdAndRemove(id);
    res.status(204).end();
  } else {
    return res.status(401).json({
      error: "unauthorized to access",
    });
  }
};

const deleteAll = async (req, res) => {
  await Note.deleteMany({});
  res.status(204).end();
};

module.exports = {
  create,
  findAll,
  updateById,
  findById,
  deleteById,
  deleteAll,
};
