const express = require("express");
const MovieController = require("../controllers/movie.js");

const router = express.Router();

// RUTAS
router.post("/create", MovieController.create);
router.get("/movies", MovieController.getAll);
router.delete("/movie/:id", MovieController.deleteOne);

module.exports = router;
