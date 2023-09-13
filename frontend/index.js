import Chart from "chart.js/auto"

const button = document.getElementById("button");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");

const baseUrl = "http://127.0.0.1:3000/";

button.addEventListener("click", sendToBack)

async function sendToBack(e) {
    e.preventDefault();
    const res = await fetch(`${baseUrl}username`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            parcel: input.value
        })
    })

    const rec = await fetch(`${baseUrl}info`, {
        method: "GET"
    });

    const data = await rec.json();

    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
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
}