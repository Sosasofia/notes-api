const express = require("express");
const router = express.Router();
let Users = require("../controllers/userControllers");


router.post("/", Users.create);
router.get("/", Users.getAll);


module.exports = router;

