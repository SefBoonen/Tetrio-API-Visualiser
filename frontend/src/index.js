import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const button = document.getElementById("button");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");

const colors = ["red", "green", "blue"];
let lines = 0;

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    scales: {
      x: {
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
  const user = await fetch(`${baseUrl}username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parcel: input.value
    })
  })

  if (user.status != 200) {
    alert("user not found");
    return;
  }

  const res = await fetch(`${baseUrl}info`, {
    method: "GET"
  });

  const data = await res.json();

  const dataset = {
    data: [],
    label: `${input.value}`,
    borderWidth: 2,
    stepped: "after",
    borderColor: colors[lines % 3],
    pointRadius: 4,
  };

  lines++;

  data.map(i => {
    dataset.data.push({
      x: i.ts,
      y: i.data.result / 1000,
    });
  })

  chart.data.datasets.push(dataset)
  chart.update();
}