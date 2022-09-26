const mongoose = require('mongoose')
const BoardGame = require('../model/BoardGames')

const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}?retryWrites=true&w=majority`

mongoose.connect(mongodbConnection)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection failed'))

function _makeBoardGames(dbBoardGames) {
    return {
        id: dbBoardGames._id,
        title: dbBoardGames.title,
        author: dbBoardGames.author,
        imgUrl: dbBoardGames.img_url,
        richText: dbBoardGames.rich_text,
        publisher: dbBoardGames.publisher,
        slug: dbBoardGames.slug
    }
}

async function getBoardGames(slug) {
    const filter = {}
    if (slug) {
        filter.slug = slug
    }
    const dbBoardGames = await BoardGame.find(filter)
    return dbBoardGames.map((dbBoardGame) => _makeBoardGames(dbBoardGame))
}

async function getSingleGame(id) {
    const singleGame = await BoardGame.findById(id)
    return _makeBoardGames(singleGame)
}


async function postBoardGame(update) {
    const slug = update.title.replaceAll(" ", "_").toLowerCase()
    const postBoardGame = await BoardGame.create({
        title: update.title,
        author: update.author,
        img_url: update.imgUrl,
        rich_text: update.richText,
        publisher: update.publisher,
        slug: slug
    })
    return _makeBoardGames(postBoardGame)
}

async function deleteBoardGame(id) {
    const deleteGame = await BoardGame.deleteOne({_id:id})
    return deleteGame
}

async function putBoardGame(id, title, author, imgUrl, richText, publisher, slug) {
    const updateGame = await BoardGame.findByIdAndUpdate(
      { _id: id },
      {
        title: title,
        author: author,
        img_url: imgUrl,
        rich_text: richText,
        publisher: publisher,
        slug: slug
      }, {new : true}
    );
  
    return _makeBoardGames(updateGame);
  }



module.exports = {
    getBoardGames,
    postBoardGame,
    deleteBoardGame,
    putBoardGame,
    getSingleGame
}

