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

  let outfit = "";
  let activity = "";
  let risk = "";

  if (temperature >= 35) {
    outfit = "👕 Light cotton clothes, sunglasses and hydration recommended.";
  } else if (temperature >= 25) {
    outfit = "🩳 Casual comfortable clothing recommended.";
  } else if (temperature >= 15) {
    outfit = "🧥 Light jacket recommended.";
  } else {
    outfit = "🧣 Warm jacket and layered clothing recommended.";
  }

  if (weatherCode >= 51) {
    activity = "☔ Rain expected. Carry an umbrella.";
  } else {
    activity = "🌤 Great weather for outdoor activities.";
  }

  if (windSpeed > 35) {
    risk += " 💨 Strong winds expected.";
  }

  if (humidity > 85) {
    risk += " 💧 High humidity may feel uncomfortable.";
  }

  if (aqi && aqi > 150) {
    risk += " 😷 Poor air quality detected.";
  }

  el.innerHTML = `
      <div class="ai-box">
        <h3>🤖 AI Weather Assistant</h3>

        <p><strong>Outfit:</strong> ${outfit}</p>

        <p><strong>Suggestion:</strong> ${activity}</p>

        <p><strong>Alerts:</strong> ${risk || "No major risks detected."}</p>
      </div>
  `;

  return el.innerText;
}

window.AtmosAI = {
  renderAIInsight
};