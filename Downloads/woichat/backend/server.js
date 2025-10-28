//todo : Proses require CommonJs
const chalk = require('chalk')
const fs = require('fs')

const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<center><h1>404 Not Found</h1></center>')
})

app.listen(port, () => {
    console.log(`now listening on ${chalk.white.bgGreenBright.bold('https//:localhost:3000')} on ${port}`)
})