const path = require("path");
const express = require('express');
const fs = require("fs");

const app = express();
let user40Ldata = [];

let recentDataStream;

const slowmoUserId = "5ef1242a9f4442112974c692";

let minutes = 1;
let interval = minutes * 60 * 1000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

setInterval(fetchRecentStream, interval);

async function fetchRecentStream() {
    console.log("5 min")
    recentDataStream = JSON.parse(fs.readFileSync(path.join(__dirname, "..", `RecentUserData${slowmoUserId}.json`), "utf-8", (err, data) => {
        if (err) {
            throw err;
        }
        return data;
    }));

    let ids = [];

    recentDataStream.map(data => {
        ids.push(data._id)
    })

    const recentStream = await fetch(`https://ch.tetr.io/api/streams/any_userrecent_${slowmoUserId}`).then(response => {
        return response.json();
    });

    const filteredData = [];

    recentStream.data.records.map(data => {
        if (data.endcontext.gametype == "40l") {
            filteredData.push(data);
        }
    });

    filteredData.map(data => {
        if (!ids.includes(data._id)) {
            recentDataStream.push(data);
        }
    });

    fs.writeFileSync(path.join(__dirname, "..", `RecentUserData${slowmoUserId}.json`), JSON.stringify(recentDataStream, null, 4), (err) => {
        if (err) {
            console.log(err);;
        }
    });
}

app.post("/username", async (req, res) => {
    const { parcel } = req.body;

    if (!parcel) {
        return res.status(400).send({ status: "failed" })
    }

    //get all 40L
    const user = await fetch(`https://ch.tetr.io/api/users/${parcel}`).then(response => {
        return response.json();
    })

    if (!user.success) {
        return res.status(400).send({ status: "user not found" });
    }

    const userid = user.data.user._id;

    const news = await fetch(`https://ch.tetr.io/api/news/user_${userid}?limit=100`).then(response => {
        return response.json();
    })

    const data = news.data.news;

    user40Ldata = [];
    data.map(e => {
        if (e.data.gametype == "40l") {
            user40Ldata.push(e);
        }
    })
    res.status(200).send({ status: "received" })
});

app.get("/info", (req, res) => {
    res.status(200).json(user40Ldata);
})

app.get("/runs", (req, res) => {
    res.status(200).json(recentDataStream);
})

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});
