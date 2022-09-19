const dotenv = require('dotenv')
dotenv.config()

const {
    getBoardGames,
    postBoardGame,
    deleteBoardGame,
    putBoardGame,
    getSingleGame
} = require('./controllers/mongoDB_operations')

const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.use(cors())

const port = process.env.PORT || 5050

function sendErrorOutput(err, res) {
    res.status(400).send({
        error: err.message
    })
}



app.get('/api/boardgames', (req, res) => {
    getBoardGames()
    .then((boardGames) => {res.json(boardGames)})
    .catch(err => sendErrorOutput(err, res))
})



app.get('/api/boardgames/:id', (req, res) => {
    const{id}=req.params
    getSingleGame(id)
    .then((data) => {res.json(data)})
    .catch(err => sendErrorOutput(err, res))
})



app.post('/api/boardgames', (req, res) => {
    postBoardGame(req.body)
    .then((data) => {res.send(data)})
    .catch(err => sendErrorOutput(err, res))
})



app.delete('/api/boardgames/:id', (req, res) => {
    const { id } = req.params
    deleteBoardGame(id)
    .then(() => {res.send({status: 'deleted'})})
    .catch(err => sendErrorOutput(err, res))
})



app.put('/api/boardgames/:id', (req, res)=>{
    const{id } =req.params
    const {title, author, imgUrl,richText,publisher} = req.body
    console.log(id,title, author, imgUrl,richText,publisher)
     putBoardGame(id,title, author, imgUrl,richText,publisher)
     .then((data) => {res.send(data)})
    .catch(err => sendErrorOutput(err, res))

})


app.listen(port, () => console.log('conncted to mongoDB'))

