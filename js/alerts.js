function createWeatherAlert(payload) {
  const el = document.getElementById("weatherAlert");
  if (!el) return "";

  const {
    temperature = 0,
    windSpeed = 0,
    humidity = 0,
    weatherCode = 0,
    aqi = null
  } = payload || {};

  const codesRain = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]);
  const codesSnow = new Set([71, 73, 75, 77, 85, 86]);

  const messages = [];
  let severity = "ok";

  if (temperature >= 42) {
    messages.push("Heatwave alert: avoid direct sunlight and stay hydrated.");
    severity = "danger";
  } else if (temperature >= 38) {
    messages.push("Very hot conditions today. Keep water with you.");
    severity = "warning";
  }

  if (windSpeed >= 45) {
    messages.push("Strong wind warning: be careful outdoors.");
    severity = "danger";
  }

  if (codesRain.has(weatherCode)) {
    messages.push("Rain likely. Carry an umbrella.");
    severity = severity === "danger" ? "danger" : "warning";
  }

  if (codesSnow.has(weatherCode)) {
    messages.push("Snowy conditions. Dress warmly.");
    severity = "warning";
  }

  if (aqi !== null && aqi >= 151) {
    messages.push("Air quality is poor. Sensitive groups should limit outdoor time.");
    severity = "danger";
  }

  if (!messages.length) {
    messages.push("No active alerts. Conditions look stable.");
  }

  el.textContent = messages.join(" ");
  el.className = `alert-text ${severity}`;
  return el.textContent;
}

window.AtmosAlerts = {
  createWeatherAlert
};