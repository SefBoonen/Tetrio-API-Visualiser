import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const button = document.getElementById("button");
const input = document.getElementById("input");
const ctx = document.getElementById("chart");
const ctxRuns = document.getElementById("chartRuns");

const colors = ["red", "green", "blue"];
let lines = 0;

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

const baseUrl = "http://127.0.0.1:3000/";

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
                        drag: {
                            enabled: true,
                        },
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

    const data = await fetch(`${baseUrl}username/slowmodead`, {
        method: "GET",
    }).then((response) => response.json());

    const dataset = {
        data: [],
        label: `slowmodead`,
        borderWidth: 2,
        stepped: "after",
        borderColor: "blue",
        pointRadius: 4,
    };

    data.map((i) => {
        dataset.data.push({
            x: i.ts,
            y: i.data.result / 1000,
        });
    });

    chartRuns.data.datasets.push(dataset);
    chartRuns.update();

    const runs = await fetch(`${baseUrl}runs`, {
        method: "GET",
    });

    const datasetRuns = {
        type: "scatter",
        data: [],
        label: "Runs",
        borderColor: "black",
        pointRadius: 1,
    };

    dataRuns.map((data) => {
        datasetRuns.data.push({
            x: data.ts,
            y: data.endcontext.finalTime / 1000,
        });
    });

    chartRuns.data.datasets.push(datasetRuns);
    chartRuns.update();
}

async function sendToBack() {
    const res = await fetch(`${baseUrl}username/${input.value}`, {
        method: "GET",
    });

    if (res.status != 200) {
        alert("user not found");
        return;
    }

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

    data.map((i) => {
        dataset.data.push({
            x: i.ts,
            y: i.data.result / 1000,
        });
    });

    chart.data.datasets.push(dataset);
    chart.update();
}
