const express = require("express");
const router = express.Router();
let Notes = require("../controllers/notesController");



router.post("/notes", Notes.create);

router.get("/notes", Notes.findAll);

router.delete("/notes", Notes.deleteAll);

router.get("/notes/:id", Notes.findById);

router.put("/notes/:id", Notes.updateById);

router.delete("/notes/:id", Notes.deleteById);




module.exports = router;
