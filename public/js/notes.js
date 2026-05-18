// Bu dosya not verisinin nasil olusturuldugunu ve duzenlendigini bilir.
// Ekranla veya localStorage ile ilgilenmez.

const allowedColors = ["green", "blue", "red"];

function normalizeColor(color) {
  if (allowedColors.includes(color)) {
    return color;
  }

  return "green";
}

// Bu fonksiyon yeni bir not nesnesi olusturur.
export function createNote(text, color = "green") {
  const now = new Date().toISOString();

  return {
    text: text,
    color: normalizeColor(color),
    isPinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

// Bu fonksiyon eski veya eksik not verisini yeni not yapisina uyarlar.
export function normalizeNote(note) {
  const now = new Date().toISOString();

  if (typeof note === "string") {
    return {
      text: note,
      color: "green",
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  if (note === null || typeof note !== "object" || typeof note.text !== "string") {
    return null;
  }

  return {
    text: note.text,
    color: normalizeColor(note.color),
    isPinned: note.isPinned === true,
    createdAt: note.createdAt || now,
    updatedAt: note.updatedAt || note.createdAt || now,
  };
}

// Bu fonksiyon tarayicinin anlayacagi ISO tarihini okunabilir hale getirir.
export function formatDate(dateText) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "Tarih yok";
  }

  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
