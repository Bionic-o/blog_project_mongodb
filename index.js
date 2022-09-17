const dotenv = require('dotenv')
dotenv.config()

const express = require('express')

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')

const { MongoClient, ServerApiVersion } = require('mongodb');

async function main(){
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);
    try {
    await client.connect();

    await listDatabases(client)
    } catch(e){
        console.log(e)
    } finally{
        await client.close()
    }
}

main().catch(console.err)

async function listDatabases(client){
 const databasesList=   await client.db().admin().listDatabases()
 console.log("Dtatabases: ")
 databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`)
 })


}
const port = process.env.PORT || 5050


function sendErrorOutput(err, res) {
    res.status(400).send({
        error: err.message
    })
}


app.listen(port, () => console.log('conncted to mongoDB'))