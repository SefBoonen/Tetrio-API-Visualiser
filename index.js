async function main() {
    await fetch("https://api.giphy.com/v1/gifs/translate?api_key=WgYyQ9MGC9cnJ0uaM45WGdKN8arhwr00&s=cats", {
        mode: "cors"
    })
    .then(function(response) {
        console.log(response.json());
    })
    .catch(function(err) {
        console.log(err)
    });
}

main();