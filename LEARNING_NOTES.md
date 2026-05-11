# Mini Notlar Ogrenme Notlari

Bu dokuman, Mini Notlar projesinde hangi dosyanin ne ise yaradigini, dosyalarin birbirine nasil baglandigini ve temel kod bloklarinin ne yaptigini anlaman icin hazirlandi.

## Buyuk Resim

Uygulama su isleri yapar:

- Kullanici not yazar.
- Not listeye eklenir.
- Butonlarda kisa ikonlar kullanilir.
- Notlar tarayicida saklanir.
- Notlar duzenlenebilir.
- Notlar sabitlenebilir.
- Sabitlenen notlar en ustte gosterilir.
- Notlar tek tek veya topluca silinebilir.
- Notlar icinde arama yapilabilir.
- Arama kutusu tek tiklamayla temizlenebilir.
- Hic not yoksa daha aciklayici bos liste ekrani gosterilir.
- Notlarin olusturma ve guncelleme tarihi gosterilir.
- Not yazarken karakter sayisi takip edilir.
- Islem sonrasi kullaniciya kisa durum mesaji gosterilir.
- Durum mesaji animasyonla acilip kapanir.
- Escape tusu ile modal veya duzenleme modu kapatilabilir.
- Modal disina tiklayinca modal kapatilabilir.
- Kullanici koyu veya acik tema secebilir.
- Tema tercihi tarayicida saklanir.

## Dosya Yapisi

```text
mini-notlar/
  index.html
  style.css
  README.md
  LEARNING_NOTES.md
  js/
    app.js
    notes.js
    storage.js
    ui.js
```

## Dosyalarin Gorevleri

### `index.html`

Sayfanin iskeletidir.

Burada:

- Basliklar
- Not yazma formu
- Arama kutusu
- Arama temizleme butonu
- Karakter sayaci
- Tema degistirme butonu
- Ikonlu butonlar
- Durum mesaji
- Durum mesaji animasyonu
- Notlarin gosterilecegi liste
- Silme onay penceresi
- JavaScript baglantisi

bulunur.

### `style.css`

Sayfanin gorunumunu belirler.

Burada:

- Renkler
- CSS degiskenleri
- Koyu/acik tema renkleri
- Bosluklar
- Buton stilleri
- Ikon buton boyutlari
- Not kartlari
- Hata gorunumu
- Modal gorunumu
- Mobil uyum

ayarlanir.

### `js/app.js`

Uygulamanin ana merkezidir.

Burada:

- Notlar hafizada tutulur.
- Kullanici olaylari dinlenir.
- Not ekleme, silme, duzenleme ve tumunu temizleme akisi yonetilir.
- Not sabitleme akisi yonetilir.
- Diger dosyalardan gelen fonksiyonlar birlestirilir.

### `js/notes.js`

Not verisiyle ilgilenir.

Burada:

- Yeni not nesnesi olusturulur.
- Eski not verisi yeni yapıya uyarlanir.
- Notun sabitli olup olmadigi tutulur.
- Tarihler okunabilir hale getirilir.

### `js/storage.js`

Tarayicinin `localStorage` alanini yonetir.

Burada:

- Notlar kaydedilir.
- Tema tercihi kaydedilir.
- Sayfa acildiginda eski notlar geri yuklenir.
- Sayfa acildiginda kayitli tema geri yuklenir.
- Bozuk veri varsa uygulama korunur.

### `js/ui.js`

Ekranla ilgili islemleri yonetir.

Burada:

- HTML elemanlari secilir.
- Not listesi ekrana cizilir.
- Bos liste ve bos arama sonucu ekrani olusturulur.
- Hata mesaji gosterilir/gizlenir.
- Arama temizleme butonu gosterilir/gizlenir.
- Karakter sayisi guncellenir.
- Durum mesaji gosterilir.
- Modal acilir/kapanir.
- Duzenleme modu ekranda gosterilir.
- Secilen tema ekrana uygulanir.
- Ikon butonlarin gorunen metni, basligi ve erisilebilir adi guncellenir.

## Dosyalar Birbirine Nasil Baglaniyor?

HTML dosyasi sadece uygulamanin baslangic dosyasini cagirir:

```html
<script type="module" src="js/app.js"></script>
```

Burada iki onemli sey var:

