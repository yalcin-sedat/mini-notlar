// Bu dosya sunucuyla konuşan fonksiyonları içerir.
//
// fetch() nedir?
//   Tarayıcının sunucuya istek gönderip cevap almasını sağlayan fonksiyon.
//   İnternetten veri çekmek gibi düşün — ama bu sefer kendi sunucumuza.
//
// async/await nedir?
//   fetch() cevabı hemen vermez, biraz beklemek gerekir.
//   async → "bu fonksiyon bekleyebilir" demek.
//   await → "cevap gelene kadar burada dur" demek.

const BASE = "/api/notes";

// Tüm ihtiyaçları sunucudan getir.
export async function getAllNotes() {
  const response = await fetch(BASE);
  return response.json(); // JSON metni JavaScript nesnesine çevirir
}

// Yeni ihtiyaç ekle.
export async function addNote(text, color) {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // "gönderdiğim şey JSON" de
    body: JSON.stringify({ text, color }),            // nesneyi JSON metnine çevir
  });
  return response.json();
}

// Mevcut ihtiyacı güncelle.
export async function updateNote(id, text, color, isPinned) {
  const response = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, color, isPinned }),
  });
  return response.json();
}

// Tek ihtiyacı sil.
export async function removeNote(id) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}

// Tüm ihtiyaçları sil.
export async function removeAllNotes() {
  await fetch(BASE, { method: "DELETE" });
}
