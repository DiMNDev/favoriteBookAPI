const swag = require("swagger-autogen")();

const doc = {
  info: {
    title: "Favorite Books",
    description: "What's yours?",
  },
  host: "favoritebookapi.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger_output.json";
const controllerFiles = ["./routes/index"];

swag(outputFile, controllerFiles, doc);
