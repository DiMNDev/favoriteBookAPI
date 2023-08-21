//Router
const router = require("express").Router();
//Swag😎
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json");
//Route to serve UI
router.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);
//export
module.exports = router;
