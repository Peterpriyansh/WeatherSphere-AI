async function renderAQI(latitude, longitude) {
  const el = document.getElementById("aqi");
  if (!el) return null;

  try {
    const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set("current", "us_aqi,pm2_5,pm10");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("AQI request failed");

    const data = await response.json();
    const aqi = Math.round(data.current?.us_aqi ?? data.hourly?.us_aqi?.[0] ?? 0);

    el.textContent = `${aqi} ${aqiLabel(aqi)}`;
    el.className = aqiClass(aqi);

    if (window.weatherAppState) {
      window.weatherAppState.aqi = aqi;
    }

    return aqi;
  } catch {
    el.textContent = "--";
    el.className = "";
    return null;
  }
}

function aqiLabel(value) {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy";
  if (value <= 200) return "Poor";
  return "Hazardous";
}

function aqiClass(value) {
  if (value <= 50) return "good";
  if (value <= 100) return "moderate";
  return "poor";
}

window.AtmosAQI = {
  renderAQI
};