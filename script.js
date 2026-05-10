// HTML icindeki formu secıyoruz. Kullanici "Not Ekle" butonuna bastiginda bu form calisacak.
const noteForm = document.querySelector("#note-form");

// Kullanıcının not yazdığı textarea alanini seciyoruz.
const noteInput = document.querySelector("#note-input");

// Form icindeki ana butonu seciyoruz.
// Normalde "Not Ekle" yazar, duzenleme modunda "Notu Guncelle" yazacak.
const submitNoteButton = document.querySelector("#submit-note-button");

// Duzenleme modundan cikmak icin kullanacagimiz "Vazgec" butonunu seciyoruz.
const cancelEditButton = document.querySelector("#cancel-edit-button");

// Bos not yazildiginda kullaniciya gosterecegimiz hata mesajini seciyoruz.
const noteError = document.querySelector("#note-error");

// Notlarin ekranda gorunecegi liste alanini seciyoruz.
const notesList = document.querySelector("#notes-list");

// Notlari filtrelemek icin kullanacagimiz arama alanini seciyoruz.
const searchInput = document.querySelector("#search-input");

// Toplam not sayisini gosteren yazi alanini seciyoruz.
const noteCount = document.querySelector("#note-count");

// Silme onay penceresini seciyoruz.
const deleteModal = document.querySelector("#delete-modal");

// Kullanici silmekten vazgecerse tiklayacagi butonu seciyoruz.
const cancelDeleteButton = document.querySelector("#cancel-delete-button");

// Kullanici silmeyi kesinlestirirse tiklayacagi butonu seciyoruz.
const confirmDeleteButton = document.querySelector("#confirm-delete-button");

// localStorage icinde notlari saklamak icin kullanacagimiz anahtar adi.
// Bu isim, tarayicinin hafizasinda notlari bulmamizi saglar.
const storageKey = "mini-notlar-notes";

// Butun notlari bu dizi icinde tutuyoruz.
// Dizi, birden fazla veriyi sirali sekilde saklayan JavaScript yapisidir.
let notes = [];

// Silinmek istenen notun sira numarasini burada gecici olarak sakliyoruz.
// Baslangicta null, cunku henuz secilmis bir not yok.
let noteIndexToDelete = null;

// Duzenlenen notun sira numarasini burada sakliyoruz.
// null ise su an duzenleme modunda degiliz demektir.
let noteIndexToEdit = null;

// Bu fonksiyon not alaninda hata mesajini gosterir.
function showNoteError() {
  // Textarea alanina hata class'i ekliyoruz.
  // CSS bu class sayesinde kutuyu kirmizi gosterir.
  noteInput.classList.add("input-error");

  // Hata mesajindaki hidden class'ini kaldiriyoruz.
  // Boylece hata mesaji ekranda gorunur.
  noteError.classList.remove("hidden");
}

// Bu fonksiyon not alanindaki hata mesajini temizler.
function clearNoteError() {
  // Textarea alanindaki hata class'ini kaldiriyoruz.
  noteInput.classList.remove("input-error");

  // Hata mesajini tekrar gizliyoruz.
  noteError.classList.add("hidden");
}

