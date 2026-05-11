import { createNote } from "./notes.js";
import { loadNotes, saveNotes } from "./storage.js";
import {
  clearNoteError,
  closeDeleteModal,
  elements,
  hideEditMode,
  isDeleteModalOpen,
  openClearNotesModal,
  openSingleDeleteModal,
  renderNotes,
  showEditMode,
  showNoteError,
  showStatusMessage,
  updateCharacterCount,
} from "./ui.js";

// Bu dosya uygulamanin ana akisini yonetir.
// Veriyi tutar, kullanici olaylarini dinler ve diger dosyalardaki fonksiyonlari birlestirir.

let notes = loadNotes();
let noteIndexToDelete = null;
let noteIndexToEdit = null;
let shouldDeleteAllNotes = false;

function updateScreen() {
  renderNotes(notes, {
    onEdit: startEditNote,
    onDelete: openDeleteModal,
  });
}

function saveAndRender() {
  saveNotes(notes);
  updateScreen();
}

function startEditNote(index) {
  noteIndexToEdit = index;
  showEditMode(notes[index].text);
}

function cancelEditNote() {
  noteIndexToEdit = null;
  hideEditMode();
}

function isEditingNote() {
  return noteIndexToEdit !== null;
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

  if (newNoteText === "") {
    showNoteError();
    return;
  }

  clearNoteError();

  if (noteIndexToEdit !== null) {
    notes[noteIndexToEdit].text = newNoteText;
    notes[noteIndexToEdit].updatedAt = new Date().toISOString();
    cancelEditNote();
    saveAndRender();
    showStatusMessage("Not guncellendi.");
    return;
  }

  notes.push(createNote(newNoteText));
  elements.noteInput.value = "";
  updateCharacterCount();
  saveAndRender();
  showStatusMessage("Not eklendi.");
}

function handleNoteInput() {
  clearNoteError();
  updateCharacterCount();
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

elements.noteForm.addEventListener("submit", handleNoteSubmit);
elements.noteInput.addEventListener("input", handleNoteInput);
elements.searchInput.addEventListener("input", updateScreen);
elements.clearNotesButton.addEventListener("click", openDeleteAllModal);
elements.cancelDeleteButton.addEventListener("click", cancelDelete);
elements.confirmDeleteButton.addEventListener("click", confirmDelete);
elements.cancelEditButton.addEventListener("click", cancelEditNote);
document.addEventListener("keydown", handleKeyboardShortcuts);

updateCharacterCount();
updateScreen();
