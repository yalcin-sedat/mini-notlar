// Bu dosya sunucunun giriş noktasıdır.
// Express'i başlatır, middleware'leri bağlar ve portu dinlemeye başlar.

const express = require("express");
const path = require("path");
const notesRouter = require("./routes/notes");

const app = express();
const PORT = 3000;

// Gelen isteklerin gövdesini (body) JSON olarak okumak için gerekli.
// Bunu eklemesek req.body undefined gelir.
app.use(express.json());

// public/ klasöründeki HTML, CSS ve JS dosyalarını tarayıcıya sun.
// Kullanıcı "/" adresine girdiğinde otomatik olarak public/index.html açılır.
app.use(express.static(path.join(__dirname, "..", "public")));

// /api/notes ile başlayan tüm istekleri notes router'ına yönlendir.
app.use("/api/notes", notesRouter);

// Sunucuyu başlat ve belirtilen portu dinle.
app.listen(PORT, function () {
  console.log("Sunucu çalışıyor: http://localhost:" + PORT);
});
