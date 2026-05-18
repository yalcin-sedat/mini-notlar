// Bu dosya tarayıcıya kaydedilen tema tercihini yönetir.
// Notlar artık sunucuda saklandığı için burada sadece tema işlemleri kaldı.

const THEME_KEY = "mini-notlar-theme";

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "dark" ? "dark" : "light";
}
