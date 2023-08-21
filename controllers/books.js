const Book = require("../models/books");

const addBook = async (req, res) => {
  const newBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    createdBy: req.user.userID,
    ISBN: req.body.ISBN,
  };
  const book = await Book.create(newBook);
  if (!book) {
    throw new Error("Oopsie Daisy");
  }

  console.log("add book");
  res.json(book);
};
const deleteBook = async (req, res) => {
  // provide id of book to delete
  // if user deleting is the one that created
  // delete book
  const bookForDeletion = {
    bookID: req.body.id,
  };
  const deletedBook = await Book.findOneAndRemove({
    _id: bookForDeletion.bookID,
  });
  if (!deletedBook) {
    throw new Error("Deletion Unsuccessful");
  }
  console.log(`Deleted book ${deletedBook}`);
  res.json(`Removed ${deletedBook.title}`);
};

const getAllUserBooks = async (req, res) => {
  const userFavorites = await Book.find({ createdBy: req.user.userID });
  if (!userFavorites) {
    throw new Error("Sumin done did messed up guy");
  }
  res.status(200).json({ userFavorites, count: userFavorites.length });
};

const getAllBooks = async (req, res) => {
  const allBooks = await Book.find();
  // console.log("All the books", allBooks);
  res.status(200).json({ allBooks, count: allBooks.length });
};

module.exports = { addBook, deleteBook, getAllBooks, getAllUserBooks };
