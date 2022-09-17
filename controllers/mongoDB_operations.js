/* const mongoose = require('mongoose')
const BoardGame = require('../model/BoardGames')

const mongodbConnection = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`

mongoose.connect(mongodbConnection)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection failed'))
 */

const { MongoClient, ServerApiVersion } = require('mongodb');

async function main(){
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);
    try {
    await client.connect();
    } catch(e){
        console.log(e)
    } finally{
        await client.close()
    }
}

main().catch(console.err)