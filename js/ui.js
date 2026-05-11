import { formatDate } from "./notes.js";

// Bu dosya ekrani yonetir.
// HTML elemanlarini secer, listeyi cizer, hata mesajlarini ve modallari gosterir.

function setButtonInfo(button, label, icon) {
  button.textContent = icon;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
}

export const elements = {
  noteForm: document.querySelector("#note-form"),
  noteInput: document.querySelector("#note-input"),
  submitNoteButton: document.querySelector("#submit-note-button"),
  cancelEditButton: document.querySelector("#cancel-edit-button"),
  noteError: document.querySelector("#note-error"),
  characterCount: document.querySelector("#character-count"),
  colorInputs: document.querySelectorAll('input[name="note-color"]'),
  statusMessage: document.querySelector("#status-message"),
  notesList: document.querySelector("#notes-list"),
  searchInput: document.querySelector("#search-input"),
  clearSearchButton: document.querySelector("#clear-search-button"),
  noteCount: document.querySelector("#note-count"),
  noteStats: document.querySelector("#note-stats"),
  clearNotesButton: document.querySelector("#clear-notes-button"),
  deleteModal: document.querySelector("#delete-modal"),
  deleteModalTitle: document.querySelector("#delete-modal-title"),
  deleteModalText: document.querySelector("#delete-modal p"),
  cancelDeleteButton: document.querySelector("#cancel-delete-button"),
  confirmDeleteButton: document.querySelector("#confirm-delete-button"),
  themeToggleButton: document.querySelector("#theme-toggle-button"),
};

let statusMessageTimer = null;
let statusHideTimer = null;

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

// Bu fonksiyon formda secili olan renk etiketini okur.
export function getSelectedColor() {
  const selectedColorInput = document.querySelector('input[name="note-color"]:checked');

  if (selectedColorInput === null) {
    return "green";
  }

  return selectedColorInput.value;
}

// Bu fonksiyon formdaki renk etiketlerinden birini secer.
export function selectColor(color) {
  const colorInput = document.querySelector(`input[name="note-color"][value="${color}"]`);

  if (colorInput === null) {
    elements.colorInputs[0].checked = true;
    return;
  }

  colorInput.checked = true;
}

// Bu fonksiyon kullaniciya kisa durum mesaji gosterir.
export function showStatusMessage(message, type = "success") {
  if (statusMessageTimer !== null) {
    clearTimeout(statusMessageTimer);
  }

  if (statusHideTimer !== null) {
    clearTimeout(statusHideTimer);
  }

  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.remove("status-success", "status-danger");
  elements.statusMessage.classList.add(`status-${type}`);
  elements.statusMessage.classList.remove("hidden");

  // Tarayici once hidden class'inin kalktigini gorsun.
  // Sonra status-visible eklenince CSS gecisi calisir.
  requestAnimationFrame(function () {
    elements.statusMessage.classList.add("status-visible");
  });

  statusMessageTimer = setTimeout(function () {
    elements.statusMessage.classList.remove("status-visible");
    statusMessageTimer = null;

    statusHideTimer = setTimeout(function () {
      elements.statusMessage.classList.add("hidden");
      statusHideTimer = null;
    }, 200);
  }, 5000);
}

// Bu fonksiyon duzenleme modunu ekranda baslatir.
export function showEditMode(noteText) {
  elements.noteInput.value = noteText;
  setButtonInfo(elements.submitNoteButton, "Notu guncelle", "✓");
  elements.cancelEditButton.classList.remove("hidden");
  updateCharacterCount();
  elements.noteInput.focus();
}

// Bu fonksiyon duzenleme modunu ekranda kapatir.
export function hideEditMode() {
  elements.noteInput.value = "";
  clearNoteError();
  selectColor("green");
  setButtonInfo(elements.submitNoteButton, "Not ekle", "+");
  elements.cancelEditButton.classList.add("hidden");
  updateCharacterCount();
}

// Bu fonksiyon tek not silme modalini acar.
export function openSingleDeleteModal() {
  elements.deleteModalTitle.textContent = "Not Silinsin mi?";
  elements.deleteModalText.textContent = "Bu notu silersen geri alamazsin.";
  setButtonInfo(elements.confirmDeleteButton, "Notu sil", "×");
  elements.deleteModal.classList.remove("hidden");
}

// Bu fonksiyon tum notlari silme modalini acar.
export function openClearNotesModal() {
  elements.deleteModalTitle.textContent = "Tum Notlar Silinsin mi?";
  elements.deleteModalText.textContent = "Bu islem tum notlarini kalici olarak siler.";
  setButtonInfo(elements.confirmDeleteButton, "Tum notlari sil", "🧹");
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

  setButtonInfo(
    elements.themeToggleButton,
    isDarkTheme ? "Acik temaya gec" : "Koyu temaya gec",
    isDarkTheme ? "☀️" : "🌙"
  );
  elements.themeToggleButton.setAttribute("aria-pressed", String(isDarkTheme));
}