- `src="js/app.js"`: Tarayici once `app.js` dosyasini calistirir.
- `type="module"`: JavaScript dosyalarinin `import` ve `export` kullanmasina izin verir.

Sonra `app.js`, ihtiyaci olan fonksiyonlari diger dosyalardan alir:

```js
import { createNote } from "./notes.js";
import { loadNotes, saveNotes } from "./storage.js";
import { elements, renderNotes } from "./ui.js";
```

Bu su demektir:

- `notes.js` dosyasindan `createNote` fonksiyonunu al.
- `storage.js` dosyasindan `loadNotes` ve `saveNotes` fonksiyonlarini al.
- `ui.js` dosyasindan HTML elemanlarini ve ekrana cizme fonksiyonunu al.

Bir dosyanin baska dosyaya bir fonksiyon verebilmesi icin `export` kullanilir:

```js
export function createNote(text) {
  // ...
}
```

Baska dosya bu fonksiyonu kullanmak isterse `import` eder:

```js
import { createNote } from "./notes.js";
```

Kisaca:

```text
export = disari ver
import = disaridan al
```

## Uygulama Akisi

Sayfa acilinca:

```text
index.html
  -> js/app.js
    -> loadNotes()
    -> updateScreen()
```

Kullanici not ekleyince:

```text
Form submit olur
  -> handleNoteSubmit()
    -> createNote()
    -> saveNotes()
    -> updateScreen()
```

Kullanici not duzenleyince:

```text
Duzenle butonuna tiklanir
  -> startEditNote()
    -> showEditMode()
      -> textarea icine eski not yazilir
```

Kullanici notu guncelleyince:

```text
Form tekrar submit olur
  -> handleNoteSubmit()
    -> var olan not guncellenir
    -> saveNotes()
    -> updateScreen()
```

Kullanici not silince:

```text
Sil butonuna tiklanir
  -> openDeleteModal()
    -> modal acilir
      -> Evet, Sil
        -> confirmDelete()
          -> not diziden silinir
          -> saveNotes()
          -> updateScreen()
```

Kullanici modal disina tiklayinca:

```text
Modal arka planina tiklanir
  -> handleModalClick()
    -> tiklanan eleman modal arka plani mi kontrol edilir
      -> evetse cancelDelete()
        -> modal kapanir
```

Kullanici tema degistirince:

```text
Koyu Tema / Acik Tema butonuna tiklanir
  -> toggleTheme()
    -> currentTheme degisir
    -> applyTheme()
      -> body elemanina dark-theme class'i eklenir veya kaldirilir
    -> saveTheme()
      -> secim localStorage alanina kaydedilir
```

Kullanici arama kutusunu temizleyince:

```text
Temizle butonuna tiklanir
  -> clearSearch()
    -> searchInput.value bos metin olur
    -> updateScreen()
      -> tum notlar tekrar gosterilir
      -> Temizle butonu gizlenir
```

## Kod Bloklariyla Aciklama

### 1. HTML icinde JavaScript baglantisi

```html
<script type="module" src="js/app.js"></script>
```

Bu satir uygulamanin JavaScript tarafini baslatir.

`type="module"` sayesinde `app.js`, baska JavaScript dosyalarindan fonksiyon alabilir.

### 2. app.js icinde import kullanimi

```js
import { createNote } from "./notes.js";
import { loadNotes, saveNotes } from "./storage.js";
```

Bu kod, `app.js` dosyasina baska dosyalardaki fonksiyonlari getirir.

Boylece her seyi tek dosyada yazmak yerine kodu bolmus oluruz.

### 3. Notlari yukleme

```js
let notes = loadNotes();
```

Sayfa ilk acildiginda tarayicida kayitli notlari yukler.

Eger kayit yoksa bos dizi gelir:

```js
[]
```

### 4. Yeni not olusturma

```js
notes.push(createNote(newNoteText));
```

Bu satir yeni notu `notes` dizisine ekler.

`createNote()` sadece metin degil, tarih bilgisi de olan bir not nesnesi olusturur.

Ornek:

```js
{
  text: "Alisveris yap",
  isPinned: false,
  createdAt: "2026-05-11T10:00:00.000Z",
  updatedAt: "2026-05-11T10:00:00.000Z"
}
```

`isPinned` notun sabitlenip sabitlenmedigini tutar.

