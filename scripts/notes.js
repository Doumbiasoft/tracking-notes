if (!getCurrentUser()) {
  location.href = "../index.html"; // Redirect if not logged in
}
const $noteForm = document.getElementById("noteForm");
const $noteTitle = document.getElementById("noteTitle");
const $noteContent = document.getElementById("noteContent");
const $noteCode = document.getElementById("noteCode");
const $notesContainer = document.getElementById("notesContainer");
const $noteTemplate = document.querySelector("#noteTemplate");
const $closeModal = document.querySelector("#closeModal");
const $usernameDisplay = document.querySelector("#usernameDisplay");
const $emptyNotes = document.querySelector("#emptyNotes");

const currentUser = getCurrentUser();
const data = getData();
const user = data.find((user) => user.username === currentUser);

$usernameDisplay.textContent = user.username;
function handleDisplay() {
  hljs.highlightAll();
  if (user.notes.length > 0) {
    $notesContainer.style.display = "grid";
    $emptyNotes.style.display = "none";
  } else {
    $notesContainer.style.display = "none";
    $emptyNotes.style.display = "flex";
  }
}
function deleteNote(index) {
  user.notes.splice(index, 1);
  saveData(data);
  renderNotes();
}
function styleFirstNote() {
  if ($notesContainer.firstChild) {
    $notesContainer.firstChild.firstChild.classList.add(
      "ring",
      "ring-green-400",
      "bg-green-400"
    );
  }
}
function renderNotes() {
  $notesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  user.notes.forEach((note, index) => {
    const $noteElement = $noteTemplate.content.cloneNode(true);
    $noteElement.querySelector(".note-title").textContent = note.title;
    $noteElement.querySelector(".note-content").textContent = note.content;
    const $codeDisplayElement = $noteElement.querySelector("#codeDisplay");
    if (note.code && note.code.trim() !== "") {
      const $noteCodeElement = $noteElement.querySelector(
        "#codeDisplay .note-code"
      );
      $noteCodeElement.textContent = note.code;
      $codeDisplayElement.classList.remove("hidden");
    } else {
      $codeDisplayElement.classList.add("hidden");
    }
    $noteElement.querySelector(".delete-btn").addEventListener("click", () => {
      deleteNote(index);
      saveUsers(data);
      renderNotes();
    });
    fragment.appendChild($noteElement);
  });
  $notesContainer.appendChild(fragment);
  handleDisplay();
}
if ($noteForm) {
  $noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let code = "";
    if ($noteCode.value.trim()) {
      code = $noteCode.value.trim();
    }
    user.notes.push({
      title: $noteTitle.value.trim(),
      content: $noteContent.value.trim(),
      code: code,
    });
    saveData(data);
    $noteForm.reset();
    $closeModal.click();
    renderNotes();
  });
}

renderNotes();
handleDisplay();
