const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  getAllUserBooks,
} = require("../controllers/books");

router.get("/all", getAllBooks);
router.get("/allUser", getAllUserBooks);
router.post("/add", addBook);
router.delete("/delete", deleteBook);

module.exports = router;