```text
false = sabit degil
true = sabit
```

### 5. Notlari kaydetme

```js
saveNotes(notes);
```

Bu satir notlari tarayicinin `localStorage` alanina kaydeder.

Sayfa yenilense bile notlar kaybolmaz.

### 6. Ekrani guncelleme

```js
updateScreen();
```

Bu fonksiyon ekrandaki not listesini yeniden cizer.

Icinde su fonksiyon calisir:

```js
renderNotes(notes, {
  onEdit: startEditNote,
  onDelete: openDeleteModal,
  onTogglePin: togglePinNote,
});
```

Yani `ui.js` dosyasina deriz ki:

```text
Bu notlari ekranda goster.
Duzenle tiklanirsa startEditNote calissin.
Sil tiklanirsa openDeleteModal calissin.
Sabitle tiklanirsa togglePinNote calissin.
```

### 7. Event listener mantigi

```js
elements.noteForm.addEventListener("submit", handleNoteSubmit);
```

Bu satir su anlama gelir:

```text
Kullanici formu gonderirse handleNoteSubmit fonksiyonunu calistir.
```

Yani butona tiklandiginda uygulama ne yapacagini buradan bilir.

### 8. Bos not kontrolu

```js
if (newNoteText === "") {
  showNoteError();
  return;
}
```

Bu kod sunu yapar:

- Kullanici hicbir sey yazmadiysa hata gosterir.
- `return` ile fonksiyonu durdurur.
- Boylece bos not eklenmez.

### 9. Duzenleme modu

```js
if (noteIndexToEdit !== null) {
  notes[noteIndexToEdit].text = newNoteText;
  notes[noteIndexToEdit].updatedAt = new Date().toISOString();
  cancelEditNote();
  saveAndRender();
  return;
}
```

Bu kod sunu kontrol eder:

```text
Su anda yeni not mu ekliyoruz, yoksa eski notu mu duzenliyoruz?
```

Eger `noteIndexToEdit` bos degilse, yeni not eklenmez. Var olan not guncellenir.

### 10. Tek not silme

```js
notes.splice(noteIndexToDelete, 1);
```

Bu satir `notes` dizisinden bir not siler.

`noteIndexToDelete`, hangi notun silinecegini tutar.

### 11. Tum notlari silme

```js
notes = [];
```

Bu satir butun not listesini bosaltir.

Sonra:

```js
saveAndRender();
```

ile hem kayit guncellenir hem ekran yeniden cizilir.

### 12. UI dosyasinda HTML elemanlarini secme

```js
export const elements = {
  noteForm: document.querySelector("#note-form"),
  noteInput: document.querySelector("#note-input"),
  notesList: document.querySelector("#notes-list"),
};
```

Bu kod HTML icindeki elemanlari JavaScript tarafina getirir.

Mesela:

```js
document.querySelector("#note-input")
```

HTML'deki su elemani bulur:

```html
<textarea id="note-input"></textarea>
```

### 13. Not listesini ekranda cizme

```js
export function renderNotes(notes, handlers) {
  elements.notesList.innerHTML = "";
  // ...
}
```

Bu fonksiyon not listesini bastan cizer.

Once eski listeyi temizler:

```js
elements.notesList.innerHTML = "";
```

Sonra guncel notlara gore yeni liste olusturur.

Hic not yoksa veya arama sonucunda not bulunamazsa daha aciklayici bir bos durum karti gosteriyoruz.

Bu karti olusturan yardimci fonksiyon:

```js
function createEmptyState(title, message) {
  const emptyItem = document.createElement("li");
  emptyItem.className = "empty-state";

  const emptyIcon = document.createElement("span");
  emptyIcon.className = "empty-state-icon";
  emptyIcon.textContent = "+";

  const emptyTitle = document.createElement("strong");
  emptyTitle.textContent = title;

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = message;

  emptyItem.appendChild(emptyIcon);
  emptyItem.appendChild(emptyTitle);
  emptyItem.appendChild(emptyMessage);

  return emptyItem;
}
```

Burada `innerHTML` ile uzun HTML metni yazmak yerine `document.createElement` kullandik.

Bu sayede:

- Hangi HTML elemanini olusturdugumuz daha net gorunur.
- Her elemana ayri ayri class ve metin verebiliriz.
- Kod buyudukce parcalari okumak kolaylasir.

