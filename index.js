async function main() {
    const response = await fetch("https://ch.tetr.io/api/users/slowmodead");
    console.log(await response.json());
}

main();