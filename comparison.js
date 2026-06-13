function comparisonWeatherInfo(code) {
  const map = {
    0: { label: "Clear", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Fog", icon: "🌫️" },
    48: { label: "Fog", icon: "🌫️" },
    51: { label: "Drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Drizzle", icon: "🌧️" },
    61: { label: "Rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy Rain", icon: "🌧️" },
    71: { label: "Snow", icon: "❄️" },
    73: { label: "Snow", icon: "❄️" },
    75: { label: "Heavy Snow", icon: "❄️" },
    80: { label: "Showers", icon: "🌦️" },
    81: { label: "Showers", icon: "🌦️" },
    82: { label: "Heavy Showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm", icon: "⛈️" },
    99: { label: "Thunderstorm", icon: "⛈️" }
  };

  return map[code] || { label: "Weather", icon: "🌡️" };
}

async function fetchCitySnapshot(city) {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", city);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "en");

  const geoResponse = await fetch(geoUrl.toString());
  const geoData = await geoResponse.json();

  if (!geoData.results || !geoData.results.length) {
    throw new Error(`No geocoding result for ${city}`);
  }

  const place = geoData.results[0];

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", place.latitude);
  weatherUrl.searchParams.set("longitude", place.longitude);
  weatherUrl.searchParams.set("current", "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m");
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherResponse = await fetch(weatherUrl.toString());
  const weatherData = await weatherResponse.json();

  return {
    city: place.name,
    temperature: Math.round(weatherData.current?.temperature_2m ?? 0),
    humidity: Math.round(weatherData.current?.relative_humidity_2m ?? 0),
    wind: Math.round(weatherData.current?.wind_speed_10m ?? 0),
    code: weatherData.current?.weather_code ?? 0,
    label: comparisonWeatherInfo(weatherData.current?.weather_code ?? 0).label,
    icon: comparisonWeatherInfo(weatherData.current?.weather_code ?? 0).icon
  };
}

async function renderComparison(cities) {
  const summary = document.getElementById("comparisonSummary");
  if (!summary) return [];

  const uniqueCities = [...new Set((cities || []).map(c => String(c || "").trim()).filter(Boolean))].slice(0, 4);
  if (!uniqueCities.length) return [];

  summary.innerHTML = `<span class="empty-state">Loading comparison...</span>`;

  const results = [];
  for (const city of uniqueCities) {
    try {
      const snap = await fetchCitySnapshot(city);
      results.push(snap);
    } catch {
      // skip failures
    }
  }

  if (!results.length) {
    summary.innerHTML = `<span class="empty-state">Comparison unavailable.</span>`;
    return [];
  }

  const labels = results.map(item => item.city);
  const temps = results.map(item => item.temperature);

  if (window.AtmosCharts) {
    window.AtmosCharts.drawComparisonChart(labels, temps);
  }

  summary.innerHTML = "";
  results.forEach(item => {
    const card = document.createElement("div");
    card.className = "comparison-item";
    card.innerHTML = `
      <h4>${item.icon} ${item.city}</h4>
      <p>${item.temperature}°C · ${item.label}<br/>Humidity ${item.humidity}% · Wind ${item.wind} km/h</p>
    `;
    summary.appendChild(card);
  });

  return results;
}

window.AtmosComparison = {
  renderComparison
};