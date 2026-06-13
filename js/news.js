function loadWeatherNews(){

const news =
document.getElementById("weatherNews");

if(!news) return;

news.innerHTML = `

<div class="news-card">
🌍 Climate patterns continue shifting globally.
</div>

<div class="news-card">
☀️ Heatwave alerts active in multiple regions.
</div>

<div class="news-card">
🌧️ Heavy rainfall expected in several cities.
</div>

<div class="news-card">
❄️ Seasonal weather changes affecting travel.
</div>

`;

}

window.addEventListener(
"DOMContentLoaded",
loadWeatherNews
);
