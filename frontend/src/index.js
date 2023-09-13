import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const button = document.getElementById("button");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    scales: {
      x: {
        min: "2018-01-01 00:00:00",
        type: "time"
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

const baseUrl = "http://127.0.0.1:3000/";

button.addEventListener("click", sendToBack)

async function sendToBack() {
  await fetch(`${baseUrl}username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parcel: input.value
    })
  })

  const res = await fetch(`${baseUrl}info`, {
    method: "GET"
  });

  const data = await res.json();

  const dataset = {
    label: `${input.value}`,
    labels: [],
    data: [],
    borderWidth: 2,
    stepped: true,
  };

  data.map(i => {
    dataset.labels.push(i.ts);
  })

  data.map(i => {
    dataset.data.push(i.data.result);
  })

  console.log(dataset);

  chart.data.datasets.push(dataset);
  chart.update();
}