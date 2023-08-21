const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { login, register } = require("../controllers/user");

router.post("/login", login);
router.post("/register", register);

router.use("/books", auth, require("./books"));

module.exports = router;
