const User = require("../models/user");
const bcrypt = require("bcrypt");

const create = async (req, res) => {
  const { body } = req;
  const { username, name, password } = body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: "Username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
};

const getAll = async (req, res) => {
  const users = await User.find({}).populate("notes", { title: 1, content: 1, createdAt:1});
  res.json(users);
};

module.exports = { create, getAll };