Bos liste ekrani su sekilde listeye eklenir:

```js
elements.notesList.appendChild(
  createEmptyState("Henuz not yok", "Ilk notunu yazip Not Ekle butonuna basabilirsin.")
);
```

### 14. Arama mantigi

```js
const searchText = elements.searchInput.value.trim().toLowerCase();
```

Bu satir arama kutusundaki metni alir.

Sonra notlar filtrelenir:

```js
.filter(function (item) {
  return item.note.text.toLowerCase().includes(searchText);
})
```

Bu kod, sadece arama metnini iceren notlari gosterir.

### 15. Sabitlenen notlari en ustte gosterme

```js
.sort(function (firstItem, secondItem) {
  if (firstItem.note.isPinned !== secondItem.note.isPinned) {
    return secondItem.note.isPinned - firstItem.note.isPinned;
  }

  return secondItem.index - firstItem.index;
});
```

Bu kod notlari ekranda gosterirken siralar.

Once sabitlenen notlar ustte gorunur.

Ayni gruptaki notlarda ise en yeni not ustte kalir.

Notun sabitlenme durumunu degistiren fonksiyon:

```js
function togglePinNote(index) {
  notes[index].isPinned = !notes[index].isPinned;
  saveAndRender();
}
```

Buradaki `!` isareti boolean degeri tersine cevirir.

```text
true ise false yapar.
false ise true yapar.
```

Eski notlarda `isPinned` alani olmayabilir.

Bu yuzden `normalizeNote()` icinde varsayilan deger ekledik:

```js
isPinned: note.isPinned === true,
```

Bu satir sunu yapar:

```text
Kayitli notta isPinned true ise true kullan.
Diger her durumda false kullan.
```

### 16. Karakter sayaci

HTML tarafinda not yazma alanina `maxlength` ekledik:

```html
<textarea id="note-input" maxlength="500"></textarea>
```

Bu, kullanicinin en fazla 500 karakter yazabilecegi anlamina gelir.

JavaScript tarafinda karakter sayisini guncelleyen fonksiyon:

```js
export function updateCharacterCount() {
  const maxLength = elements.noteInput.getAttribute("maxlength");
  const currentLength = elements.noteInput.value.length;

  elements.characterCount.textContent = `${currentLength} / ${maxLength}`;
}
```

Bu fonksiyon:

- Textarea icindeki mevcut karakter sayisini alir.
- HTML'deki `maxlength` degerini okur.
- Ekrandaki sayaci gunceller.

Kullanici yazdikca bu fonksiyon calisir:

```js
elements.noteInput.addEventListener("input", handleNoteInput);
```

Yani her karakter yazildiginda hem hata mesaji temizlenir hem de sayac guncellenir.

### 17. Durum mesaji

Kullanicinin yaptigi islemden sonra ekranda kisa bilgi gosteriyoruz.

HTML tarafinda mesaj alani:

```html
<p id="status-message" class="status-message hidden" aria-live="polite"></p>
```

JavaScript tarafinda mesaj gosterme fonksiyonu:

```js
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
```

Bu fonksiyon:

- Daha once baslamis bir zamanlayici varsa temizler.
- Mesaj metnini gunceller.
- `hidden` class'ini kaldirir.
- `status-visible` class'i ile mesajin animasyonla gorunmesini saglar.
- 5 saniye sonra `status-visible` class'ini kaldirir.
- Animasyon bittikten sonra `hidden` class'i ile mesaji tamamen gizler.

Ornek kullanim:

```js
showStatusMessage("Not eklendi.");
```

Bu satir kullaniciya notun basariyla eklendigini bildirir.

Tehlikeli bir islem icin ikinci parametre verebiliriz:

```js
showStatusMessage("Not silindi.", "danger");
```

Bu mesaj kirmizi tonlu gorunur.

Burada kullandigimiz yeni kavram:

```js
setTimeout(function () {
  // belli sure sonra calisir
}, 5000);
```

`setTimeout`, bir kodu belirli bir sure sonra calistirir.

`5000` milisaniyedir. Yani 5 saniye demektir.

Toast animasyonu icin CSS tarafinda sunlari kullandik:

```css
.status-message {
  opacity: 0;
  transform: translate(-50%, -10px);
  transition: opacity 200ms ease, transform 200ms ease;
}

.status-message.status-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}
```

