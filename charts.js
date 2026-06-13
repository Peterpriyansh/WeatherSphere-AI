let weatherChartInstance = null;
let comparisonChartInstance = null;

function drawWeatherChart(labels, temps, humidity = []) {
  const canvas = document.getElementById("weatherChart");
  if (!canvas || !window.Chart) return;

  if (weatherChartInstance) {
    weatherChartInstance.destroy();
  }

  weatherChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperature",
          data: temps,
          borderWidth: 3,
          tension: 0.42,
          fill: true
        },
        ...(humidity.length ? [{
          label: "Humidity",
          data: humidity,
          borderWidth: 2,
          tension: 0.42,
          fill: false
        }] : [])
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue("--text").trim()
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted").trim()
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted").trim()
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        }
      }
    }
  });
}

function drawComparisonChart(labels, temps) {
  const canvas = document.getElementById("comparisonChart");
  if (!canvas || !window.Chart) return;

  if (comparisonChartInstance) {
    comparisonChartInstance.destroy();
  }

  comparisonChartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Temperature °C",
        data: temps,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue("--text").trim()
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted").trim()
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted").trim()
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        }
      }
    }
  });
}

window.AtmosCharts = {
  drawWeatherChart,
  drawComparisonChart
};