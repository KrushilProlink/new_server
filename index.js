const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectdb");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const applyPassportStrategy = require("./middlewares/passport");
const serverRoutes = require("./routes/serverRoutes");

//Setup Express App
const app = express();

// env config
dotenv.config();

// Set up CORS
app.use(cors());

applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", serverRoutes);

// Get port from environment and store in Express.
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listining at http://localhost:${port}`);
});

//Database Connection
const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
connectDB(DATABASE_URL);
