const state = {
  city: "",
  latitude: null,
  longitude: null,
  current: null,
  hourly: null,
  daily: null,
  aqi: null,
  conditionLabel: ""
};

window.weatherAppState = state;

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const errorBanner = document.getElementById("errorBanner");
const loadingSkeleton = document.getElementById("loadingSkeleton");

function getWeatherInfo(code) {
  const map = {
    0: { label: "Clear Sky", icon: "☀️", theme: "sunny" },
    1: { label: "Mainly Clear", icon: "🌤️", theme: "sunny" },
    2: { label: "Partly Cloudy", icon: "⛅", theme: "cloudy" },
    3: { label: "Overcast", icon: "☁️", theme: "cloudy" },
    45: { label: "Fog", icon: "🌫️", theme: "cloudy" },
    48: { label: "Fog", icon: "🌫️", theme: "cloudy" },
    51: { label: "Light Drizzle", icon: "🌦️", theme: "rainy" },
    53: { label: "Drizzle", icon: "🌦️", theme: "rainy" },
    55: { label: "Dense Drizzle", icon: "🌧️", theme: "rainy" },
    61: { label: "Rain", icon: "🌧️", theme: "rainy" },
    63: { label: "Rain", icon: "🌧️", theme: "rainy" },
    65: { label: "Heavy Rain", icon: "🌧️", theme: "rainy" },
    71: { label: "Snow", icon: "❄️", theme: "snowy" },
    73: { label: "Snow", icon: "❄️", theme: "snowy" },
    75: { label: "Heavy Snow", icon: "❄️", theme: "snowy" },
    77: { label: "Snow", icon: "❄️", theme: "snowy" },
    80: { label: "Showers", icon: "🌦️", theme: "rainy" },
    81: { label: "Showers", icon: "🌦️", theme: "rainy" },
    82: { label: "Heavy Showers", icon: "⛈️", theme: "rainy" },
    85: { label: "Snow Showers", icon: "❄️", theme: "snowy" },
    86: { label: "Snow Showers", icon: "❄️", theme: "snowy" },
    95: { label: "Thunderstorm", icon: "⛈️", theme: "rainy" },
    96: { label: "Thunderstorm", icon: "⛈️", theme: "rainy" },
    99: { label: "Thunderstorm", icon: "⛈️", theme: "rainy" }
  };

  return map[code] || { label: "Weather", icon: "🌡️", theme: "cloudy" };
}

function setLoading(isLoading) {
  if (loadingSkeleton) loadingSkeleton.classList.toggle("hidden", !isLoading);
  document.body.classList.toggle("is-loading", isLoading);
}

function showError(message) {
  if (!errorBanner) return;
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
}

function clearError() {
  if (!errorBanner) return;
  errorBanner.classList.add("hidden");
  errorBanner.textContent = "";
}

function formatTemp(value) {
  return `${Math.round(value)}°`;
}

function formatVisibility(value) {
  if (value === null || value === undefined) return "--";
  const km = value > 100 ? value / 1000 : value;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

function getDayName(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });
}

function getShortTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "numeric" });
}

function isNightNow(sunriseIso, sunsetIso) {
  if (!sunriseIso || !sunsetIso) return false;
  const now = new Date();
  const sunrise = new Date(sunriseIso);
  const sunset = new Date(sunsetIso);
  return now < sunrise || now > sunset;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function bindControls() {
  searchBtn?.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) searchCity(city);
  });

  cityInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  locationBtn?.addEventListener("click", () => loadCurrentLocation());

  favoriteBtn?.addEventListener("click", () => {
    if (!state.city) return;
    window.AtmosFavorites.toggleFavorite(state.city);
    window.AtmosFavorites.renderFavorites(state.city);
    window.AtmosFavorites.syncFavoriteButton(state.city);
  });

  window.AtmosFavorites.setFavoritesHandler((city) => {
    cityInput.value = city;
    searchCity(city);
  });

  window.AtmosVoice.initVoiceSearch((transcript) => {
    cityInput.value = transcript;
    searchCity(transcript);
  });
}

