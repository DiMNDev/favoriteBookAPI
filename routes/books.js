const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  getAllUserCreated,
  getAllUserSaved,
  getAllUserCreatedFromArray,
  getAllUserSavedFromArray,
  saveBook,
  removeBook,
  toggleHeart,
  addComment,
  deleteComment,
  getOneBook,
} = require("../controllers/books");

//Get all Books
router.post("/one", getOneBook);
router.get("/all", getAllBooks);
//Get Books created by userid
router.get("/allUser", getAllUserCreated);
//Get Books from users createdFavoritesArray
router.get("/allUserArray", getAllUserCreatedFromArray);
//Get Books from users savedFavoritesArray
router.get("/allSavedArray", getAllUserSavedFromArray);
router.get("/allSaved", getAllUserSaved); //??
//Post new Book (append to createdFavoritesArray)
router.post("/addBook", addBook);
//Save favorite
router.post("/saveBook", saveBook);
//Remove favorite
router.post("/removeBook", removeBook);
router.post("/toggleHeart", toggleHeart);
router.delete("/delete", deleteBook);
router.post("/addComment", addComment);
router.post("/deleteComment", deleteComment);

module.exports = router;
