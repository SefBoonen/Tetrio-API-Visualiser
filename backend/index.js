const fs = require("fs");
const path = require("path");
// const http = require('http');
const express = require('express');

const app = express();
app.use(express.json())

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.post("/", async (req, res) => {
    const { parcel } = req.body;
    // console.log(`https://ch.tetr.io/api/users/${parcel}`)

    if (!parcel) {
        return res.status(400).send({ status: "failed" })
    }

    res.status(200).send({ status: "received" })

    const user = await fetch(`https://ch.tetr.io/api/users/${parcel}`).then(response => {
        return response.json();
    })

    const userid = user.data.user._id;

    const news = await fetch(`https://ch.tetr.io/api/news/user_${userid}?limit=10`).then(response => {
        return response.json();
    })

    const data = news.data.news;
    
    let filtered = []; 
    data.map(e => {
        if(e.data.gametype == "40l") {
            filtered.push(e);
        }
    })

    fs.appendFile(path.join(__dirname, "tetrio.json"), JSON.stringify(data, null, 4), err => {
        if (err) throw err;
    })
});

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});
