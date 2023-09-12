const fs = require("fs");
const path = require("path");
const express = require('express');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.post("/username", async (req, res) => {
    const { parcel } = req.body;

    if (!parcel) {
        return res.status(400).send({ status: "failed" })
    }

    res.status(200).send({ status: "received" })

    //get all 40L
    const user = await fetch(`https://ch.tetr.io/api/users/${parcel}`).then(response => {
        return response.json();
    })

    const userid = user.data.user._id;

    const news = await fetch(`https://ch.tetr.io/api/news/user_${userid}?limit=100`).then(response => {
        return response.json();
    })

    const data = news.data.news;
    
    let filtered = []; 
    data.map(e => {
        if(e.data.gametype == "40l") {
            filtered.push(e);
        }
    })

    fs.writeFile(path.join(__dirname, "tetrio.json"), JSON.stringify(filtered, null, 4), err => {
        if (err) throw err;
    })
});

app.get("/info", (req, res) => {
    let data = fs.readFileSync("./tetrio.json", "utf8", (err, jsonString) => {
        if(err) {
            console.log(err);
            return;
        }
    })

    data = JSON.parse(data)
    res.status(200).json(data);
})

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});
