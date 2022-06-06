const Note = require("../models/note");
const User = require("../models/user");

const create = async (req, res, next) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    user: user._id,
  });

  try {
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
};

const findAll = async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  res.json(notes);
};

const findById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (note) {
      res.status(200).send(note);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
};

const updateById = async (req, res, next) => {
  const { id } = req.params;
  const { content, title } = req.body;

  const newNoteInfo = {
    title: title,
    content: content,
  };

  try {
    const note = await Note.findByIdAndUpdate(id, newNoteInfo, {
      new: true,
      runValidators: true,
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndRemove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await Note.deleteMany({});
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  findAll,
  updateById,
  findById,
  deleteById,
  deleteAll,
};
