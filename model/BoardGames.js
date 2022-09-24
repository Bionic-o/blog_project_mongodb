const mongoose = require('mongoose')

const Schema = mongoose.Schema

const boardGameSchema = new Schema({
    title: String,
    author: String,
    img_url: String,
    rich_text: {type: String, max:5000},
    publisher: String,
    slug: String
})

module.exports = mongoose.model('BoardGame', boardGameSchema)