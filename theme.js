const THEME_KEY = "atmos-theme";

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(saved);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = document.body.classList.contains("theme-light") ? "dark" : "light";
      setTheme(next);
    });
  }
}

function setTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

function applyTheme(mode) {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(mode === "light" ? "theme-light" : "theme-dark");

  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = mode === "light" ? "☾" : "◐";
}

function applyWeatherTheme(weatherTheme = "cloudy", isNight = false) {
  const classes = ["weather-sunny", "weather-cloudy", "weather-rainy", "weather-snowy", "weather-night"];
  document.body.classList.remove(...classes);

  if (isNight) {
    document.body.classList.add("weather-night");
    return;
  }

  document.body.classList.add(`weather-${weatherTheme}`);
}

window.AtmosTheme = {
  initTheme,
  setTheme,
  applyTheme,
  applyWeatherTheme
};