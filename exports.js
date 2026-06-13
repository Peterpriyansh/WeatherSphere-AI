function exportWeatherReport() {
  const state = window.weatherAppState;
  if (!state || !state.current) {
    alert("Load weather data first.");
    return;
  }

  const city = state.city || "Atmos";
  const lines = [
    "Atmos Weather Report",
    `City: ${city}`,
    `Temperature: ${Math.round(state.current.temperature_2m)}°C`,
    `Feels Like: ${Math.round(state.current.apparent_temperature)}°C`,
    `Humidity: ${Math.round(state.current.relative_humidity_2m)}%`,
    `Wind: ${Math.round(state.current.wind_speed_10m)} km/h`,
    `Pressure: ${Math.round(state.current.pressure_msl)} hPa`,
    `Visibility: ${formatVisibility(state.current.visibility)}`,
    `UV Index: ${Math.round(state.current.uv_index ?? 0)}`,
    `AQI: ${state.aqi ?? "--"}`,
    `Condition: ${state.conditionLabel || "Weather data"}`
  ];

  const content = lines.join("\n");

  const jsPDF = window.jspdf && window.jspdf.jsPDF;
  if (jsPDF) {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Atmos Weather Report", 14, 18);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const wrapped = pdf.splitTextToSize(content, 180);
    pdf.text(wrapped, 14, 32);

    pdf.save(`Atmos-Weather-${sanitizeFileName(city)}.pdf`);
    return;
  }

  downloadText(`Atmos-Weather-${sanitizeFileName(city)}.txt`, content, "text/plain");
}

function downloadText(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sanitizeFileName(name) {
  return String(name).replace(/[^\w.-]+/g, "_");
}

window.AtmosExport = {
  exportWeatherReport
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("exportBtn");
  if (btn) {
    btn.addEventListener("click", exportWeatherReport);
  }
});