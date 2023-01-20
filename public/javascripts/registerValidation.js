const registerForm = document.getElementById("register-form");
const registerError = document.getElementById("register-error");

const registerUsername = document.getElementById("username");
const registerPassword = document.getElementById("password");
const registerConfirmPassword = document.getElementById("confirmPassword");

let usernameRegex = new RegExp(/^[a-zA-Z1-9]{1}[a-zA-Z0-9]{4,20}$/);
let passRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);

registerForm.addEventListener("submit", function (e) {
  let registerMessages = [];

  // Username Validation
  if (registerUsername.value == "" || registerUsername.value == null) {
    registerMessages.push("Username cannot be empty.");
  }
  if (!usernameRegex.test(registerUsername.value)) {
    registerMessages.push("Enter valid username");
  }

  // Password Validation
  if (registerPassword.value == "" || registerPassword.value == null) {
    registerMessages.push("Password cannot be empty.");
  }
  if (!passRegex.test(registerPassword.value)) {
    registerMessages.push(
      "Password must be 6 to 20 characters long with minimum of 1 number, 1 uppercase and 1 lowercase."
    );
  }
  if (registerConfirmPassword.value !== registerPassword.value) {
    registerMessages.push("Password and Confirm Password should be same.");
  }

  if (registerMessages.length > 0) {
    e.preventDefault();
    registerError.innerHTML = registerMessages.join("<br> ");
  } else {
    registerError.innerHTML = "";
  }
});

registerForm.addEventListener("keyup", function (e) {
  let registerMessages = [];

  // Username Validation
  if (registerUsername.value == "" || registerUsername.value == null) {
    registerMessages.push("Username cannot be empty.");
  }
  if (!usernameRegex.test(registerUsername.value)) {
    registerMessages.push("Enter valid username");
  }

  // Password Validation
  if (registerPassword.value == "" || registerPassword.value == null) {
    registerMessages.push("Password cannot be empty.");
  }
  if (!passRegex.test(registerPassword.value)) {
    registerMessages.push(
      "Password must be 6 to 20 characters long with minimum of 1 number, 1 uppercase and 1 lowercase."
    );
  }
  if (registerConfirmPassword.value !== registerPassword.value) {
    registerMessages.push("Password and Confirm Password should be same.");
  }

  if (registerMessages.length > 0) {
    e.preventDefault();
    registerError.innerHTML = registerMessages.join("<br> ");
  } else {
    registerError.innerHTML = "";
  }
});
