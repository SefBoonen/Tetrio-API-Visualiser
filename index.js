const tetrio = require('tetrio-node')

const tetrioApi = new tetrio.Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWYxMjQyYTlmNDQ0MjExMjk3NGM2OTIiLCJpYXQiOjE2OTMzODY0MDV9.9WCqShE0plcNE0eebcQImpkC_yvMxrdaVB0nBMVeypY", {
    notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
});

tetrioApi.getUser({ user: 'theya' }).then((user) => {
    console.log(user.username)
})