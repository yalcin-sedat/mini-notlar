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

// Toplam not sayisini gosteren yazi alanini seciyoruz.
const noteCount = document.querySelector("#note-count");

// Silme onay penceresini seciyoruz.
const deleteModal = document.querySelector("#delete-modal");

// Kullanici silmekten vazgecerse tiklayacagi butonu seciyoruz.
const cancelDeleteButton = document.querySelector("#cancel-delete-button");

// Kullanici silmeyi kesinlestirirse tiklayacagi butonu seciyoruz.
const confirmDeleteButton = document.querySelector("#confirm-delete-button");

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

// Bu fonksiyon not listesini ekranda yeniden olusturur.
// Yeni not ekledigimizde veya ileride not sildigimizde bu fonksiyonu kullanacagiz.
function renderNotes() {
  // Once listedeki eski HTML'i temizliyoruz.
  // Boylece ekrani bastan, guncel notlara gore cizebiliriz.
  notesList.innerHTML = "";

  // Not sayisini ekranda guncelliyoruz.
  noteCount.textContent = `${notes.length} not`;

  // Eger hic not yoksa kullaniciya bos durum mesaji gosteriyoruz.
  if (notes.length === 0) {
    notesList.innerHTML = '<li class="empty-state">Henuz not eklenmedi.</li>';
    return;
  }

  // notes dizisindeki her not icin ekranda bir liste elemani olusturuyoruz.
  // index, notun listedeki sira numarasidir. Silme isleminde bu numarayi kullanacagiz.
  notes.forEach(function (note, index) {
    // Yeni bir <li> HTML elemani olusturuyoruz.
    const noteItem = document.createElement("li");

    // Bu elemana CSS'te yazdigimiz .note-item stilini veriyoruz.
    noteItem.className = "note-item";

    // Not metnini tutacak bir <p> elemani olusturuyoruz.
    const noteText = document.createElement("p");

    // <p> elemaninin icine kullanicinin yazdigi notu koyuyoruz.
    noteText.textContent = note;

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
      startEditNote(index);
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
      openDeleteModal(index);
    });

    // Not metnini liste elemaninin icine ekliyoruz.
    noteItem.appendChild(noteText);

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
  noteInput.value = notes[index];

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
    notes[noteIndexToEdit] = newNote;
    cancelEditNote();
    renderNotes();
    return;
  }

  // Yeni notu notes dizisinin sonuna ekliyoruz.
  notes.push(newNote);

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

// Vazgec butonuna tiklaninca modal kapanacak ve not silinmeyecek.
cancelDeleteButton.addEventListener("click", closeDeleteModal);

// Evet, Sil butonuna tiklaninca secili not silinecek.
confirmDeleteButton.addEventListener("click", confirmDeleteNote);

// Vazgec butonuna tiklaninca duzenleme modu kapanacak.
cancelEditButton.addEventListener("click", cancelEditNote);
