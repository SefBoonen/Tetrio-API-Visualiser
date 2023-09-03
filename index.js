// const http = require("http");
const fs = require("fs");
const path = require("path");

// const hostname = "127.0.0.1";
// const port = 3000;

const data = fetch("https://ch.tetr.io/api/users/slowmodead").then(response => {
    return response.json();
})

console.log(data.then(e => {
    fs.appendFile(path.join(__dirname, "tetrio.json"), JSON.stringify(e, null, 4), err => {
        if (err) throw err;
    })
}))

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("data");
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// })

