const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  comments: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

BookSchema.methods.getID = function () {
  return this._id;
};

BookSchema.methods.addComment = async function (userID, username, comment) {
  if ((!userID, !username, !comment)) {
    throw new Error("Bad request - missing data");
  }
  this.comments.push({
    userID: userID,
    username: username,
    comment: comment,
  });
  this.save();
  return "saved new comment";
};

BookSchema.methods.deleteComment = async function (userID, commentID) {
  if ((!userID, !commentID)) {
    throw new Error("Bad request - missing data");
  }
  let response = "";
  for (const [index, comment] of this.comments.entries()) {
    if (comment._id == commentID) {
      console.log(`Comment exists at ${index}`);
      if (comment.userID == userID) {
        console.log(`You created this comment`);
        this.comments.splice(index, 1);
        this.save();
        return (response = `deleted`);
      } else {
        console.log("You did not create this comment");
        return (response = `${comment._id} is not a comment you can delete`);
      }
    }
  }
  return response || "Done did messed up deleting the comment";
};

module.exports = mongoose.model("Book", BookSchema);
