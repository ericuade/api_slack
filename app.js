let express = require('express')
let app = express()
let port = 3002

app.get('/', (req, res) => {
    res.send("Hello Flock")
})

app.listen(port, () => {
    console.log(`Slack integration listening on port ${port}`)
})

