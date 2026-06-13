function renderAIInsight(payload) {
  const el = document.getElementById("aiInsight");
  if (!el) return "";

  const {
    temperature = 0,
    humidity = 0,
    windSpeed = 0,
    aqi = null,
    weatherCode = 0
  } = payload || {};

  const lines = [];

  if (temperature >= 42) {
    lines.push("Extreme heat detected. Stay indoors during peak hours.");
  } else if (temperature >= 32) {
    lines.push("Warm weather. Light clothing and water are a good idea.");
  } else if (temperature >= 20) {
    lines.push("Pleasant conditions. Great for outdoor plans.");
  } else {
    lines.push("Cool weather. A jacket will help later in the day.");
  }

  if (humidity >= 80) {
    lines.push("High humidity may make it feel warmer than the reading.");
  }

  if (windSpeed >= 30) {
    lines.push("Wind is strong enough to feel noticeable outdoors.");
  }

  if (aqi !== null && aqi >= 151) {
    lines.push("Air quality is low, so reduce prolonged outdoor exposure.");
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    lines.push("Rain activity is possible. Keep an umbrella ready.");
  }

  const text = lines.join(" ");
  el.textContent = text;
  return text;
}

window.AtmosAI = {
  renderAIInsight
};