Bu kodda:

- `opacity: 0` mesaji gorunmez yapar.
- `opacity: 1` mesaji gorunur yapar.
- `transform` mesaji biraz yukaridan getirir.
- `transition` bu degisimin bir anda degil, yumusak olmasini saglar.

Burada kullandigimiz yeni kavram:

```js
requestAnimationFrame(function () {
  elements.statusMessage.classList.add("status-visible");
});
```

`requestAnimationFrame`, tarayici ekrani tekrar cizmeden hemen once kod calistirmamizi saglar.

Bu projede bunu su nedenle kullandik:

```text
Once hidden class'i kalksin.
Sonra status-visible class'i eklensin.
Boylece tarayici iki durumu ayri ayri gorur ve animasyon calisir.
```

### 18. Klavye kisayolu

Kullanicinin `Escape` tusuna bastigini anlamak icin `keydown` olayini dinliyoruz:

```js
document.addEventListener("keydown", handleKeyboardShortcuts);
```

Bu satir su anlama gelir:

```text
Sayfada bir tusa basilinca handleKeyboardShortcuts fonksiyonunu calistir.
```

Fonksiyon icinde sadece `Escape` tusuyla ilgileniyoruz:

```js
function handleKeyboardShortcuts(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (isDeleteModalOpen()) {
    cancelDelete();
    return;
  }

  if (isEditingNote()) {
    cancelEditNote();
  }
}
```

Bu kod:

- Basilan tus `Escape` degilse hicbir sey yapmaz.
- Silme penceresi aciksa pencereyi kapatir.
- Duzenleme modundaysa duzenlemeyi iptal eder.

Modal disina tiklayinca kapatmak icin modal elemanina `click` olayi ekledik:

```js
elements.deleteModal.addEventListener("click", handleModalClick);
```

Sonra tiklanan yerin gercekten modal arka plani olup olmadigini kontrol ettik:

```js
function handleModalClick(event) {
  if (event.target === elements.deleteModal) {
    cancelDelete();
  }
}
```

Burada yeni kavram `event.target`.

`event.target`, tiklamanin basladigi gercek HTML elemanini gosterir.

Bu projede su anlama gelir:

```text
Kullanici koyu modal arka planina tiklarsa:
event.target === elements.deleteModal olur.

Kullanici modal kutusunun icindeki yaziya veya butona tiklarsa:
event.target baska bir eleman olur.
```

Bu sayede modal kutusunun icine tiklayinca modal kapanmaz, sadece dis alana tiklayinca kapanir.

### 19. CSS degiskenleri

Tema eklemek icin renkleri tek tek her yerde degistirmek yerine CSS degiskenleri kullandik.

```css
:root {
  --page-background: #f4f7f6;
  --text-color: #1f2933;
  --panel-background: #ffffff;
}
```

`:root`, sayfanin en ust seviyesi gibi dusunulebilir.

Burada tanimlanan degiskenleri baska yerlerde soyle kullaniriz:

```css
body {
  background: var(--page-background);
  color: var(--text-color);
}
```

`var(--page-background)` su anlama gelir:

```text
page-background degiskenindeki rengi kullan.
```

Koyu tema icin ayni degiskenlere yeni degerler verdik:

```css
body.dark-theme {
  --page-background: #111827;
  --text-color: #f9fafb;
  --panel-background: #1f2937;
}
```

Boylece `body` elemaninda `dark-theme` class'i varsa renkler otomatik degisir.

### 20. Tema butonu

HTML tarafina tema degistirmek icin bir buton ekledik:

```html
<button id="theme-toggle-button" class="theme-button" type="button" aria-pressed="false">Koyu Tema</button>
```

Bu butonu JavaScript tarafinda secmek icin `ui.js` icindeki `elements` nesnesine ekledik:

```js
themeToggleButton: document.querySelector("#theme-toggle-button"),
```

Boylece `app.js` icinde butona tiklanma olayini dinleyebiliriz:

```js
elements.themeToggleButton.addEventListener("click", toggleTheme);
```

### 21. classList.toggle

Tema class'ini eklemek veya kaldirmak icin `classList.toggle` kullandik.

```js
document.body.classList.toggle("dark-theme", isDarkTheme);
```

