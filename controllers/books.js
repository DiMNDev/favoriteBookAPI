const Book = require("../models/books");
const User = require("../models/user");

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
  console.log("bookId:", book.id);

  const user = await User.findById({ _id: req.user.userID });
  if (!user) {
    throw new Error(
      `Bad Authentication while updating user ${req.user.userID}`
    );
  }
  user.saveBook(book.id, true);
  console.log(book);
  console.log(`${req.user.name}`);
  res.json(book);
};
const deleteBook = async (req, res) => {
  // provide id of book to delete
  // if user deleting is the one that created
  // delete book
  const bookForDeletion = {
    bookID: req.body.id,
  };
  const lookUpBook = await Book.findById(bookForDeletion.bookID);
  // console.log("createdBy:", lookUpBook.createdBy);
  if (!lookUpBook) {
    throw new Error(`Could not find book with id:${bookForDeletion.bookID}`);
  } else {
    if (lookUpBook.createdBy == req.user.userID) {
      const deletedBook = await Book.findOneAndRemove({
        _id: bookForDeletion.bookID,
      });
      if (!deletedBook) {
        throw new Error("Deletion Unsuccessful");
      }
      console.log(`Deleted book ${deletedBook}`);
      res.json(`Removed ${deletedBook.title}`);
    } else {
      throw new Error(`You can not delete someone elses favorite book`);
    }
  }
};
const saveBook = async (req, res) => {
  const bookToSave = {
    ISBN: req.body.ISBN,
  };
  const book = await Book.findOne({ ISBN: bookToSave.ISBN });
  console.log(book);
  if (!book) {
    throw new Error("Oopsie Daisy");
  }
  const user = await User.findById({ _id: req.user.userID });
  if (!user) {
    throw new Error(
      `Bad Authentication while updating user ${req.user.userID}`
    );
  }
  console.log(book._id);
  user.saveBook(book._id, false);
  console.log(`${req.user.name}`);
  res.json(book);
};
const removeBook = async (req, res) => {
  const bookToRemove = {
    userID: req.user.userID,
    ISBN: req.body.ISBN,
  };
  //Get Book
  const book = await Book.findOne({ ISBN: bookToRemove.ISBN });
  console.log(book);
  if (!book) {
    throw new Error("Oopsie Daisy");
  }
  //Get user
  const user = await User.findById(bookToRemove.userID);
  console.log(user);
  if (!user) {
    throw new Error("Unable to find user");
  }
  //Check Array
  user.removeBook(book._id);
  //Remove if id is present
  res.json(`Removed ${book._id} from saved favorties of user ${user._id}`);
};
const getOneBook = async (req, res) => {
  const requestData = {
    ISBN: req.body.ISBN,
  };
  const book = await Book.findOne({ ISBN: requestData.ISBN });
  if (!book) {
    throw new Error("Could not find that book");
  }
  res.json(book);
};
const toggleHeart = async (req, res) => {
  const ids = {
    userID: req.user.userID,
    ISBN: req.body.ISBN,
  };

  const book = await Book.findOne({ ISBN: ids.ISBN });
  if (!book) {
    throw new Error("Can not find that book");
  }

  const user = await User.findById(ids.userID);
  if (!user) {
    throw new Error("Can not find that user");
  }
  const responseMessage = await user.toggleSaved(book._id);
  res.json(responseMessage);
};
const getAllUserCreated = async (req, res) => {
  const userCreated = await Book.find({ createdBy: req.user.userID });
  if (!userCreated) {
    throw new Error("Sumin done did messed up guy");
  }
  res.status(200).json({ userCreated, count: userCreated.length });
};
const getAllUserCreatedFromArray = async (req, res) => {
  const user = await User.findById(req.user.userID);
  if (!user) {
    throw new Error("Sumin done did messed up guy");
  }
  let counter = 0;
  let books = [];
  let ids = user.createdFavorites
    .map((id) => {
      return id.toString();
    })
    .forEach(async (id, index, idArray) => {
      const book = await getBookFromId(id);
      // console.log("Array of Books", books);
      books.push(book);
      // console.log("index", index);
      // console.log("idLength:", idArray.length);
      counter++;
      if (counter === idArray.length) {
        checkOut(books);
      }
    });
  const checkOut = (books) => {
    try {
      if (books) {
        // console.log("Books:", books);
        res.status(200).json({ books, count: books.length });
      }
    } catch (error) {
      console.log("Mission Failed. We'll get'em next time.");
      throw new Error("Uh oh..");
    }
  };
};
const getAllUserSavedFromArray = async (req, res) => {
  const user = await User.findById(req.user.userID);
  if (!user) {
    throw new Error("Sumin done did messed up guy");
  }
  let counter = 0;
  let books = [];
  let ids = user.savedFavorites
    .map((id) => {
      return id.toString();
    })
    .forEach(async (id, index, idArray) => {
      const book = await getBookFromId(id);
      books.push(book);
      counter++;
      if (counter === idArray.length) {
        checkOut(books);
      }
    });
  const checkOut = (books) => {
    try {
      if (books) {
        res.status(200).json({ books, count: books.length });
      }
    } catch (error) {
      console.log("Mission Failed. We'll get'em next time.");
      throw new Error("Uh oh..");
    }
  };
};
const getBookFromId = async (bookId) => {
  const book = await Book.findOne({ _id: bookId });
  // console.log("id:", bookId);
  if (!book) {
    throw new Error("Could not find book");
  }
  return book;
};
const getAllUserSaved = async (req, res) => {
  const user = await User.findById(req.user.userID);
  const favorites = user.savedFavorites;
  res.status(200).json({ favorites, count: favorites.length });
};
const getAllBooks = async (req, res) => {
  const allBooks = await Book.find();
  // console.log("All the books", allBooks);
  res.status(200).json({ allBooks, count: allBooks.length });
};
const addComment = async (req, res) => {
  const commentData = {
    ISBN: req.body.ISBN,
    userID: req.user.userID,
    comment: req.body.comment,
  };
  console.log(commentData);
  const user = await User.findById(req.user.userID);
  if (!user) {
    throw new Error("Can not find that user");
  }
  let username = user.getName();
  const book = await Book.findOne({ ISBN: commentData.ISBN });
  if (!book) {
    throw new Error("Can not find that book");
  }
  const commentAdded = book.addComment(
    commentData.userID,
    username,
    commentData.comment
  );
  if (commentAdded) {
    res.json(commentAdded);
  }
};
const deleteComment = async (req, res) => {
  const commentData = {
    ISBN: req.body.ISBN,
    commentID: req.body.commentID,
    userID: req.user.userID,
  };
  console.log(commentData);

  const book = await Book.findOne({ ISBN: commentData.ISBN });
  if (!book) {
    throw new Error("Can not find that book");
  }
  const commentDeleted = book.deleteComment(
    //For Authentication
    commentData.userID,
    //For Targeting
    commentData.commentID
  );
  if (commentDeleted) {
    res.json(commentDeleted);
  }
};

module.exports = {
  addBook,
  saveBook,
  removeBook,
  toggleHeart,
  deleteBook,
  getOneBook,
  getAllBooks,
  getAllUserCreated,
  getAllUserSaved,
  getAllUserCreatedFromArray,
  getAllUserSavedFromArray,
  addComment,
  deleteComment,
};
