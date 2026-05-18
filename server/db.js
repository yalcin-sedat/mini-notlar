// Bu dosya veritabanı bağlantısını ve tablo kurulumunu yönetir.
// better-sqlite3 paketi, Node.js içinde SQLite kullanmamızı sağlar.

const Database = require("better-sqlite3");
const path = require("path");

// Veritabanı dosyasını projenin kök dizininde oluştur.
// __dirname → bu dosyanın bulunduğu klasör (server/)
// ".." → bir üst klasöre çık (projenin kökü)
const db = new Database(path.join(__dirname, "..", "data.db"));

// Notes tablosunu oluştur.
// "IF NOT EXISTS" sayesinde sunucu her açıldığında tabloyu sıfırlamaz.
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    text       TEXT    NOT NULL,
    color      TEXT    NOT NULL DEFAULT 'green',
    is_pinned  INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL,
    updated_at TEXT    NOT NULL
  )
`);

// Bu db nesnesini diğer dosyalar import edebilsin diye dışa aktar.
module.exports = db;
