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
