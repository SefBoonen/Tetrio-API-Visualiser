import Chart from "chart.js/auto"

const button = document.getElementById("button");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: 'time in ms',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 2
    }]
  },
  options: {
    scales: {
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

  let dates = [];
  let times = [];

  data.map(i => {
    dates.push(i.ts);
  })

  data.map(i => {
    times.push(i.data.result);
  })

  chart.data.labels = dates;
  chart.data.datasets[0].data = times;
  chart.update();
}