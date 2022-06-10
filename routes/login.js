const express = require("express");
const router = express.Router();
let Login = require("../controllers/loginController");

router.post("/", Login.singIn);

module.exports = router;
