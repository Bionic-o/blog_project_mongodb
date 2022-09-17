const mongoose = require('mongoose')

const Schema = mongoose.Schema

const boardGameSchema = new Schema({
    title: String,
    author: String,
    img_url: String,
    rich_text: String,
    publisher: String
})

module.exports = mongoose.model('BoardGame', boardGameSchema)