let weatherMap = null;

function initMap(latitude, longitude, label = "Location") {
  const mapEl = document.getElementById("map");
  if (!mapEl || !window.L) return;

  if (weatherMap) {
    weatherMap.remove();
    weatherMap = null;
  }

  weatherMap = L.map("map", {
    scrollWheelZoom: false
  }).setView([latitude, longitude], 9);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(weatherMap);

  L.marker([latitude, longitude]).addTo(weatherMap).bindPopup(label);

  setTimeout(() => weatherMap.invalidateSize(), 150);
}

window.AtmosMap = {
  initMap
};