// will contain all user related routes

const express = require('express')
const app = express()
const mysql = require('mysql')
const router = express.Router()

app.use(router)

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'jalong4',
    password: 'admin',
    database: 'lbta_mysql'
})

function getConnection() {
    return pool
}

router.get('/messages', (req, res) => {
    console.log("Getting messages")
    res.end()
})

router.get("/users", (req, res) => {
    getConnection().query("SELECT * FROM users", (err, rows, fields) => {
        console.log("Fetched users successfully")
        res.json(rows)
    })
})

router.post('/user_create', (req, res) => {

    const firstName = req.body.first_name
    const lastName = req.body.last_name
    console.log(`Creating user: ${firstName} ${lastName}`)

    const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if (err) {
            console.log(`Failed to create user ${firstName} ${lastName}`)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log(`Created user ${firstName} ${lastName} successfully with ID ${results.insertId}`)
        res.end()
    })

})

router.get("/user/:id", (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    const userId = req.params.id;
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {

        if (err) {
            console.log(`Failed to get user with ID ${userId}`)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Fetched users successfully")
        const users = rows.map((row) => {
            console.log(`Fetching user: ${row.first_name} ${row.last_name}`)
            return {firstName: row.first_name, lastName: row.last_name}
        })
        res.json(users[0])
    })
})

module.exports = router