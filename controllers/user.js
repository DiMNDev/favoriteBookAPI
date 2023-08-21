const User = require("../models/user");

const register = async (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  if (!newUser.username || !newUser.password) {
    throw new Error("Oopsie Daisy");
  }
  const user = await User.create(newUser);
  if (!user) {
    throw new Error("Oopsie Daisy");
  }
  const token = user.createJWT();
  console.log(`Welcome ${newUser.username}`);
  res.json({ user: { username: user.username }, token });
};

const login = async (req, res) => {
  const loginInfo = {
    email: req.body.email,
    password: req.body.password,
  };
  if (!loginInfo) {
    throw new Error("Please provide credentials");
  }
  const user = await User.findOne({ email: loginInfo.email });
  if (!user) {
    throw new Error("Oopsie Daisy");
  }
  const correctPassword = await user.comparePassword(loginInfo.password);
  if (!correctPassword) {
    throw new Error("Done did messed up sumn");
  }
  const token = user.createJWT();
  res.status(200).json({ user: { name: user.username }, token });
  console.log("Login");
};

module.exports = { register, login };
