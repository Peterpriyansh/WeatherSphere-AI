async function fetchCitySnapshot(city){

  const geo =
  await fetch(
  `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );

  const geoData = await geo.json();

  if(!geoData.results?.length)
  return null;

  const place =
  geoData.results[0];

  const weather =
  await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code`
  );

  const weatherData =
  await weather.json();

  return {
    city: place.name,
    temp: weatherData.current.temperature_2m
  };
}

async function renderComparison(cities){

  const summary =
  document.getElementById(
  "comparisonSummary"
  );

  summary.innerHTML =
  "Loading comparison...";

  const results = [];

  for(const city of cities){

    const data =
    await fetchCitySnapshot(city);

    if(data)
      results.push(data);
  }

  summary.innerHTML="";

  results.forEach(item=>{

    summary.innerHTML += `
      <div class="comparison-item">
        <h4>${item.city}</h4>
        <p>${item.temp}°C</p>
      </div>
    `;
  });

  if(window.AtmosCharts){

    window.AtmosCharts
    .drawComparisonChart(
      results.map(x=>x.city),
      results.map(x=>x.temp)
    );

  }
}

window.AtmosComparison = {
  renderComparison
};