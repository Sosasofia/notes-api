const express = require("express");
const router = express.Router();
let Users = require("../controllers/userControllers");


router.post("/users", Users.create);
router.get("/users", Users.getAll);


module.exports = router;

