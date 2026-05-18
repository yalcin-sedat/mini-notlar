// Bu dosya uygulamanın ana akışını yönetir.
// Eskiden notlar localStorage'da saklanıyordu.
// Artık sunucuda (SQLite veritabanında) saklanıyor; biz fetch() ile konuşuyoruz.

import * as api from "./api.js";
import { loadTheme, saveTheme } from "./storage.js";
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

// Notlar artık sunucudan gelecek; başlangıçta boş dizi.
let notes = [];

// Tema tercihi hâlâ localStorage'da kalıyor (cihaza özel bir ayar).
let currentTheme = loadTheme();

// Silinecek veya düzenlenecek ihtiyacın ID'si.
// Eskiden dizi indeksi (index) kullanıyorduk; artık veritabanı ID'si kullanıyoruz.
let noteIdToDelete = null;
let noteIdToEdit = null;
let shouldDeleteAllNotes = false;

// Arama kutusunu ve listeyi günceller.
function updateScreen() {
  updateClearSearchButton();
  renderNotes(notes, {
    onEdit: startEditNote,
    onDelete: openDeleteModal,
    onTogglePin: togglePinNote,
  });
}

// Sunucudan tüm ihtiyaçları çekip ekranı yeniler.
// async → içinde await kullanabileceğimizi belirtir.
async function loadAndRender() {
  notes = await api.getAllNotes();
  updateScreen();
}

function startEditNote(id) {
  noteIdToEdit = id;
  // ID ile notun kendisini bul
  const note = notes.find(function (n) { return n.id === id; });
  showEditMode(note.text);
  selectColor(note.color);
}

function cancelEditNote() {
  noteIdToEdit = null;
  hideEditMode();
}

function isEditingNote() {
  return noteIdToEdit !== null;
}

async function togglePinNote(id) {
  const note = notes.find(function (n) { return n.id === id; });
  // Mevcut durumu kaydet; await sonrasında güvenli olmaz
  const wasAlreadyPinned = note.isPinned;

  await api.updateNote(id, note.text, note.color, !note.isPinned);
  await loadAndRender();

  showStatusMessage(wasAlreadyPinned ? "İhtiyaç sabiti kaldırıldı." : "İhtiyaç sabitlendi.");
}

function openDeleteModal(id) {
  noteIdToDelete = id;
  shouldDeleteAllNotes = false;
  openSingleDeleteModal();
}

function openDeleteAllModal() {
  noteIdToDelete = null;
  shouldDeleteAllNotes = true;
  openClearNotesModal();
}

function cancelDelete() {
  noteIdToDelete = null;
  shouldDeleteAllNotes = false;
  closeDeleteModal();
}

async function confirmDelete() {
  if (shouldDeleteAllNotes) {
    cancelEditNote();
    cancelDelete();
    await api.removeAllNotes();
    await loadAndRender();
    showStatusMessage("Tüm ihtiyaçlar temizlendi.", "danger");
    return;
  }

  if (noteIdToDelete === null) return;

  // ID'yi önce kaydet; cancelDelete() çalışınca noteIdToDelete = null olur
  const id = noteIdToDelete;
  cancelEditNote();
  cancelDelete();
  await api.removeNote(id);
  await loadAndRender();
  showStatusMessage("İhtiyaç silindi.", "danger");
}

async function handleNoteSubmit(event) {
  event.preventDefault();

  const newText = elements.noteInput.value.trim();
  const selectedColor = getSelectedColor();

  if (newText === "") {
    showNoteError();
    return;
  }

  clearNoteError();

  // Düzenleme modundaysa güncelle
  if (noteIdToEdit !== null) {
    const id = noteIdToEdit;
    const note = notes.find(function (n) { return n.id === id; });
    cancelEditNote(); // formu temizler, noteIdToEdit = null yapar
    await api.updateNote(id, newText, selectedColor, note.isPinned);
    await loadAndRender();
    showStatusMessage("İhtiyaç güncellendi.");
    return;
  }

  // Yeni ihtiyaç ekle
  await api.addNote(newText, selectedColor);
  elements.noteInput.value = "";
  selectColor("green");
  updateCharacterCount();
  await loadAndRender();
  showStatusMessage("İhtiyaç eklendi.");
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
  // event.target tıklanan gerçek elemandır.
  // Sadece modal arka planına tıklandıysa pencereyi kapat.
  if (event.target === elements.deleteModal) {
    cancelDelete();
  }
}

function handleKeyboardShortcuts(event) {
  if (event.key !== "Escape") return;
  if (isDeleteModalOpen()) { cancelDelete(); return; }
  if (isEditingNote()) cancelEditNote();
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
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

// Sayfa açılınca sunucudan ihtiyaçları çek
loadAndRender();
