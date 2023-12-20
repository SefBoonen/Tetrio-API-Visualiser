import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const button = document.getElementById("button");
const averageTime = document.getElementById("averageTime");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");
const ctxRuns = document.getElementById("chartRuns");
const allTimeAverage = document.getElementById("allTimeAverage");

const colors = ["red", "green", "blue"];
let lines = 0;

const baseUrl = "http://127.0.0.1:3000/";

const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [],
    },
    options: {
        scales: {
            x: {
                type: "time",
            },
            y: {
                beginAtZero: true,
            },
        },
    },
});

button.addEventListener("click", sendToBack);

drawRuns();

async function drawRuns() {
    const chartRuns = new Chart(ctxRuns, {
        type: "line",
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        mode: "x",
                    },
                    pan: {
                        mode: "x",
                        enabled: true,
                    },
                },
            },
            scales: {
                x: {
                    type: "time",
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    const data = await fetch(`${baseUrl}username/slowmodead`, { method: "GET" }).then((response) => response.json());

    const dataset = {
        data: [],
        label: `slowmodead`,
        borderWidth: 2,
        stepped: "after",
        borderColor: "blue",
        pointRadius: 4,
    };

    data.forEach((e) => {
        dataset.data.push({
            x: e.ts,
            y: e.data.result / 1000,
        });
    });

    chartRuns.data.datasets.push(dataset);
    chartRuns.update();

    const runs = await fetch(`${baseUrl}runs`, { method: "GET" }).then((response) => response.json());

    let sum = 0;
    let sumTotal = 0;

    for (let i = runs.length - 10; i < runs.length; i++) {
        sum += runs[i].endcontext.finalTime / 1000;
    }

    for (let i = 0; i < runs.length; i++) {
        sumTotal += runs[i].endcontext.finalTime / 1000;
    }

    averageTime.innerText = `The average over the last 10 runs: ${sum / 10}`;
    allTimeAverage.innerText = `The average over all runs: ${sumTotal / runs.length}`;

    const datasetRuns = {
        type: "scatter",
        data: [],
        label: "Runs",
        borderColor: "black",
        pointRadius: 1,
    };

    runs.forEach((e) => {
        datasetRuns.data.push({
            x: e.ts,
            y: e.endcontext.finalTime / 1000,
        });
    });

    chartRuns.data.datasets.push(datasetRuns);
    chartRuns.update();
}

async function sendToBack() {
    const data = await fetch(`${baseUrl}username/${input.value}`, { method: "GET" }).then((response) =>
        response.json()
    );

    if (data.status == 400) {
        alert("user not found");
        return;
    }

    const dataset = {
        data: [],
        label: `${input.value}`,
        borderWidth: 2,
        stepped: "after",
        borderColor: colors[lines % 3],
        pointRadius: 4,
    };

    lines++;

    data.forEach((e) => {
        dataset.data.push({
            x: e.ts,
            y: e.data.result / 1000,
        });
    });

    chart.data.datasets.push(dataset);
    chart.update();
}
