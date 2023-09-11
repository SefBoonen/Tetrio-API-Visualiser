const button = document.getElementById("button");
const input = document.getElementById("input");

const baseUrl = "http://127.0.0.1:3000/";

button.addEventListener("click", sendToBack)

async function sendToBack(e) {
    // e.preventDefault();
    // const res = await fetch(`${baseUrl}username`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         parcel: input.value
    //     })
    // })

    const rec = await fetch(`${baseUrl}info`, {method: "GET"});
    console.log(rec);

    const data = rec.json().then(e => {
        return e;
    });

    console.log(data)
}