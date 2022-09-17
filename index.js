const dotenv = require('dotenv')
dotenv.config()

const express = require('express')

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')

const port = process.env.PORT || 5050


function sendErrorOutput(err, res) {
    res.status(400).send({
        error: err.message
    })
}

app.get('api/boardgames', (req, res) => {
    getBoardGames()
    .then((boardGames) => {res.json(boardGames)})
    .catch(err => sendErrorOutput(err, res))
})


app.listen(port, () => console.log('conncted to mongoDB'))