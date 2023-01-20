// Requiring NPM packages
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Custom modules
const User = require("../models/user");
const File = require("../models/file");
const { registerValidation, loginValidation } = require("../utils/validation");
const { authFaculty, passAuth } = require("../middleware/facultyAuth");

// Creating Router
const router = express.Router();

// GET /home
router.get("/", authFaculty, async (req, res) => {
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

  res.render("faculty/dashboard", { files: files });
});
router.get("/home", authFaculty, async (req, res) => {
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

  res.render("faculty/dashboard", { files: files });
});

// GET /login
router.get("/login", passAuth, (req, res) => {
  res.render("faculty/login");
});

// GET /register
router.get("/register", passAuth, (req, res) => {
  res.render("faculty/register");
});

// GET /upload
router.get("/upload", authFaculty, (req, res) => {
  res.render("faculty/upload");
});

// GET /docs
router.get("/docs", authFaculty, async (req, res) => {
  const files = await File.aggregate([
    {
      $match: {
        faculty: {
          $eq: req.body.userId,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "faculty",
        foreignField: "_id",
        as: "facultyName",
      },
    },
  ]);
  res.render("faculty/docs", { files });
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!loginValidation(username, password)) {
    res.status(400).render("faculty/error", {
      errorCode: 400,
      errorMessage: "400 - Bad Request",
    });
    return;
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    res
      .status(400)
      .render("faculty/login", { message: "Invalid username / password" });
    return;
  }

  const passCheck = await bcrypt.compare(password, user.password);
  if (!passCheck) {
    res
      .status(400)
      .render("faculty/login", { message: "Invalid username / password" });
    return;
  }

  if (user.role != "faculty") {
    res
      .status(400)
      .render("faculty/login", { message: "Invalid username / password" });
    return;
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );
  res.cookie("authTokenJWT", token, { maxAge: 24 * 60 * 60 * 1000 });
  res.redirect("/faculty/home");
});

// POST /register
router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!registerValidation(username, password, confirmPassword)) {
    res.status(400).render("faculty/error", {
      errorCode: 400,
      errorMessage: "400 - Bad Request",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username: username,
    password: hashedPassword,
    role: "faculty",
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code == 11000) {
      res
        .status(400)
        .render("faculty/register", { message: "Username already present" });
      return;
    }
    res.status(500).render("faculty/error", {
      errorCode: 500,
      errorMessage: "500 - Internal Server Error",
    });
    return;
  }

  res.status(200).redirect("/faculty/login");
});

// Multer Storage
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "_" + req.body.filename + path.extname(file.originalname)
    );
  },
});

// Multer Object
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576, // 10Mb
  },
}).single("file");

// POST /upload
router.post("/upload", authFaculty, async (req, res) => {
  const userId = req.body.userId;
  const filename = req.body.filename;
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).render("faculty/upload", {
        message: `${err.message}. Please try again... `,
      });
      return;
    }
    const file = new File({
      filename: req.body.filename,
      path: req.file.path,
      size: req.file.size,
      faculty: userId,
    });

    try {
      await file.save();
    } catch (error) {
      res.status(500).render("faculty/upload", {
        message: `${error}. Please try again... `,
      });
      return;
    }

    res.status(200).redirect("/faculty/home");
  });
});

// GET /delete
router.get("/delete/:id", async (req, res) => {
  File.findOne({ _id: req.params.id }, (err, file) => {
    if (err) {
      return res.render("/404");
    }
    if (!file) {
      return res.render("/404");
    }
    const filePath = `${__dirname}/../${file.path}`;
    fs.unlinkSync(filePath);
    file.remove();
    res.status(200).redirect("/faculty/docs");
  });
});

// GET /logout
router.get("/logout", authFaculty, (req, res) => {
  res
    .clearCookie("authTokenJWT")
    .clearCookie("userId")
    .redirect("/faculty/login");
});

// 404 Page
router.use(function (req, res, next) {
  res.status(404).render("faculty/error", {
    errorCode: 404,
    errorMessage: "404 - Page not found",
  });
});

module.exports = router;
