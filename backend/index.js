const fs = require("fs");
const path = require("path");
// const http = require('http');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.redirect("index.html");
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

