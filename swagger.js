const swag = require("swagger-autogen")();

const doc = {
  info: {
    title: "Favorite Books",
    description: "What's yours?",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const controllerFiles = ["./routes/index"];

swag(outputFile, controllerFiles, doc);
