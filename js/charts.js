let weatherChartInstance = null;
let comparisonChartInstance = null;

function drawWeatherChart(labels, temps, humidity = []) {

  const canvas = document.getElementById("weatherChart");

  if (!canvas) return;

  if (weatherChartInstance)
    weatherChartInstance.destroy();

  weatherChartInstance = new Chart(canvas, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "Temperature °C",
          data: temps,
          borderWidth: 4,
          tension: .45,
          fill: true
        },
        {
          label: "Humidity %",
          data: humidity,
          borderWidth: 3,
          tension: .45,
          fill: false
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "top"
        }
      }
    }
  });
}

function drawComparisonChart(labels, temps) {

  const canvas =
    document.getElementById("comparisonChart");

  if (!canvas) return;

  if (comparisonChartInstance)
    comparisonChartInstance.destroy();

  comparisonChartInstance = new Chart(canvas, {
    type: "bar",

    data: {
      labels,

      datasets: [{
        label: "Current Temperature",
        data: temps,
        borderWidth: 0
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

window.AtmosCharts = {
  drawWeatherChart,
  drawComparisonChart
};