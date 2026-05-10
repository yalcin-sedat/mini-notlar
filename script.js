// HTML icindeki formu secıyoruz. Kullanici "Not Ekle" butonuna bastiginda bu form calisacak.
const noteForm = document.querySelector("#note-form");

// Kullanıcının not yazdığı textarea alanini seciyoruz.
const noteInput = document.querySelector("#note-input");

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

    // Sil butonunu liste elemaninin icine ekliyoruz.
    noteItem.appendChild(deleteButton);

    // Hazirladigimiz liste elemanini ekrandaki listeye ekliyoruz.
    notesList.appendChild(noteItem);
  });
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

// Vazgec butonuna tiklaninca modal kapanacak ve not silinmeyecek.
cancelDeleteButton.addEventListener("click", closeDeleteModal);

// Evet, Sil butonuna tiklaninca secili not silinecek.
confirmDeleteButton.addEventListener("click", confirmDeleteNote);
