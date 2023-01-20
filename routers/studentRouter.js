// Requiring NPM packages
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Custom modules
const User = require("../models/user");
const File = require("../models/file");
const { registerValidation, loginValidation } = require("../utils/validation");
const { authStudent, passAuth } = require("../middleware/studentAuth");

// Creating Router
const router = express.Router();

// GET /home
router.get("/", authStudent, async (req, res) => {
  const files = await File.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "faculty",
        foreignField: "_id",
        as: "facultyName",
      },
    },
  ]);

  res.render("student/dashboard", { files: files });
});
router.get("/home", authStudent, async (req, res) => {
  const files = await File.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "faculty",
        foreignField: "_id",
        as: "facultyName",
      },
    },
  ]);

  res.render("student/dashboard", { files: files });
});

// GET /login
router.get("/login", passAuth, (req, res) => {
  res.render("student/login");
});

// GET /register
router.get("/register", passAuth, (req, res) => {
  res.render("student/register");
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!loginValidation(username, password)) {
    res.status(400).render("student/error", {
      errorCode: 400,
      errorMessage: "400 - Bad Request",
    });
    return;
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    res
      .status(400)
      .render("student/login", { message: "Invalid username / password" });
    return;
  }

  const passCheck = await bcrypt.compare(password, user.password);
  if (!passCheck) {
    res
      .status(400)
      .render("student/login", { message: "Invalid username / password" });
    return;
  }

  if (user.role != "student") {
    res
      .status(400)
      .render("student/login", { message: "Invalid username / password" });
    return;
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );
  res.cookie("authTokenJWT", token, { maxAge: 24 * 60 * 60 * 1000 });
  res.redirect("/student/home");
});

// POST /register
router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!registerValidation(username, password, confirmPassword)) {
    res.status(400).render("student/error", {
      errorCode: 400,
      errorMessage: "400 - Bad Request",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username: username,
    password: hashedPassword,
    role: "student",
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code == 11000) {
      res
        .status(400)
        .render("student/register", { message: "Username already present" });
      return;
    }
    res.status(500).render("student/error", {
      errorCode: 500,
      errorMessage: "500 - Internal Server Error",
    });
    return;
  }

  res.status(200).redirect("/student/login");
});

// GET /logout
router.get("/logout", (req, res) => {
  res.clearCookie("authTokenJWT").redirect("/student/login");
});

// 404 Page
router.use(function (req, res, next) {
  res.status(404).render("student/error", {
    errorCode: 404,
    errorMessage: "404 - Page not found",
  });
});

module.exports = router;
