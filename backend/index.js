const fs = require("fs");
const path = require("path");
// const http = require('http');
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
    // console.log(`https://ch.tetr.io/api/news/user_${userid}?limit=100`)

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

    // console.log(filtered);

    fs.appendFile(path.join(__dirname, "tetrio.json"), JSON.stringify(filtered, null, 4), err => {
        if (err) throw err;
    })

    //get recent stream
    const recent = await fetch(`https://ch.tetr.io/api/streams/any_userrecent_${userid}`).then(response => {
        return response.json();
    })
    // console.log(recent.data.records)

    let recentData40L = [];

    recent.data.records.map(x => {
        if(x.endcontext.gametype == "40l") {
            recentData40L.push(x)
        }
    })

    // console.log(recentData40L);
    fs.appendFile(path.join(__dirname, `tetrio40LRecent${parcel}.json`), JSON.stringify(recentData40L, null, 4), err => {
        if (err) throw err;
    })
});

app.get("/info", async function(req, res) {
    let json = "test";
    let testvar = fs.readFileSync("./tetrio.json", "utf8", (err, data) => {
        if(err) {
            console.log(err);
            return;
        }
        json = JSON.parse(data);
        // console.log(json)
    })
    // console.log("get")
    console.log(testvar)
    // res.status(200).json({info: "preset text"});
})

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});
