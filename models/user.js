require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { count } = require("./books");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedFavorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book", unique: true },
  ],
  createdFavorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book", unique: true },
  ],
});

UserSchema.pre("save", async function () {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.getID = function () {
  return this._id;
};
UserSchema.methods.getName = function () {
  return this.username;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userID: this._id,
      name: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.saveBook = async function (bookId, created) {
  console.log("SAVE:bookId:", bookId);
  let unique = await this.validateUniqueness(bookId, created);
  console.log("unique:", unique);
  if (created) {
    if (unique) {
      this.createdFavorites.push(bookId);
      console.log(`Book ${bookId} created by user ${this._id}`);
      this.save();
    } else {
      console.log(`Book ${bookId} already exists for user ${this._id}.`);
    }
  } else {
    if (unique) {
      this.savedFavorites.push(bookId);
      console.log(`Updated saved favorites for user ${this._id}`);
      this.save();
    } else {
      console.log(`Book ${bookId} already saved for user ${this._id}.`);
    }
  }
  return "added";
};

UserSchema.methods.removeBook = async function (bookId) {
  console.log("REMOVE:bookId:", bookId);
  for (const [index, value] of this.savedFavorites.entries()) {
    if (JSON.stringify(bookId) == JSON.stringify(value)) {
      this.savedFavorites.splice(index, 1);
      console.log(`Removed ${bookId} at index ${index}`);
      this.save();
    }
  }
  return "removed";
};

UserSchema.methods.toggleSaved = async function (bookId) {
  let response = "empty";
  const unique = this.validateUniqueness(bookId, false);
  if (unique) {
    response = this.saveBook(bookId, false);
  } else {
    response = this.removeBook(bookId);
  }
  return response;
};

UserSchema.methods.validateUniqueness = function (id, created) {
  console.log("created:", created);
  if (created) {
    for (const [index, value] of this.createdFavorites.entries()) {
      if (JSON.stringify(id) == JSON.stringify(value)) {
        console.log(`${id} == @ index ${index}`);
        return false;
      }
    }
    return true;
  } else {
    for (const [index, value] of this.savedFavorites.entries()) {
      if (JSON.stringify(id) == JSON.stringify(value)) {
        console.log(`${id} == @ index ${index}`);
        return false;
      }
    }
    return true;
  }
};

UserSchema.methods.comparePassword = async function (canidatePassword) {
  const isMatch = await bcrypt.compare(canidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