Bu kullanimda ikinci parametre cok onemlidir:

```text
isDarkTheme true ise dark-theme class'i eklenir.
isDarkTheme false ise dark-theme class'i kaldirilir.
```

Yani manuel olarak iki ayri `if` yazmadan temayi ekrana uygulamis oluruz.

### 22. Tema bilgisini kaydetme

Notlari kaydettigimiz gibi tema tercihini de `localStorage` icinde sakladik.

`storage.js` icinde iki yeni fonksiyon var:

```js
export function saveTheme(theme) {
  localStorage.setItem(themeStorageKey, theme);
}
```

Bu fonksiyon secili temayi kaydeder.

```js
export function loadTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);

  if (savedTheme === "dark") {
    return "dark";
  }

  return "light";
}
```

Bu fonksiyon sayfa acildiginda kayitli temayi okur.

Eger kayitli tema `dark` ise koyu tema gelir.

Kayit yoksa uygulama acik tema ile baslar.

### 23. Tema akisini app.js yonetir

`app.js` icinde sayfa ilk acildiginda tema yuklenir:

```js
let currentTheme = loadTheme();
```

Sonra ekran ilk hazirlanirken tema uygulanir:

```js
applyTheme(currentTheme);
```

Butona tiklaninca bu fonksiyon calisir:

```js
function toggleTheme() {
  if (currentTheme === "dark") {
    currentTheme = "light";
  } else {
    currentTheme = "dark";
  }

  applyTheme(currentTheme);
  saveTheme(currentTheme);
  showStatusMessage("Tema tercihi kaydedildi.");
}
```

Bu fonksiyon:

- Mevcut tema koyuysa acik yapar.
- Mevcut tema aciksa koyu yapar.
- Yeni temayi ekrana uygular.
- Yeni temayi tarayicida saklar.
- Kullaniciya durum mesaji gosterir.

### 24. Arama kutusunu temizleme

Arama kutusunun yanina bir Temizle butonu ekledik:

```html
<button id="clear-search-button" class="secondary-button small-button hidden" type="button">Temizle</button>
```

Butonda bastan `hidden` class'i var.

Bu su anlama gelir:

```text
Sayfa ilk acildiginda Temizle butonu gorunmesin.
```

`ui.js` icinde butonu sectik:

```js
clearSearchButton: document.querySelector("#clear-search-button"),
```

Sonra butonun gorunup gorunmeyecegini yoneten bir fonksiyon yazdik:

```js
export function updateClearSearchButton() {
  if (elements.searchInput.value.trim() === "") {
    elements.clearSearchButton.classList.add("hidden");
    return;
  }

  elements.clearSearchButton.classList.remove("hidden");
}
```

Bu fonksiyon:

- Arama kutusu bossa Temizle butonunu gizler.
- Arama kutusunda metin varsa Temizle butonunu gosterir.

`app.js` icinde aramayi temizleyen fonksiyon:

```js
function clearSearch() {
  elements.searchInput.value = "";
  updateScreen();
  elements.searchInput.focus();
}
```

Buradaki en onemli satir:

```js
elements.searchInput.value = "";
```

Bu satir arama kutusunun icindeki metni siler.

Sonra:

```js
updateScreen();
```

ile not listesi tekrar cizilir.

En son:

```js
elements.searchInput.focus();
```

ile imlec tekrar arama kutusuna gider.

Butona tiklandiginda bu fonksiyonun calismasi icin event listener ekledik:

```js
elements.clearSearchButton.addEventListener("click", clearSearch);
```

### 25. Butonlari ikonlara cevirme

Butonlarda uzun metin yerine kisa ikonlar kullandik.

Ornek:

```html
<button aria-label="Not ekle" title="Not ekle">+</button>
```

Burada butonun ekranda gorunen kismi `+` ikonudur.

Ama butonun anlami kaybolmasin diye iki ozellik ekledik:

```text
aria-label = ekran okuyucular icin butonun adi
title      = uzerine gelince gorunen kisa aciklama
```

Dinamik olusan butonlarda ayni isi tekrar tekrar yazmamak icin `ui.js` icinde yardimci fonksiyon olusturduk:

```js
function setButtonInfo(button, label, icon) {
  button.textContent = icon;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
}
```

Bu fonksiyon:

