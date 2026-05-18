// Bu dosya /api/notes adresiyle gelen istekleri karşılar.
// Express Router, her endpoint'i ayrı ayrı tanımlamamızı sağlar.

const express = require("express");
const router = express.Router();
const db = require("../db");

// Veritabanındaki satırı, frontend'in beklediği nesne formatına çevirir.
// SQLite boolean bilmez; is_pinned 0 veya 1 olarak saklanır.
function toNote(row) {
  return {
    id: row.id,
    text: row.text,
    color: row.color,
    isPinned: row.is_pinned === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/notes — Tüm ihtiyaçları listele
router.get("/", function (req, res) {
  const rows = db.prepare("SELECT * FROM notes ORDER BY created_at ASC").all();
  res.json(rows.map(toNote));
});

// POST /api/notes — Yeni ihtiyaç ekle
router.post("/", function (req, res) {
  const { text, color } = req.body;
  const now = new Date().toISOString();

  const result = db
    .prepare(
      "INSERT INTO notes (text, color, is_pinned, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    )
    .run(text, color || "green", now, now);

  const newNote = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(result.lastInsertRowid);

  // 201 = "Created" — yeni kayıt oluşturuldu anlamına gelir
  res.status(201).json(toNote(newNote));
});

// PUT /api/notes/:id — Mevcut ihtiyacı güncelle
// :id URL'deki değişken kısım, örneğin /api/notes/3
router.put("/:id", function (req, res) {
  const { text, color, isPinned } = req.body;
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE notes SET text = ?, color = ?, is_pinned = ?, updated_at = ? WHERE id = ?"
  ).run(text, color, isPinned ? 1 : 0, now, req.params.id);

  const updated = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(req.params.id);

  res.json(toNote(updated));
});

// DELETE /api/notes/:id — Tek ihtiyacı sil
router.delete("/:id", function (req, res) {
  db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
  // 204 = "No Content" — işlem başarılı ama göndereceğimiz veri yok
  res.status(204).send();
});

// DELETE /api/notes — Tüm ihtiyaçları sil
router.delete("/", function (req, res) {
  db.prepare("DELETE FROM notes").run();
  res.status(204).send();
});

module.exports = router;
