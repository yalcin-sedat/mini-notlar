import { createNote } from "./notes.js";
import { loadNotes, loadTheme, saveNotes, saveTheme } from "./storage.js";
import {
  applyTheme,
  clearNoteError,
  closeDeleteModal,
  elements,
  getSelectedColor,
  hideEditMode,
  isDeleteModalOpen,
  openClearNotesModal,
  openSingleDeleteModal,
  renderNotes,
  selectColor,
  showEditMode,
  showNoteError,
  showStatusMessage,
  updateCharacterCount,
  updateClearSearchButton,
} from "./ui.js";

// Bu dosya uygulamanin ana akisini yonetir.
// Veriyi tutar, kullanici olaylarini dinler ve diger dosyalardaki fonksiyonlari birlestirir.

let notes = loadNotes();
let currentTheme = loadTheme();
let noteIndexToDelete = null;
let noteIndexToEdit = null;
let shouldDeleteAllNotes = false;

function updateScreen() {
  updateClearSearchButton();

  renderNotes(notes, {
    onEdit: startEditNote,
    onDelete: openDeleteModal,
    onTogglePin: togglePinNote,
  });
}

function saveAndRender() {
  saveNotes(notes);
  updateScreen();
}

function startEditNote(index) {
  noteIndexToEdit = index;
  showEditMode(notes[index].text);
  selectColor(notes[index].color);
}

function cancelEditNote() {
  noteIndexToEdit = null;
  hideEditMode();
}

function isEditingNote() {
  return noteIndexToEdit !== null;
}

function togglePinNote(index) {
  notes[index].isPinned = !notes[index].isPinned;
  saveAndRender();

  if (notes[index].isPinned) {
    showStatusMessage("Not sabitlendi.");
  } else {
    showStatusMessage("Not sabiti kaldirildi.");
  }
}

function openDeleteModal(index) {
  noteIndexToDelete = index;
  shouldDeleteAllNotes = false;
  openSingleDeleteModal();
}

function openDeleteAllModal() {
  noteIndexToDelete = null;
  shouldDeleteAllNotes = true;
  openClearNotesModal();
}

function cancelDelete() {
  noteIndexToDelete = null;
  shouldDeleteAllNotes = false;
  closeDeleteModal();
}

function confirmDelete() {
  if (shouldDeleteAllNotes === true) {
    notes = [];
    cancelEditNote();
    cancelDelete();
    saveAndRender();
    showStatusMessage("Tum notlar temizlendi.", "danger");
    return;
  }

  if (noteIndexToDelete === null) {
    return;
  }

  notes.splice(noteIndexToDelete, 1);
  cancelEditNote();
  cancelDelete();
  saveAndRender();
  showStatusMessage("Not silindi.", "danger");
}

function handleNoteSubmit(event) {
  event.preventDefault();

  const newNoteText = elements.noteInput.value.trim();
  const selectedColor = getSelectedColor();

  if (newNoteText === "") {
    showNoteError();
    return;
  }

  clearNoteError();

  if (noteIndexToEdit !== null) {
    notes[noteIndexToEdit].text = newNoteText;
    notes[noteIndexToEdit].color = selectedColor;
    notes[noteIndexToEdit].updatedAt = new Date().toISOString();
    cancelEditNote();
    saveAndRender();
    showStatusMessage("Not guncellendi.");
    return;
  }

  notes.push(createNote(newNoteText, selectedColor));
  elements.noteInput.value = "";
  selectColor("green");
  updateCharacterCount();
  saveAndRender();
  showStatusMessage("Not eklendi.");
}

function handleNoteInput() {
  clearNoteError();
  updateCharacterCount();
}

function clearSearch() {
  elements.searchInput.value = "";
  updateScreen();
  elements.searchInput.focus();
}

function handleModalClick(event) {
  // event.target tiklanan gercek elemandir.
  // Sadece modal arka planina tiklandiysa pencereyi kapatiyoruz.
  if (event.target === elements.deleteModal) {
    cancelDelete();
  }
}

function handleKeyboardShortcuts(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (isDeleteModalOpen()) {
    cancelDelete();
    return;
  }

  if (isEditingNote()) {
    cancelEditNote();
  }
}

function toggleTheme() {
  if (currentTheme === "dark") {
    currentTheme = "light";
  } else {
    currentTheme = "dark";
  }

  applyTheme(currentTheme);
  saveTheme(currentTheme);
  showStatusMessage("Tema tercihi kaydedildi.");
}

elements.noteForm.addEventListener("submit", handleNoteSubmit);
elements.noteInput.addEventListener("input", handleNoteInput);
elements.searchInput.addEventListener("input", updateScreen);
elements.clearSearchButton.addEventListener("click", clearSearch);
elements.clearNotesButton.addEventListener("click", openDeleteAllModal);
elements.cancelDeleteButton.addEventListener("click", cancelDelete);
elements.confirmDeleteButton.addEventListener("click", confirmDelete);
elements.deleteModal.addEventListener("click", handleModalClick);
elements.cancelEditButton.addEventListener("click", cancelEditNote);
elements.themeToggleButton.addEventListener("click", toggleTheme);
document.addEventListener("keydown", handleKeyboardShortcuts);

applyTheme(currentTheme);
updateCharacterCount();
updateScreen();
