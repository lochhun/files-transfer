const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");

let usernameRegex = new RegExp(/^[a-zA-Z1-9]{1}[a-zA-Z0-9]{4,20}$/);
let passRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);

loginForm.addEventListener("submit", function (e) {
  let loginMessages = [];

  // Username Validation
  if (loginUsername.value == "" || loginUsername.value == null) {
    loginMessages.push("Username cannot be empty.");
  }
  if (!usernameRegex.test(loginUsername.value)) {
    loginMessages.push("Enter valid username");
  }

  // Password Validation
  if (loginPassword.value == "" || loginPassword.value == null) {
    loginMessages.push("Password cannot be empty.");
  }
  if (!passRegex.test(loginPassword.value)) {
    loginMessages.push(
      "Password must be 6 to 20 characters long with minimum of 1 number, 1 uppercase and 1 lowercase."
    );
  }

  if (loginMessages.length > 0) {
    e.preventDefault();
    loginError.innerHTML = loginMessages.join("<br> ");
  } else {
    loginError.innerHTML = "";
  }
});

loginForm.addEventListener("keyup", function (e) {
  let loginMessages = [];

  // Username Validation
  if (loginUsername.value == "" || loginUsername.value == null) {
    loginMessages.push("Username cannot be empty.");
  }
  if (!usernameRegex.test(loginUsername.value)) {
    loginMessages.push("Enter valid username");
  }

  // Password Validation
  if (loginPassword.value == "" || loginPassword.value == null) {
    loginMessages.push("Password cannot be empty.");
  }
  if (!passRegex.test(loginPassword.value)) {
    loginMessages.push(
      "Password must be 6 to 20 characters long with minimum of 1 number, 1 uppercase and 1 lowercase."
    );
  }

  if (loginMessages.length > 0) {
    e.preventDefault();
    loginError.innerHTML = loginMessages.join("<br> ");
  } else {
    loginError.innerHTML = "";
  }
});
