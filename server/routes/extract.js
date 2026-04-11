const express = require("express");
const router = express.Router();
const { extractController } = require("../controllers/extractController");

router.post("/", extractController);

module.exports = router;
