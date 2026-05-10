import { createNote } from "./notes.js";
import { loadNotes, saveNotes } from "./storage.js";
import {
  clearNoteError,
  closeDeleteModal,
  elements,
  hideEditMode,
  openClearNotesModal,
  openSingleDeleteModal,
  renderNotes,
  showEditMode,
  showNoteError,
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
    return;
  }

  if (noteIndexToDelete === null) {
    return;
  }

  notes.splice(noteIndexToDelete, 1);
  cancelEditNote();
  cancelDelete();
  saveAndRender();
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
    return;
  }

  notes.push(createNote(newNoteText));
  elements.noteInput.value = "";
  saveAndRender();
}

elements.noteForm.addEventListener("submit", handleNoteSubmit);
elements.noteInput.addEventListener("input", clearNoteError);
elements.searchInput.addEventListener("input", updateScreen);
elements.clearNotesButton.addEventListener("click", openDeleteAllModal);
elements.cancelDeleteButton.addEventListener("click", cancelDelete);
elements.confirmDeleteButton.addEventListener("click", confirmDelete);
elements.cancelEditButton.addEventListener("click", cancelEditNote);

updateScreen();
