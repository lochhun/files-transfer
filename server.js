// Requiring NPM packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");

// Requiring Routers
const homeRouter = require("./routers/homeRouter");
const facultyRouter = require("./routers/facultyRouter");
const studentRouter = require("./routers/studentRouter");
const downloadRouter = require("./routers/downloadRouter");

const path = require("path");

// Environment variables
dotenv.config();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

// Mongo Connection
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("connected", () => {
  console.log(`DB Connected at ${DB_URI}`);
});

db.on("error", (e) => {
  console.log(`DB Error : ${e}`);
});

// Creating a express application
const app = express();

// Middleware for app instance
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cookie());

// Handling routes
app.use("/", homeRouter);
app.use("/student", studentRouter);
app.use("/faculty", facultyRouter);
app.use("/download", downloadRouter);

// 404 Page
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// Creating a server at ${PORT}
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
