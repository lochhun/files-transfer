const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authFaculty = async (req, res, next) => {
  const authToken = req.cookies.authTokenJWT;

  if (authToken == null || authToken == "") {
    res.redirect("/faculty/login");
    return;
  }
  jwt.verify(authToken, process.env.JWT_KEY, async (err, data) => {
    if (err) {
      res.redirect("/faculty/login");
      return;
    } else {
      const { _id } = data;
      const user = await User.findOne({ _id: _id });
      if (!user) {
        res.status(400).redirect("/faculty/login");
        return;
      }
      if (user.role != "faculty") {
        res.status(400).redirect("/faculty/login");
        return;
      }
      req.body.userId = user._id;
      next();
    }
  });
};

const passAuth = async (req, res, next) => {
  const authToken = req.cookies.authTokenJWT;

  if (authToken == null || authToken == "") {
    next();
    return;
  }
  jwt.verify(authToken, process.env.JWT_KEY, async (err, data) => {
    if (err) {
      next();
      return;
    } else {
      const { _id } = data;
      const user = await User.findOne({ _id: _id });
      if (!user) {
        next();
        return;
      }
      if (user.role != "faculty") {
        next();
        return;
      }
      req.body.userId = user._id;
      res.redirect("/faculty/home");
      return;
    }
  });
};

module.exports = { authFaculty, passAuth };
