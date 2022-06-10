const express = require("express");
const router = express.Router();
let Notes = require("../controllers/notesController");


router.post("/", Notes.create);

router.get("/", Notes.findAll);

router.delete("/", Notes.deleteAll);

router.get("/:id", Notes.findById);

router.put("/:id", Notes.updateById);

router.delete("/:id", Notes.deleteById);




module.exports = router;
