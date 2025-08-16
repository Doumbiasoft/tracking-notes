const regexOfNoSpecialCharacterOrWhiteSpaceInText = /^[a-zA-Z0-9]+$/;
const regexOfCheckPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?!.*[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]).{12,}$/;

const $errorDisplay = document.querySelector("#errorDisplay");
const $successDisplay = document.querySelector("#successDisplay");
const $infoModal = document.getElementById("infoModal");
const $registerForm = document.getElementById("registerForm");
const $regUsername = document.getElementById("regUsername");
const $regPassword = document.getElementById("regPassword");
const $confirmRegPassword = document.getElementById("confirmRegPassword");

const $loginForm = document.getElementById("loginForm");
const $loginUsername = document.getElementById("loginUsername");
const $loginPassword = document.getElementById("loginPassword");

const encryptB64 = (str) => {
  return btoa(str);
};
const decryptB64 = (base64Str) => {
  return atob(base64Str);
};

const getData = () => {
  const encryptedData = localStorage.getItem("TrackingNotesDB");
  if (encryptedData) {
    try {
      const decryptedString = decryptB64(encryptedData);
      return JSON.parse(decryptedString);
    } catch (e) {
      console.error("Error decrypting or parsing data from localStorage:", e);
      return [];
    }
  }
  return [];
};
const saveData = (data) => {
  localStorage.setItem("TrackingNotesDB", encryptB64(JSON.stringify(data)));
};

const setCurrentUser = (username) => {
  localStorage.setItem("trackingNotesCurrentUser", encryptB64(username));
};

const getCurrentUser = () => {
  const encryptedData = localStorage.getItem("trackingNotesCurrentUser");
  if (encryptedData) {
    const decryptedString = decryptB64(encryptedData);
    return decryptedString;
  } else {
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("trackingNotesCurrentUser");
  location.href = "../index.html";
};
const loggedUser = getCurrentUser();
if (loggedUser) {
  window.onload = function () {
    history.forward();
  };
}
const createErrorsElements = (errors) => {
  $errorDisplay.innerHTML = "";
  $successDisplay.innerHTML = "";
  $successDisplay.style.display = "none";
  const $ul = document.createElement("ul");
  const $errorTitle = document.createElement("h3");
  $errorTitle.textContent = errors.length > 1 ? "Errors:" : "Error:";
  $errorDisplay.appendChild($errorTitle);
  for (let error of errors) {
    const $li = document.createElement("li");
    $li.textContent = error;
    $ul.appendChild($li);
  }
  $errorDisplay.appendChild($ul);
  $errorDisplay.style.display = "block";
  $infoModal.click();
};
const createSuccessElements = (isSaved, message) => {
  $successDisplay.innerHTML = "";
  $errorDisplay.innerHTML = "";
  $errorDisplay.style.display = "none";
  if (isSaved) {
    const success = document.createElement("h3");
    success.textContent = message;
    $successDisplay.appendChild(success);
    $successDisplay.style.display = "block";
    infoModal.click();
  } else {
    $successDisplay.innerHTML = "";
    $successDisplay.style.display = "none";
  }
  $infoModal.click();
};

const registrationValidations = () => {
  let errorMessage = "";
  let isError = false;
  const errors = [];

  try {
    if ($regUsername.value.trim().length === 0) {
      isError = true;
      errorMessage = `* The username cannot be blank.`;
      errors.push(errorMessage);
    }
    if ($regUsername.value.trim().length < 4) {
      isError = true;
      errorMessage = `* The username must be at least four characters long.`;
      errors.push(errorMessage);
    }
    if (
      !regexOfNoSpecialCharacterOrWhiteSpaceInText.test(
        $regUsername.value.trim()
      )
    ) {
      isError = true;
      errorMessage = `* The username cannot contain any special characters or whitespace.`;
      errors.push(errorMessage);
    }
    if (!regexOfCheckPassword.test($regPassword.value.trim())) {
      isError = true;
      errorMessage = `* Passwords must be at least 12 characters long.`;
      errors.push(errorMessage);
      errorMessage = `* Passwords must have at least one uppercase and one lowercase letter.`;
      errors.push(errorMessage);
      errorMessage = `* Passwords must contain at least one number.`;
      errors.push(errorMessage);
      errorMessage = `* Passwords must contain at least one special character.`;
      errors.push(errorMessage);
      errorMessage = `* Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).`;
      errors.push(errorMessage);
    }
    if ($regPassword.value.trim().includes($regUsername.value.trim())) {
      isError = true;
      errorMessage = `* Passwords cannot contain the username.`;
      errors.push(errorMessage);
    }
    if ($regPassword.value.trim() !== $confirmRegPassword.value.trim()) {
      isError = true;
      errorMessage = `* Both passwords must match.`;
      errors.push(errorMessage);
    }
    if (errors.length > 0) {
      createErrorsElements(errors);
    } else {
      $errorDisplay.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
  return isError;
};
const loginValidations = () => {
  let errorMessage = "";
  let isError = false;
  const errors = [];

  try {
    if ($loginUsername.value.trim().length === 0) {
      isError = true;
      errorMessage = `* The username cannot be blank.`;
      errors.push(errorMessage);
    }
    if ($loginPassword.value.trim().length === 0) {
      isError = true;
      errorMessage = `* The password cannot be blank.`;
      errors.push(errorMessage);
    }

    if (errors.length > 0) {
      createErrorsElements(errors);
    } else {
      $errorDisplay.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
  return isError;
};
if ($registerForm) {
  $registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isError = registrationValidations();
    if (isError) return;
    const data = getData();
    if (
      data.find(
        (user) => user.username === $regUsername.value.trim().toLowerCase()
      )
    ) {
      const errors = ["* Username already taken!"];
      createErrorsElements(errors);
      return;
    }
    const newUser = {
      username: $regUsername.value.trim().toLowerCase(),
      password: $regPassword.value.trim(),
      notes: [],
    };
    data.push(newUser);
    saveData(data);
    $registerForm.reset();
    createSuccessElements(!isError, "Successfully registered!");

    setTimeout(() => {
      $infoModal.click();
      $errorDisplay.style.display = "none";
      $successDisplay.style.display = "none";
      $errorDisplay.innerHTML = "";
      $successDisplay.innerHTML = "";
      location.href = "../index.html";
    }, 3000);
  });
}

if ($loginForm) {
  $loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isError = loginValidations();
    if (isError) return;
    const data = getData();
    const user = data.find(
      (user) =>
        user.username === $loginUsername.value.trim() &&
        user.password === $loginPassword.value.trim()
    );
    if (!user) {
      const errors = ["* Invalid credentials!"];
      createErrorsElements(errors);
      return;
    }
    setCurrentUser($loginUsername.value.trim().toLowerCase());
    $loginForm.reset();
    setTimeout(() => {
      $errorDisplay.style.display = "none";
      $successDisplay.style.display = "none";
      $errorDisplay.innerHTML = "";
      $successDisplay.innerHTML = "";
      location.href = "../pages/notes.html";
    }, 3000);
  });
}