- Butonun gorunen ikonunu ayarlar.
- Butonun erisilebilir adini ayarlar.
- Hover aciklamasini ayarlar.

Ornek kullanim:

```js
setButtonInfo(editButton, "Notu duzenle", "✎");
```

Bu satir ekranda kalem ikonu gosterir, ama butonun anlamini `Notu duzenle` olarak saklar.

## Neden Kodlari Bolduk?

Baslangicta her sey tek dosyada olabilir. Ama proje buyuyunce tek dosya zorlasir.

Bu yuzden kodu sorumluluklara gore ayirdik:

```text
app.js      -> uygulama akisi
notes.js    -> not verisi
storage.js  -> veri kaydetme/yukleme
ui.js       -> ekran islemleri
```

Bu sayede:

- Kod daha kolay okunur.
- Hata bulmak kolaylasir.
- Yeni ozellik eklemek kolaylasir.
- Her dosyanin gorevi net olur.

## Su Anda Bilmen Gereken Ana Kavramlar

### Değisken

Veri tutar.

```js
let notes = [];
```

### Fonksiyon

Tekrar kullanilabilir is parcasi.

```js
function saveAndRender() {
  saveNotes(notes);
  updateScreen();
}
```

### Dizi

Birden fazla veriyi sirali tutar.

```js
let notes = [];
```

### Nesne

Bir veriyi birden fazla ozellikle tutar.

```js
{
  text: "Not",
  createdAt: "...",
  updatedAt: "..."
}
```

### Event Listener

Kullanici bir sey yaptiginda kod calistirir.

```js
button.addEventListener("click", function () {
  // tiklaninca calisir
});
```

### aria-label

Bir butonun veya elemanin erisilebilir adini belirler.

```html
<button aria-label="Notu sil">×</button>
```

Bu ornekte ekranda sadece ikon gorunur, ama butonun anlami korunur.

### title

Bir elemanin uzerine gelince gorunen kisa aciklamadir.

```html
<button title="Notu sil">×</button>
```

### event.target

Bir olayda kullanicinin gercekten hangi elemana tikladigini soyler.

```js
function handleClick(event) {
  console.log(event.target);
}
```

Modal disina tiklama ozelliginde, tiklanan yer modal arka plani mi diye bunu kullandik.

### document.createElement

JavaScript ile yeni bir HTML elemani olusturur.

```js
const emptyItem = document.createElement("li");
```

Bu ornek yeni bir `li` elemani olusturur.

### appendChild

Bir HTML elemanini baska bir elemanin icine ekler.

```js
emptyItem.appendChild(emptyTitle);
```

Bu ornek `emptyTitle` elemanini `emptyItem` icine koyar.

### Module

Kodlari farkli dosyalara bolmeye yarar.

```js
export function createNote() {}
import { createNote } from "./notes.js";
```

### CSS Degiskeni

Bir rengi veya degeri isim vererek saklar.

```css
--text-color: #1f2933;
color: var(--text-color);
```

### classList.toggle

Bir HTML elemanina class ekler veya class'i kaldirir.

```js
document.body.classList.toggle("dark-theme", true);
```

### input.value

Bir input veya textarea icindeki metni okumak ya da degistirmek icin kullanilir.

```js
elements.searchInput.value = "";
```

Bu ornek arama kutusunu bosaltir.

### transition

CSS'te bir degisimin yumusak olmasini saglar.

```css
transition: opacity 200ms ease;
```

Bu ornek, `opacity` degisiminin 200 milisaniyede olmasini saglar.

### opacity

Bir elemanin gorunurlugunu belirler.

```css
opacity: 0;
opacity: 1;
```

`0` gorunmez, `1` tamamen gorunur demektir.

### transform

Bir elemani hareket ettirmek, dondurmek veya olceklendirmek icin kullanilir.

```css
transform: translate(-50%, -10px);
```

Bu ornek elemani yatayda kendi genisliginin yarisi kadar sola, dikeyde 10 piksel yukari tasir.

## Ogrenme Sirasi

Bu projeyi daha iyi anlamak icin dosyalari su sirayla oku:

1. `index.html`
2. `js/app.js`
3. `js/notes.js`
4. `js/storage.js`
5. `js/ui.js`
6. `style.css`

En onemli dosya `js/app.js`. Cunku butun parcalari bir araya getiren yer orasi.
