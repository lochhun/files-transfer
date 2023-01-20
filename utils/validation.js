let usernameRegex = new RegExp(/^[a-zA-Z1-9]{1}[a-zA-Z0-9]{4,20}$/);
let passRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);

const registerValidation = (username, password, confirmPassword) => {
  if (username == "" || username == null) {
    return false;
  }
  if (!usernameRegex.test(username)) {
    return false;
  }

  if (password == "" || password == null) {
    return false;
  }
  if (!passRegex.test(password)) {
    return false;
  }
  if (confirmPassword !== password) {
    return false;
  }
  return true;
};

const loginValidation = (username, password) => {
  if (username == "" || username == null) {
    return false;
  }
  if (!usernameRegex.test(username)) {
    return false;
  }

  if (password == "" || password == null) {
    return false;
  }
  if (!passRegex.test(password)) {
    return false;
  }
  return true;
};

module.exports = { registerValidation, loginValidation };