// Bu fonksiyon notlari tarayicinin localStorage alanina kaydeder.
function saveNotes() {
  // localStorage sadece metin saklayabilir.
  // Bu yuzden notes dizisini JSON.stringify ile metne ceviriyoruz.
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

// Bu fonksiyon yeni bir not nesnesi olusturur.
function createNote(text) {
  const now = new Date().toISOString();

  return {
    text: text,
    createdAt: now,
    updatedAt: now,
  };
}

// Bu fonksiyon eski veya eksik not verisini yeni not yapisina uyarlar.
function normalizeNote(note) {
  const now = new Date().toISOString();

  if (typeof note === "string") {
    return {
      text: note,
      createdAt: now,
      updatedAt: now,
    };
  }

  if (note === null || typeof note !== "object" || typeof note.text !== "string") {
    return null;
  }

  return {
    text: note.text,
    createdAt: note.createdAt || now,
    updatedAt: note.updatedAt || note.createdAt || now,
  };
}

// Bu fonksiyon sayfa acildiginda daha once kaydedilmis notlari yukler.
function loadNotes() {
  // localStorage icinden daha once kaydedilmis notlari aliyoruz.
  const savedNotes = localStorage.getItem(storageKey);

  // Eger hic kayit yoksa fonksiyonu burada durduruyoruz.
  if (savedNotes === null) {
    return;
  }

  try {
    // Kayitli veri metin halinde geldigi icin JSON.parse ile tekrar diziye ceviriyoruz.
    const parsedNotes = JSON.parse(savedNotes);

    if (Array.isArray(parsedNotes) === false) {
      notes = [];
      saveNotes();
      return;
    }

    // Eski kayitlari ve eksik notlari yeni not yapisina uygun hale getiriyoruz.
    notes = parsedNotes.map(normalizeNote).filter(function (note) {
      return note !== null;
    });

    // Donusturulmus veriyi tekrar kaydediyoruz.
    saveNotes();
  } catch (error) {
    // Kayit bozulduysa uygulama cokmesin diye notlari sifirliyoruz.
    notes = [];
    saveNotes();
  }
}

// Bu fonksiyon tarayicinin anlayacagi ISO tarihini okunabilir hale getirir.
function formatDate(dateText) {
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

// Bu fonksiyon not listesini ekranda yeniden olusturur.
// Yeni not ekledigimizde veya ileride not sildigimizde bu fonksiyonu kullanacagiz.
function renderNotes() {
  // Once listedeki eski HTML'i temizliyoruz.
  // Boylece ekrani bastan, guncel notlara gore cizebiliriz.
  notesList.innerHTML = "";

  // Arama alanina yazilan metni aliyoruz.
  // toLowerCase(), buyuk/kucuk harf farkini ortadan kaldirir.
  const searchText = searchInput.value.trim().toLowerCase();

  // Notlari arama metnine gore filtreliyoruz.
  // Bos arama varsa butun notlar gorunur.
  // Burada her notla beraber asil sira numarasini da sakliyoruz.
  // Boylece ayni metne sahip iki not olsa bile dogru notu duzenleyip silebiliriz.
  const filteredNotes = notes
    .map(function (note, index) {
      return {
        note: note,
        index: index,
      };
    })
    .filter(function (note) {
      return note.note.text.toLowerCase().includes(searchText);
    })
    // Yeni eklenen notlar dizinin sonunda durur.
    // Ekranda en yeni not en ustte gorunsun diye sadece gosterim sirasini ters ceviriyoruz.
    .reverse();

  // Not sayisini ekranda guncelliyoruz.
  // Arama yapiliyorsa bulunan sonucu, arama yoksa toplam not sayisini gosteriyoruz.
  if (searchText === "") {
    noteCount.textContent = `${notes.length} not`;
  } else {
    noteCount.textContent = `${filteredNotes.length} sonuc`;
  }

  // Eger hic not yoksa kullaniciya bos durum mesaji gosteriyoruz.
  if (notes.length === 0) {
    notesList.innerHTML = '<li class="empty-state">Henuz not eklenmedi.</li>';
    return;
  }

  // Arama yapildigi halde sonuc yoksa kullaniciya bilgi veriyoruz.
  if (filteredNotes.length === 0) {
    notesList.innerHTML = '<li class="empty-state">Aramana uygun not bulunamadi.</li>';
    return;
  }

  // Filtrelenmis notlar icin ekranda liste elemani olusturuyoruz.
  // index, notun listedeki sira numarasidir. Silme isleminde bu numarayi kullanacagiz.
  filteredNotes.forEach(function (note) {
    // Yeni bir <li> HTML elemani olusturuyoruz.
    const noteItem = document.createElement("li");

    // Bu elemana CSS'te yazdigimiz .note-item stilini veriyoruz.
    noteItem.className = "note-item";

    // Not metnini ve tarih bilgisini tutacak bir alan olusturuyoruz.
    const noteContent = document.createElement("div");

    // Bu alana CSS'te kullanacagimiz class adini veriyoruz.
    noteContent.className = "note-content";

    // Not metnini tutacak bir <p> elemani olusturuyoruz.
    const noteText = document.createElement("p");

    // <p> elemaninin icine kullanicinin yazdigi notu koyuyoruz.
    noteText.textContent = note.note.text;

    // Notun tarih bilgisini gostermek icin kucuk bir metin alani olusturuyoruz.
    const noteMeta = document.createElement("small");

    // Not hic guncellenmediyse olusturma tarihini, guncellendiyse guncelleme tarihini gosteriyoruz.
    if (note.note.createdAt === note.note.updatedAt) {
      noteMeta.textContent = `Olusturuldu: ${formatDate(note.note.createdAt)}`;
    } else {
      noteMeta.textContent = `Guncellendi: ${formatDate(note.note.updatedAt)}`;
    }

    // Duzenle ve Sil butonlarini yan yana tutacak bir alan olusturuyoruz.
    const noteActions = document.createElement("div");

    // Bu alana CSS'te kullanacagimiz class adini veriyoruz.
    noteActions.className = "note-actions";

    // Notu duzenlemek icin bir buton olusturuyoruz.
    const editButton = document.createElement("button");

    // Butonun ekranda gorunecek yazisini belirliyoruz.
    editButton.textContent = "Duzenle";

    // Bu butona CSS'te kullanacagimiz bir class adi veriyoruz.
    editButton.className = "edit-button";

    // Duzenle butonuna tiklaninca startEditNote fonksiyonu calisacak.
    // Hangi notun duzenlenecegini anlamak icin index degerini gonderiyoruz.
    editButton.addEventListener("click", function () {
      startEditNote(note.index);
    });

    // Notu silmek icin bir buton olusturuyoruz.
    const deleteButton = document.createElement("button");

    // Butonun ekranda gorunecek yazisini belirliyoruz.
    deleteButton.textContent = "Sil";

    // Bu butona CSS'te kullanacagimiz bir class adi veriyoruz.
    deleteButton.className = "delete-button";

    // Sil butonuna tiklaninca deleteNote fonksiyonu calisacak.
    // Hangi notun silinmek istendigini anlamak icin index degerini gonderiyoruz.
    deleteButton.addEventListener("click", function () {
      openDeleteModal(note.index);
    });

    // Not metnini icerik alanina ekliyoruz.
    noteContent.appendChild(noteText);

    // Tarih bilgisini icerik alanina ekliyoruz.
    noteContent.appendChild(noteMeta);

    // Icerik alanini liste elemaninin icine ekliyoruz.
    noteItem.appendChild(noteContent);

    // Duzenle butonunu aksiyon alaninin icine ekliyoruz.
    noteActions.appendChild(editButton);

    // Sil butonunu aksiyon alaninin icine ekliyoruz.
    noteActions.appendChild(deleteButton);

    // Aksiyon alanini liste elemaninin icine ekliyoruz.
    noteItem.appendChild(noteActions);

    // Hazirladigimiz liste elemanini ekrandaki listeye ekliyoruz.
    notesList.appendChild(noteItem);
  });
}

// Bu fonksiyon kullanici bir notu duzenlemek istediginde calisir.
function startEditNote(index) {
  // Duzenlenecek notun sira numarasini sakliyoruz.
  noteIndexToEdit = index;

  // Secilen notun metnini ustteki textarea alanina yaziyoruz.
  noteInput.value = notes[index].text;

  // Ana butonun yazisini degistiriyoruz.
  submitNoteButton.textContent = "Notu Guncelle";

  // Vazgec butonunu gorunur hale getiriyoruz.
  cancelEditButton.classList.remove("hidden");

  // Kullanici hemen yazmaya baslayabilsin diye imleci textarea alanina goturuyoruz.
  noteInput.focus();
}

// Bu fonksiyon duzenleme modunu kapatir.
function cancelEditNote() {
  // Artik duzenlenen bir not olmadigini soyluyoruz.
  noteIndexToEdit = null;

  // Yazma alanini temizliyoruz.
  noteInput.value = "";

  // Duzenleme iptal edilince varsa hata mesajini da temizliyoruz.
  clearNoteError();

  // Ana butonu tekrar not ekleme moduna aliyoruz.
  submitNoteButton.textContent = "Not Ekle";

  // Vazgec butonunu tekrar gizliyoruz.
  cancelEditButton.classList.add("hidden");
}

// Bu fonksiyon silme onay penceresini acar.
function openDeleteModal(index) {
  // Hangi notun silinmek istendigini sakliyoruz.
  noteIndexToDelete = index;

  // hidden class'ini kaldirinca modal ekranda gorunur.
  deleteModal.classList.remove("hidden");
}

// Bu fonksiyon silme onay penceresini kapatir.
function closeDeleteModal() {
  // Silinecek not bilgisini temizliyoruz.
  noteIndexToDelete = null;

  // hidden class'ini ekleyince modal ekrandan gizlenir.
  deleteModal.classList.add("hidden");
}

// Bu fonksiyon kullanici modal icinde "Evet, Sil" dediginde calisir.
function confirmDeleteNote() {
  // Eger silinecek not secilmediyse hicbir islem yapmadan duruyoruz.
  if (noteIndexToDelete === null) {
    return;
  }

  // splice, diziden eleman silmek icin kullanilir.
  // Burada index sirasindaki 1 adet notu siliyoruz.
  notes.splice(noteIndexToDelete, 1);

  // Not silindikten sonra localStorage kaydini da guncelliyoruz.
  saveNotes();

  // Bir notu duzenlerken silme yapildiysa duzenleme modunu kapatiyoruz.
  cancelEditNote();

  // Not silindikten sonra ekrandaki listeyi yeniden guncelliyoruz.
  renderNotes();

  // Silme bittikten sonra onay penceresini kapatiyoruz.
  closeDeleteModal();
}

// Bu fonksiyon kullanici formu gonderdiginde calisir.
function addNote(event) {
  // Formun sayfayi yenilemesini engelliyoruz.
  // Bunu yapmazsak butona basinca sayfa sifirlanir.
  event.preventDefault();

  // Kullanıcının yazdigi metni aliyoruz.
  // trim(), bastaki ve sondaki gereksiz bosluklari siler.
  const newNote = noteInput.value.trim();

  // Eger kullanici hicbir sey yazmadiysa fonksiyonu burada durduruyoruz.
  if (newNote === "") {
    showNoteError();
    return;
  }

  // Buraya geldiysek kullanici gecerli bir not yazmis demektir.
  // Daha once hata gorunduyse temizliyoruz.
  clearNoteError();

  // Eger noteIndexToEdit null degilse, yeni not eklemiyoruz.
  // Bunun yerine var olan notu guncelliyoruz.
  if (noteIndexToEdit !== null) {
    notes[noteIndexToEdit].text = newNote;
    notes[noteIndexToEdit].updatedAt = new Date().toISOString();
    saveNotes();
    cancelEditNote();
    renderNotes();
    return;
  }

  // Yeni notu nesne olarak notes dizisinin sonuna ekliyoruz.
  notes.push(createNote(newNote));

  // Yeni notu ekledikten sonra localStorage kaydini guncelliyoruz.
  saveNotes();

  // Not eklendikten sonra yazma alanini temizliyoruz.
  noteInput.value = "";

  // Ekrandaki listeyi guncelliyoruz.
  renderNotes();
}

// Forma submit olayi ekliyoruz.
// Yani kullanici "Not Ekle" butonuna bastiginda addNote fonksiyonu calisacak.
noteForm.addEventListener("submit", addNote);

// Kullanici yazmaya baslayinca hata mesajini temizliyoruz.
noteInput.addEventListener("input", clearNoteError);

// Kullanici arama alanina yazdikca not listesini yeniden ciziyoruz.
searchInput.addEventListener("input", renderNotes);

// Vazgec butonuna tiklaninca modal kapanacak ve not silinmeyecek.
cancelDeleteButton.addEventListener("click", closeDeleteModal);

// Evet, Sil butonuna tiklaninca secili not silinecek.
confirmDeleteButton.addEventListener("click", confirmDeleteNote);

// Vazgec butonuna tiklaninca duzenleme modu kapanacak.
cancelEditButton.addEventListener("click", cancelEditNote);

// Sayfa ilk acildiginda kayitli notlari yukluyoruz.
loadNotes();

// Kayitli notlari ekranda gosteriyoruz.
renderNotes();
