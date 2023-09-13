const fs = require("fs");
const path = require("path");
const express = require('express');

const app = express();
let user40Ldata = [];

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
    
    user40Ldata = []; 
    data.map(e => {
        if(e.data.gametype == "40l") {
            user40Ldata.push(e);
        }
    })
});

app.get("/info", (req, res) => {
    res.status(200).json(user40Ldata);
})

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:3000`)
});
