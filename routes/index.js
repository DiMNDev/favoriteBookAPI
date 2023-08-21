const router = require("express").Router();

router.use("/", require("./swagger"));
router.use("/user", require("./user"));

module.exports = router;
