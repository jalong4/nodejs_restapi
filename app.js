// load the app server using express

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
const router = require('./routes/user.js')
app.use(router)

app.use(morgan('short'))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is up and listening on ${port}...`)
})

router.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("root");
})
