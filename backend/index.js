// const fs = require("fs");
const path = require("path");
// const http = require('http');
const express = require('express');

const app = express();
app.use(express.json())

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.post("/", (req, res) => {
    const { parcel } = req.body;
    console.log(parcel)
    if(!parcel) {
        return res.status(400).send({ status: "failed" })
    }
    res.status(200).send({ status: "received" })
});

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});


// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//     if(req.url === "/") {
//         fs.readFile(path.join(__dirname, "../frontend", "index.html"), (err, content) => {
//             res.writeHead(200, { "Content-Type": "text/html" });
//             res.end(content);
//         })
//     }
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

