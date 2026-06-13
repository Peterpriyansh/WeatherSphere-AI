const FAVORITES_KEY = "atmos-favorites";
let favoriteSelectHandler = null;

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(city) {
  const target = String(city || "").toLowerCase();
  return getFavorites().some(item => String(item).toLowerCase() === target);
}

function addFavorite(city) {
  const clean = String(city || "").trim();
  if (!clean) return;
  const list = getFavorites();
  if (!list.some(item => item.toLowerCase() === clean.toLowerCase())) {
    list.unshift(clean);
    saveFavorites(list.slice(0, 12));
  }
}

function removeFavorite(city) {
  const target = String(city || "").toLowerCase();
  const list = getFavorites().filter(item => String(item).toLowerCase() !== target);
  saveFavorites(list);
}

function toggleFavorite(city) {
  if (isFavorite(city)) {
    removeFavorite(city);
    return false;
  }
  addFavorite(city);
  return true;
}

function setFavoritesHandler(handler) {
  favoriteSelectHandler = handler;
}

function renderFavorites(currentCity = "") {
  const container = document.getElementById("favorites");
  if (!container) return;

  const list = getFavorites();
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<span class="empty-state">Save cities here for quick access.</span>`;
    return;
  }

  list.forEach(city => {
    const chip = document.createElement("button");
    chip.className = "favorite-chip";
    if (city.toLowerCase() === String(currentCity).toLowerCase()) chip.classList.add("active");
    chip.textContent = city;
    chip.title = "Click to open";

    chip.addEventListener("click", () => {
      if (typeof favoriteSelectHandler === "function") favoriteSelectHandler(city);
    });

    chip.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      removeFavorite(city);
      renderFavorites(currentCity);
    });

    container.appendChild(chip);
  });
}

function syncFavoriteButton(city) {
  const btn = document.getElementById("favoriteBtn");
  if (!btn) return;

  const active = isFavorite(city);
  btn.textContent = active ? "★" : "☆";
  btn.classList.toggle("active", active);
}

window.AtmosFavorites = {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  isFavorite,
  renderFavorites,
  setFavoritesHandler,
  syncFavoriteButton
};