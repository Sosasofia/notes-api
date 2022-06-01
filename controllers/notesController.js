const Note = require("../models/note");

const create = async (req, res, next) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch(err) {
    next(err);
  }
};

const findAll = async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const note = await Note.findById(id);
    if(note) {
      res.status(200).send(note);
    } else {
      res.status(404).end();
    }
  } catch(err) {
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
    const note = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true, runValidators: true });
    res.status(201).json(note);
  } catch(err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndRemove(id);
    res.status(204).end();
  } catch(err) {
    next(err);
  }
};

const deleteAll =  async (req, res, next) => {
  try {
    await Note.deleteMany({});
    res.status(204).end();
  } catch(err) {
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