async function loadCurrentLocation() {
  clearError();
  setLoading(true);

  if (!navigator.geolocation) {
    setLoading(false);
    searchCity("Delhi");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      await loadWeatherByCoordinates(lat, lon, "Current Location");
      setLoading(false);
    },
    async () => {
      setLoading(false);
      await searchCity("Delhi");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

async function searchCity(city) {
  clearError();
  setLoading(true);

  try {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", city);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const response = await fetch(geoUrl.toString());
    if (!response.ok) throw new Error("City search failed.");

    const data = await response.json();
    if (!data.results || !data.results.length) {
      throw new Error("City not found.");
    }

    const place = data.results[0];
    await loadWeatherByCoordinates(place.latitude, place.longitude, place.name);
  } catch (error) {
    showError(error.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}

async function loadWeatherByCoordinates(latitude, longitude, cityName = "Current Location") {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code,uv_index,visibility");
    url.searchParams.set("hourly", "temperature_2m,relative_humidity_2m,weather_code");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Weather request failed.");

    const data = await response.json();

    state.city = cityName;
    state.latitude = latitude;
    state.longitude = longitude;
    state.current = data.current;
    state.hourly = data.hourly;
    state.daily = data.daily;

    const info = getWeatherInfo(data.current.weather_code);
    state.conditionLabel = info.label;

    renderCurrentWeather(data, cityName);
    renderHourlyForecast(data);
    renderDailyForecast(data);
    renderCharts(data);
    await renderExtras(data, cityName);

    if (window.AtmosTheme) {
      const night = isNightNow(data.daily?.sunrise?.[0], data.daily?.sunset?.[0]);
      window.AtmosTheme.applyWeatherTheme(info.theme, night);
    }

    window.AtmosFavorites.renderFavorites(cityName);
    window.AtmosFavorites.syncFavoriteButton(cityName);
  } catch (error) {
    showError(error.message || "Unable to load weather.");
  }
}

function renderCurrentWeather(data, cityName) {
  const info = getWeatherInfo(data.current.weather_code);

  document.getElementById("cityName").textContent = cityName;
  document.getElementById("dateText").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  document.getElementById("temp").textContent = formatTemp(data.current.temperature_2m);
  document.getElementById("feelsLike").textContent = formatTemp(data.current.apparent_temperature);
  document.getElementById("condition").textContent = `${info.icon} ${info.label}`;
  document.getElementById("humidity").textContent = `${Math.round(data.current.relative_humidity_2m)}%`;
  document.getElementById("wind").textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
  document.getElementById("pressure").textContent = `${Math.round(data.current.pressure_msl)} hPa`;
  document.getElementById("uv").textContent = `${Math.round(data.current.uv_index ?? 0)}`;
  document.getElementById("visibility").textContent = formatVisibility(data.current.visibility);

  if (data.daily?.temperature_2m_max?.length) {
    document.getElementById("highLow").textContent = `H:${formatTemp(data.daily.temperature_2m_max[0])} L:${formatTemp(data.daily.temperature_2m_min[0])}`;
  }

  if (data.daily?.sunrise?.length) {
    document.getElementById("sunrise").textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (data.daily?.sunset?.length) {
    document.getElementById("sunset").textContent = new Date(data.daily.sunset[0]).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (window.AtmosAI) {
    window.AtmosAI.renderAIInsight({
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      aqi: state.aqi,
      weatherCode: data.current.weather_code
    });
  }

  if (window.AtmosAlerts) {
    window.AtmosAlerts.createWeatherAlert({
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      aqi: state.aqi
    });
  }
}

function renderHourlyForecast(data) {
  const container = document.getElementById("hourlyForecast");
  if (!container) return;

  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const humidities = data.hourly.relative_humidity_2m || [];
  const codes = data.hourly.weather_code || [];

  let startIndex = times.findIndex(t => new Date(t) >= new Date());
  if (startIndex < 0) startIndex = 0;

  const endIndex = Math.min(startIndex + 24, times.length);

  container.innerHTML = "";

  for (let i = startIndex; i < endIndex; i++) {
    const info = getWeatherInfo(codes[i]);
    const card = document.createElement("div");
    card.className = "hour-card";
    card.innerHTML = `
      <div class="time">${getShortTime(times[i])}</div>
      <div class="icon">${info.icon}</div>
      <div class="temp">${formatTemp(temps[i])}</div>
      <div class="mini">${Math.round(humidities[i] ?? 0)}%</div>
    `;
    container.appendChild(card);
  }
}

function renderDailyForecast(data) {
  const container = document.getElementById("dailyForecast");
  if (!container) return;

  const days = data.daily.time;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const codes = data.daily.weather_code || [];

  container.innerHTML = "";

  days.forEach((day, index) => {
    const info = getWeatherInfo(codes[index]);
    const row = document.createElement("div");
    row.className = "day-row";
    row.innerHTML = `
      <div class="day">${getDayName(day)}</div>
      <div class="label">${info.icon} ${info.label}</div>
      <div class="range">${formatTemp(maxTemps[index])} / ${formatTemp(minTemps[index])}</div>
    `;
    container.appendChild(row);
  });
}

function renderCharts(data) {
  const labels = [];
  const temps = [];
  const humidity = [];

  const times = data.hourly.time;
  const startIndex = Math.max(0, times.findIndex(t => new Date(t) >= new Date()));
  const endIndex = Math.min(startIndex + 24, times.length);

  for (let i = startIndex; i < endIndex; i++) {
    labels.push(getShortTime(times[i]));
    temps.push(data.hourly.temperature_2m[i]);
    humidity.push(data.hourly.relative_humidity_2m?.[i] ?? null);
  }

  if (window.AtmosCharts) {
    window.AtmosCharts.drawWeatherChart(labels, temps, humidity);
  }
}

async function renderExtras(data, cityName) {
  if (window.AtmosAQI) {
    state.aqi = await window.AtmosAQI.renderAQI(state.latitude, state.longitude);
  }

  if (window.AtmosAlerts) {
    window.AtmosAlerts.createWeatherAlert({
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      aqi: state.aqi
    });
  }

  if (window.AtmosAI) {
    window.AtmosAI.renderAIInsight({
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      aqi: state.aqi,
      weatherCode: data.current.weather_code
    });
  }

  if (window.AtmosMap) {
    window.AtmosMap.initMap(state.latitude, state.longitude, cityName);
  }

  if (window.AtmosGlobe) {
    window.AtmosGlobe.initGlobe();
  }

  if (window.AtmosComparison) {
    const compareCities = [
      cityName,
      "Mumbai",
      "Bengaluru",
      "Jaipur"
    ];
    await window.AtmosComparison.renderComparison(compareCities);
  }
}

function initApp() {
  window.AtmosTheme.initTheme();
  bindControls();
  registerServiceWorker();
  searchBtn.disabled = false;
  loadCurrentLocation();
}

document.addEventListener("DOMContentLoaded", initApp);