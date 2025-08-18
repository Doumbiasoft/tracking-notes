if (!getCurrentUser()) {
  location.href = getBaseUrl() + "index.html"; // Redirect if not logged in
} else {
  const preventNavigation = () => {
    // Clear any existing history
    history.replaceState(null, null, location.href);
  };
  // Initial prevention
  preventNavigation();
  window.onpopstate = function () {
    location.href = getBaseUrl() + "pages/notes.html";
  };
}

document.addEventListener("visibilitychange", function () {
  const currentUser = getCurrentUser();
  if (document.visibilityState === "visible") {
    if (currentUser) {
      if (!location.pathname.includes("notes.html")) {
        location.href = getBaseUrl() + "pages/notes.html";
      }
    } else {
      if (location.pathname.includes("notes.html")) {
        location.href = getBaseUrl() + "index.html";
      }
    }
  }
});
const $mainTitle = document.getElementById("mainTitle");
const $welcomeDisplay = document.getElementById("welcomeDisplay");
const $noteForm = document.getElementById("noteForm");
const $noteTitle = document.getElementById("noteTitle");
const $noteContent = document.getElementById("noteContent");
const $noteCode = document.getElementById("noteCode");
const $notesContainer = document.getElementById("notesContainer");
const $noteTemplate = document.querySelector("#noteTemplate");
const $closeModal = document.querySelector("#closeModal");
const $usernameDisplay = document.querySelector("#usernameDisplay");
const $emptyNotes = document.querySelector("#emptyNotes");
const $searchNotes = document.querySelector("#searchNotes");

// Edit mode variables
let isEditMode = false;
let editingNoteIndex = -1;

window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    $mainTitle.classList.add("text-xs");
    $welcomeDisplay.classList.add("text-xs");
  }
});

const currentUser = getCurrentUser();
const data = getData();
const user = data.find((user) => user.username === currentUser);

$usernameDisplay.textContent = user.username;
function handleDisplay(notesToCheck = user.notes) {
  hljs.highlightAll();
  if (notesToCheck.length > 0) {
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

function editNote(index) {
  isEditMode = true;
  editingNoteIndex = index;
  const note = user.notes[index];

  $noteTitle.value = note.title;
  $noteContent.value = note.content;
  $noteCode.value = note.code || "";

  // Update modal title
  const $modalTitle = document.querySelector("#crud-modal h3");
  $modalTitle.textContent = "Edit Note";

  // Update submit button text
  const $submitBtn = document.querySelector("#noteForm button[type='submit']");
  const submitText =
    $submitBtn.querySelector("span") ||
    $submitBtn.childNodes[$submitBtn.childNodes.length - 1];
  if (submitText.nodeType === Node.TEXT_NODE) {
    submitText.textContent = "Update note";
  } else {
    $submitBtn.innerHTML = $submitBtn.innerHTML.replace(
      "Add note",
      "Update note"
    );
  }
}

function resetModalToCreateMode() {
  isEditMode = false;
  editingNoteIndex = -1;

  // Reset modal title
  const $modalTitle = document.querySelector("#crud-modal h3");
  $modalTitle.textContent = "Create New Note";

  // Reset submit button text
  const $submitBtn = document.querySelector("#noteForm button[type='submit']");
  $submitBtn.innerHTML = $submitBtn.innerHTML.replace(
    "Update note",
    "Add note"
  );
  $noteForm.reset();
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
function renderNotes(notesToRender = user.notes) {
  $notesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  notesToRender.forEach((note) => {
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
      const actualIndex = user.notes.findIndex((n) => n === note);
      deleteNote(actualIndex);
      saveUsers(data);
      filterAndRender();
    });

    const editBtn = $noteElement.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      const actualIndex = user.notes.findIndex((n) => n === note);
      editNote(actualIndex);
      // Manually open modal
      $modal.classList.remove("hidden");
      $modal.classList.add("flex", "bg-gray-900/50");
      $modal.setAttribute("aria-hidden", "false");
    });

    fragment.appendChild($noteElement);
  });
  $notesContainer.appendChild(fragment);
  handleDisplay(notesToRender);

  // Reinitialize Flowbite components for new elements
  if (typeof window.initFlowbite === "function") {
    window.initFlowbite();
  }
}

function filterAndRender() {
  const searchTerm = $searchNotes.value.trim().toLowerCase();
  if (searchTerm === "") {
    renderNotes();
  } else {
    const filteredNotes = user.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
  }
}

$searchNotes.addEventListener("input", filterAndRender);

// Remove Flowbite attributes from close button
$closeModal.removeAttribute("data-modal-toggle");

$closeModal.addEventListener("click", () => {
  resetModalToCreateMode();
  // Manually close modal
  $modal.classList.add("hidden");
  $modal.classList.remove("flex", "bg-gray-900/50");
  $modal.setAttribute("aria-hidden", "true");
});

const $modal = document.querySelector("#crud-modal");
if ($modal) {
  $modal.addEventListener("click", (e) => {
    if (e.target === $modal) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$modal.classList.contains("hidden")) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  });
}

const $addNoteBtn = document.querySelector("[data-modal-target='crud-modal']");
if ($addNoteBtn) {
  $addNoteBtn.removeAttribute("data-modal-target");
  $addNoteBtn.removeAttribute("data-modal-toggle");

  $addNoteBtn.addEventListener("click", () => {
    resetModalToCreateMode();
    // Manually open modal
    $modal.classList.remove("hidden");
    $modal.classList.add("flex", "bg-gray-900/50");
    $modal.setAttribute("aria-hidden", "false");
  });
}
if ($noteForm) {
  $noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let code = "";
    if ($noteCode.value.trim()) {
      code = $noteCode.value.trim();
    }

    if (isEditMode) {
      // Update existing note
      user.notes[editingNoteIndex] = {
        title: $noteTitle.value.trim(),
        content: $noteContent.value.trim(),
        code: code,
      };
    } else {
      // Create new note
      user.notes.push({
        title: $noteTitle.value.trim(),
        content: $noteContent.value.trim(),
        code: code,
      });
    }

    saveData(data);
    $noteForm.reset();
    resetModalToCreateMode();
    // Manually close modal
    $modal.classList.add("hidden");
    $modal.classList.remove("flex", "bg-gray-900/50");
    $modal.setAttribute("aria-hidden", "true");
    filterAndRender();
  });
}

filterAndRender();
