const http = require("http");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1";
const port = 3000;

const data = fetch("https://ch.tetr.io/api/users/slowmodead")

console.log(data)

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("data");
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

fs.appendFile(path.join(__dirname, "test.txt"), "node test", err => {
    if (err) throw err;
})