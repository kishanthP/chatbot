const express = require("express");
const router = express.Router();
const {
  getAll,
  getOne,
  deleteOne,
  search,
} = require("../controllers/conversationController");

router.get("/", getAll);
router.get("/search", search);
router.get("/:id", getOne);
router.delete("/:id", deleteOne);

module.exports = router;