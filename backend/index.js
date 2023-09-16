const path = require("path");
const express = require("express");
const fs = require("fs");

const app = express();

let recentDataStream;

const minutes = 1;
const interval = minutes * 60 * 1000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

fetchRecentStream();

setInterval(fetchRecentStream, interval);

async function fetchRecentStream() {
    const slowmoUserId = "5ef1242a9f4442112974c692";

    console.log(new Date());

    recentDataStream = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "..", `RecentUserData${slowmoUserId}.json`),
            "utf-8",
            (err, data) => {
                if (err) {
                    throw err;
                }
                return data;
            }
        )
    );

    let ids = [];

    recentDataStream.map((data) => {
        ids.push(data._id);
    });

    const recentStream = await fetch(
        `https://ch.tetr.io/api/streams/any_userrecent_${slowmoUserId}`
    ).then((response) => {
        return response.json();
    });

    recentStream.data.records.map((data) => {
        if (data.endcontext.gametype == "40l") {
            if (!ids.includes(data._id)) {
                recentDataStream.push(data);
            }
        }
    });

    fs.writeFileSync(
        path.join(__dirname, "..", `RecentUserData${slowmoUserId}.json`),
        JSON.stringify(recentDataStream, null, 4),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
}

app.get("/username/:dynamic", async (req, res) => {
    const { dynamic } = req.params;

    const user = await fetch(`https://ch.tetr.io/api/users/${dynamic}`).then(
        (response) => {
            return response.json();
        }
    );

    if (!user.success) {
        return res.status(400).send({ status: "user not found" });
    }

    const news = await fetch(
        `https://ch.tetr.io/api/news/user_${user.data.user._id}?limit=100`
    ).then((response) => {
        return response.json();
    });

    let user40Ldata = [];
    news.data.news.map((e) => {
        if (e.data.gametype == "40l") {
            user40Ldata.push(e);
        }
    });
    res.status(200).json(user40Ldata);
});

app.get("/runs", (req, res) => {
    res.status(200).json(recentDataStream);
});

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`);
});
