// Requiring NPM packages
const express = require("express");

// Custom modules
const User = require("../models/user");
const File = require("../models/file");

// Creating Router
const router = express.Router();

router.get("/:id", async (req, res) => {
  const file = await File.findOne({ _id: req.params.id });
  if (!file) {
    return res.render("/404");
  }
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath);
});

module.exports = router;
