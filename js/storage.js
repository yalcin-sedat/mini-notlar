import { normalizeNote } from "./notes.js";

// Bu dosya localStorage islemlerinden sorumludur.
// Notlari kaydeder, yukler ve bozuk veriye karsi uygulamayi korur.

const storageKey = "mini-notlar-notes";

// Bu fonksiyon notlari tarayicinin localStorage alanina kaydeder.
export function saveNotes(notes) {
  // localStorage sadece metin saklayabilir.
  // Bu yuzden notes dizisini JSON.stringify ile metne ceviriyoruz.
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

// Bu fonksiyon sayfa acildiginda daha once kaydedilmis notlari yukler.
export function loadNotes() {
  // localStorage icinden daha once kaydedilmis notlari aliyoruz.
  const savedNotes = localStorage.getItem(storageKey);

  // Eger hic kayit yoksa bos dizi donduruyoruz.
  if (savedNotes === null) {
    return [];
  }

  try {
    // Kayitli veri metin halinde geldigi icin JSON.parse ile tekrar diziye ceviriyoruz.
    const parsedNotes = JSON.parse(savedNotes);

    if (Array.isArray(parsedNotes) === false) {
      saveNotes([]);
      return [];
    }

    // Eski kayitlari ve eksik notlari yeni not yapisina uygun hale getiriyoruz.
    const normalizedNotes = parsedNotes.map(normalizeNote).filter(function (note) {
      return note !== null;
    });

    // Donusturulmus veriyi tekrar kaydediyoruz.
    saveNotes(normalizedNotes);

    return normalizedNotes;
  } catch (error) {
    // Kayit bozulduysa uygulama cokmesin diye notlari sifirliyoruz.
    saveNotes([]);
    return [];
  }
}