// Bu fonksiyon arama kutusu bos degilse Temizle butonunu gosterir.
export function updateClearSearchButton() {
  if (elements.searchInput.value.trim() === "") {
    elements.clearSearchButton.classList.add("hidden");
    return;
  }

  elements.clearSearchButton.classList.remove("hidden");
}

// Bu fonksiyon bos liste veya bos arama sonucu mesajini olusturur.
function createEmptyState(title, message) {
  const emptyItem = document.createElement("li");
  emptyItem.className = "empty-state";

  const emptyIcon = document.createElement("span");
  emptyIcon.className = "empty-state-icon";
  emptyIcon.textContent = "+";
  emptyIcon.setAttribute("aria-hidden", "true");

  const emptyTitle = document.createElement("strong");
  emptyTitle.textContent = title;

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = message;

  emptyItem.appendChild(emptyIcon);
  emptyItem.appendChild(emptyTitle);
  emptyItem.appendChild(emptyMessage);

  return emptyItem;
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
    // Sabitlenen notlar ustte gorunur.
    // Ayni gruptaki notlarda en yeni not ustte kalir.
    .sort(function (firstItem, secondItem) {
      if (firstItem.note.isPinned !== secondItem.note.isPinned) {
        return secondItem.note.isPinned - firstItem.note.isPinned;
      }

      return secondItem.index - firstItem.index;
    });

  return {
    searchText: searchText,
    visibleNotes: visibleNotes,
  };
}

// Bu fonksiyon tum notlardaki toplam karakter ve kelime sayisini hesaplar.
function getNoteStats(notes) {
  const characterCount = notes.reduce(function (total, note) {
    return total + note.text.length;
  }, 0);

  const wordCount = notes.reduce(function (total, note) {
    const words = note.text.trim().split(/\s+/).filter(function (word) {
      return word !== "";
    });

    return total + words.length;
  }, 0);

  return {
    characterCount: characterCount,
    wordCount: wordCount,
  };
}

// Bu fonksiyon not listesini ekranda yeniden olusturur.
export function renderNotes(notes, handlers) {
  elements.notesList.innerHTML = "";

  const result = getVisibleNotes(notes);
  const stats = getNoteStats(notes);

  if (result.searchText === "") {
    elements.noteCount.textContent = `${notes.length} not`;
  } else {
    elements.noteCount.textContent = `${result.visibleNotes.length} sonuc`;
  }

  elements.noteStats.textContent = `${stats.characterCount} karakter · ${stats.wordCount} kelime`;

  if (notes.length === 0) {
    elements.clearNotesButton.classList.add("hidden");
    elements.notesList.appendChild(
      createEmptyState("Henuz not yok", "Ilk notunu yazip Not Ekle butonuna basabilirsin.")
    );
    return;
  }

  elements.clearNotesButton.classList.remove("hidden");

  if (result.visibleNotes.length === 0) {
    elements.notesList.appendChild(
      createEmptyState("Sonuc bulunamadi", "Farkli bir kelime deneyebilir veya aramayi temizleyebilirsin.")
    );
    return;
  }

  result.visibleNotes.forEach(function (item) {
    const noteItem = document.createElement("li");
    noteItem.className = `note-item note-color-${item.note.color}`;

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

    if (item.note.isPinned) {
      noteItem.classList.add("note-item-pinned");
      noteMeta.textContent = `Sabitlendi - ${noteMeta.textContent}`;
    }

    const noteActions = document.createElement("div");
    noteActions.className = "note-actions";

    const pinButton = document.createElement("button");
    pinButton.className = "pin-button icon-button";
    setButtonInfo(
      pinButton,
      item.note.isPinned ? "Sabiti kaldir" : "Notu sabitle",
      item.note.isPinned ? "📍" : "📌"
    );
    pinButton.addEventListener("click", function () {
      handlers.onTogglePin(item.index);
    });

    const editButton = document.createElement("button");
    editButton.className = "edit-button icon-button";
    setButtonInfo(editButton, "Notu duzenle", "✎");
    editButton.addEventListener("click", function () {
      handlers.onEdit(item.index);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button icon-button";
    setButtonInfo(deleteButton, "Notu sil", "×");
    deleteButton.addEventListener("click", function () {
      handlers.onDelete(item.index);
    });

    noteContent.appendChild(noteText);
    noteContent.appendChild(noteMeta);
    noteActions.appendChild(pinButton);
    noteActions.appendChild(editButton);
    noteActions.appendChild(deleteButton);
    noteItem.appendChild(noteContent);
    noteItem.appendChild(noteActions);
    elements.notesList.appendChild(noteItem);
  });
}
