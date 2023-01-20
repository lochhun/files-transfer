const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authStudent = async (req, res, next) => {
  const authToken = req.cookies.authTokenJWT;

  if (authToken == null || authToken == "") {
    res.redirect("/student/login");
    return;
  }
  jwt.verify(authToken, process.env.JWT_KEY, async (err, data) => {
    if (err) {
      res.redirect("/student/login");
      return;
    } else {
      const { _id } = data;
      const user = await User.findOne({ _id: _id });
      if (!user) {
        res.status(400).redirect("/student/login");
        return;
      }
      if (user.role != "student") {
        res.status(400).redirect("/student/login");
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
      if (user.role != "student") {
        next();
        return;
      }
      res.redirect("/student/home");
      return;
    }
  });
};

module.exports = { authStudent, passAuth };
