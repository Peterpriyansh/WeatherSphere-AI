document
.getElementById("exportBtn")
?.addEventListener("click",()=>{

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(22);

doc.text(
"WeatherSphere AI Report",
20,
20
);

doc.setFontSize(12);

doc.text(
`City: ${
document.getElementById("cityName").textContent
}`,
20,
40
);

doc.text(
`Temperature: ${
document.getElementById("temp").textContent
}`,
20,
50
);

doc.text(
`Condition: ${
document.getElementById("condition").textContent
}`,
20,
60
);

doc.text(
`Humidity: ${
document.getElementById("humidity").textContent
}`,
20,
70
);

doc.save("WeatherSphere_Report.pdf");

});
