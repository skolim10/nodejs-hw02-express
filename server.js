const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

app.listen(3000, () => {
  console.log("\nServer running. Use our API on port: 3000");
});

dotenv.config();

mongoose
  .connect(process.env.DB_HOST, {})
  .then(() => {
    console.log("\nDatabase connection successful\n");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

function signalHandler() {
  console.log("Database disconnected");
  mongoose.disconnect();
}
process.on("SIGINT", signalHandler);
