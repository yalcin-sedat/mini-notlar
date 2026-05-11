import { formatDate } from "./notes.js";

// Bu dosya ekrani yonetir.
// HTML elemanlarini secer, listeyi cizer, hata mesajlarini ve modallari gosterir.

export const elements = {
  noteForm: document.querySelector("#note-form"),
  noteInput: document.querySelector("#note-input"),
  submitNoteButton: document.querySelector("#submit-note-button"),
  cancelEditButton: document.querySelector("#cancel-edit-button"),
  noteError: document.querySelector("#note-error"),
  characterCount: document.querySelector("#character-count"),
  statusMessage: document.querySelector("#status-message"),
  notesList: document.querySelector("#notes-list"),
  searchInput: document.querySelector("#search-input"),
  noteCount: document.querySelector("#note-count"),
  clearNotesButton: document.querySelector("#clear-notes-button"),
  deleteModal: document.querySelector("#delete-modal"),
  deleteModalTitle: document.querySelector("#delete-modal-title"),
  deleteModalText: document.querySelector("#delete-modal p"),
  cancelDeleteButton: document.querySelector("#cancel-delete-button"),
  confirmDeleteButton: document.querySelector("#confirm-delete-button"),
  themeToggleButton: document.querySelector("#theme-toggle-button"),
};

let statusMessageTimer = null;

// Bu fonksiyon not alaninda hata mesajini gosterir.
export function showNoteError() {
  elements.noteInput.classList.add("input-error");
  elements.noteError.classList.remove("hidden");
}

// Bu fonksiyon not alanindaki hata mesajini temizler.
export function clearNoteError() {
  elements.noteInput.classList.remove("input-error");
  elements.noteError.classList.add("hidden");
}

// Bu fonksiyon not yazma alanindaki karakter sayisini gunceller.
export function updateCharacterCount() {
  const maxLength = elements.noteInput.getAttribute("maxlength");
  const currentLength = elements.noteInput.value.length;

  elements.characterCount.textContent = `${currentLength} / ${maxLength}`;
}

// Bu fonksiyon kullaniciya kisa durum mesaji gosterir.
export function showStatusMessage(message, type = "success") {
  if (statusMessageTimer !== null) {
    clearTimeout(statusMessageTimer);
  }

  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.remove("status-success", "status-danger");
  elements.statusMessage.classList.add(`status-${type}`);
  elements.statusMessage.classList.remove("hidden");

  statusMessageTimer = setTimeout(function () {
    elements.statusMessage.classList.add("hidden");
    statusMessageTimer = null;
  }, 5000);
}

// Bu fonksiyon duzenleme modunu ekranda baslatir.
export function showEditMode(noteText) {
  elements.noteInput.value = noteText;
  elements.submitNoteButton.textContent = "Notu Guncelle";
  elements.cancelEditButton.classList.remove("hidden");
  updateCharacterCount();
  elements.noteInput.focus();
}

// Bu fonksiyon duzenleme modunu ekranda kapatir.
export function hideEditMode() {
  elements.noteInput.value = "";
  clearNoteError();
  elements.submitNoteButton.textContent = "Not Ekle";
  elements.cancelEditButton.classList.add("hidden");
  updateCharacterCount();
}

// Bu fonksiyon tek not silme modalini acar.
export function openSingleDeleteModal() {
  elements.deleteModalTitle.textContent = "Not Silinsin mi?";
  elements.deleteModalText.textContent = "Bu notu silersen geri alamazsin.";
  elements.confirmDeleteButton.textContent = "Evet, Sil";
  elements.deleteModal.classList.remove("hidden");
}

// Bu fonksiyon tum notlari silme modalini acar.
export function openClearNotesModal() {
  elements.deleteModalTitle.textContent = "Tum Notlar Silinsin mi?";
  elements.deleteModalText.textContent = "Bu islem tum notlarini kalici olarak siler.";
  elements.confirmDeleteButton.textContent = "Evet, Tumunu Sil";
  elements.deleteModal.classList.remove("hidden");
}

// Bu fonksiyon silme modalini kapatir.
export function closeDeleteModal() {
  elements.deleteModal.classList.add("hidden");
}

// Bu fonksiyon silme modalinin acik olup olmadigini soyler.
export function isDeleteModalOpen() {
  return elements.deleteModal.classList.contains("hidden") === false;
}

// Bu fonksiyon secilen temayi body elemanina uygular.
export function applyTheme(theme) {
  const isDarkTheme = theme === "dark";

  // classList.toggle ikinci parametre alinca daha kontrollu calisir.
  // true ise class eklenir, false ise class kaldirilir.
  document.body.classList.toggle("dark-theme", isDarkTheme);

  elements.themeToggleButton.textContent = isDarkTheme ? "Acik Tema" : "Koyu Tema";
  elements.themeToggleButton.setAttribute("aria-pressed", String(isDarkTheme));
}

// Bu fonksiyon notlari arama metnine gore filtreler ve ekranda gosterilecek siraya sokar.
function getVisibleNotes(notes) {
  const searchText = elements.searchInput.value.trim().toLowerCase();

  const visibleNotes = notes
    .map(function (note, index) {
      return {
        note: note,
        index: index,
      };
    })
    .filter(function (item) {
      return item.note.text.toLowerCase().includes(searchText);
    })
    // Yeni eklenen notlar dizinin sonunda durur.
    // Ekranda en yeni not en ustte gorunsun diye sadece gosterim sirasini ters ceviriyoruz.
    .reverse();

  return {
    searchText: searchText,
    visibleNotes: visibleNotes,
  };
}

// Bu fonksiyon not listesini ekranda yeniden olusturur.
export function renderNotes(notes, handlers) {
  elements.notesList.innerHTML = "";

  const result = getVisibleNotes(notes);

  if (result.searchText === "") {
    elements.noteCount.textContent = `${notes.length} not`;
  } else {
    elements.noteCount.textContent = `${result.visibleNotes.length} sonuc`;
  }

  if (notes.length === 0) {
    elements.clearNotesButton.classList.add("hidden");
    elements.notesList.innerHTML = '<li class="empty-state">Henuz not eklenmedi.</li>';
    return;
  }

  elements.clearNotesButton.classList.remove("hidden");

  if (result.visibleNotes.length === 0) {
    elements.notesList.innerHTML = '<li class="empty-state">Aramana uygun not bulunamadi.</li>';
    return;
  }

  result.visibleNotes.forEach(function (item) {
    const noteItem = document.createElement("li");
    noteItem.className = "note-item";

    const noteContent = document.createElement("div");
    noteContent.className = "note-content";

    const noteText = document.createElement("p");
    noteText.textContent = item.note.text;

    const noteMeta = document.createElement("small");

    if (item.note.createdAt === item.note.updatedAt) {
      noteMeta.textContent = `Olusturuldu: ${formatDate(item.note.createdAt)}`;
    } else {
      noteMeta.textContent = `Guncellendi: ${formatDate(item.note.updatedAt)}`;
    }

    const noteActions = document.createElement("div");
    noteActions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Duzenle";
    editButton.className = "edit-button";
    editButton.addEventListener("click", function () {
      handlers.onEdit(item.index);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      handlers.onDelete(item.index);
    });

    noteContent.appendChild(noteText);
    noteContent.appendChild(noteMeta);
    noteActions.appendChild(editButton);
    noteActions.appendChild(deleteButton);
    noteItem.appendChild(noteContent);
    noteItem.appendChild(noteActions);
    elements.notesList.appendChild(noteItem);
  });
}
