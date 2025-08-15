const regexOfNoSpecialCharacterOrWhiteSpaceInText = /^[a-zA-Z0-9]+$/;
const regexOfCheckPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?!.*[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]).{12,}$/;

const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const setCurrentUser = (username) => {
  localStorage.setItem("currentUser", username);
};

const getCurrentUser = () => {
  return localStorage.getItem("currentUser");
};

const logout = () => {
  localStorage.removeItem("currentUser");
  location.href = "../index.html";
};
const $errorDisplay = document.querySelector("#errorDisplay");
const $successDisplay = document.querySelector("#successDisplay");

const createErrorsElements = (errors) => {
  $errorDisplay.innerHTML = "";
  $successDisplay.innerHTML = "";
  $successDisplay.style.display = "none";
  const $ul = document.createElement("ul");
  const $errorTitle = document.createElement("label");
  $errorTitle.textContent = errors.length > 1 ? "Errors:" : "Error:";
  errorDisplay.appendChild($errorTitle);
  for (let error of errors) {
    const $li = document.createElement("li");
    $li.textContent = error;
    $ul.appendChild($li);
  }
  $errorDisplay.appendChild($ul);
  $errorDisplay.style.display = "block";
};
const createSuccessElements = (isSaved, message) => {
  $successDisplay.innerHTML = "";
  $errorDisplay.innerHTML = "";
  $errorDisplay.style.display = "none";
  if (isSaved) {
    const success = document.createElement("h3");
    success.textContent = message;
    successDisplay.appendChild(success);
    $successDisplay.style.display = "block";
  } else {
    $successDisplay.innerHTML = "";
    $successDisplay.style.display = "none";
  }
};

const $registerForm = document.getElementById("registerForm");
if ($registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const $username = document.getElementById("regUsername").value.trim();
    const $password = document.getElementById("regPassword").value.trim();

    const users = getUsers();
    if (users.find((u) => u.username === $username)) {
      alert("Username already taken!");
      return;
    }

    users.push({ $username, $password, notes: [] });
    saveUsers(users);
    alert("Registration successful! Please log in.");
    location.href = "../index.html";
  });
}
