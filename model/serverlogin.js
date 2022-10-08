const mongoose = require('mongoose')

const Schema = mongoose.Schema

const loginSchema = new Schema({
   username : {
    type: String,
    require :true,
    unique: true
   },
   roles: {
      User: {
          type: Number,
          default: 2001
      },
      
      Admin: Number
  },
   password: {
    type: String,
    require :true
   },
   refreshToken: {type: String}
}
,
   {collection:'users'}
   )

module.exports = mongoose.model('Userlogin', loginSchema)