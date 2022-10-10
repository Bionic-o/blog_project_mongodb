const dotenv = require('dotenv')
const path = require('path')
const bcrypt = require('bcryptjs');
const verifyJWT =require('./middleware/verifyJWT.js')

const ROLES_LIST = require('./config/roles_list.js')
const verifyRoles = require('./middleware/verifyRoles');
const {
    getBoardGames,
    postBoardGame,
    deleteBoardGame,
    putBoardGame,
    getSingleGame
} = require('./controllers/mongoDB_operations')

const {postUserLogin,
    postUserRegister,
    postChangePassword,
    handleRefreshToken,
    logoutControll
} = require('./controllers/userOperations')
const corsOptions = require('./config/corsOptions');
const credentials= require('./middleware/credentials')
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5050

dotenv.config()
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(credentials);
app.use(cors(corsOptions))


app.use(cookieParser());


// ERROR HELPER FUNCTION
function sendErrorOutput(err, res) {
    res.status(400).send({
        error: err.message
    })
    
}


//////////////////////,verifyJWT, verifyRoles(ROLES_LIST.Admin)



// GET  API
app.get('/api/boardgames',(req, res) => {
    
    getBoardGames()
    .then((boardGames) => {res.json(boardGames)})
    .catch(err => sendErrorOutput(err, res))
})


//GET SINGLE POST API
app.get('/api/boardgames/:id', (req, res) => {
    const{id}=req.params
    getSingleGame(id)
    .then((data) => {res.json(data)})
    .catch(err => sendErrorOutput(err, res))
})


// POST A NEW POST(CREATE) API
app.post('/api/boardgames', (req, res) => {
    postBoardGame(req.body)
    .then((data) => {res.send(data)})
    .catch(err => sendErrorOutput(err, res))
})


// DELETE A POST
app.delete('/api/boardgames/:id', (req, res) => {
    const { id } = req.params
    deleteBoardGame(id)
    .then(() => {res.send({status: 'deleted'})})
    .catch(err => sendErrorOutput(err, res))
})


// UPDATE A POST API
app.put('/api/boardgames/:id',  (req, res)=>{
    const{id } =req.params
    const {title, author, imgUrl,richText,publisher} = req.body
    
    console.log(id,title, author, imgUrl,richText,publisher)
     putBoardGame(id,title, author, imgUrl,richText,publisher)
     .then((data) => {res.send(data)})
    .catch(err => sendErrorOutput(err, res))

})


//LOGIN API
app.post('/api/login', (req, res)=>{
    const {username, password} = req.body
    console.log(username)
    postUserLogin(username,password,res)
})
// REGISTER API
app.post('/api/register',  (req, res)=>{
    console.log(req.body,'-  body')
    const {username, password: plainTextPassword} = req.body
   /*  const password = await bcrypt.hash(plainTextPassword, 10) */
     postUserRegister(username,plainTextPassword,res)
    /* res.json({status: 'ok'}) */
    .then((data) => {res.send(data)})
    .catch( function (err){
res.status(400).send({status:'error',error: err.message, details: JSON.stringify(err)})

    })
    
})

// CHANGE PASSWORD API
app.post('/api/change-password', (req, res)=>{
   const {token, newPassword} = req.body
   console.log(newPassword)
   postChangePassword(token,newPassword,res)
   .then(data =>{console.log(data)})
   .catch(err =>{res.status(400).send({status:'error',error: err.message, details: JSON.stringify(err)})})
})


// REFRESHTOKEN 
app.get('/api/refresh', (req, res)=>{
    const cookies= req.cookies
    handleRefreshToken(cookies,res)
})


//LOGOUT
app.get('/api/logout', (req, res)=>{
    const cookies= req.cookies
    logoutControll(cookies,res)
})


app.listen(port, () => console.log('conncted to mongoDB on port  ' +port  ))

