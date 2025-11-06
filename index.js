import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

import urlshortener from './routes/url.js'
import redirectroute from './routes/redirect.js'
const app = express();
app.use(express.json())
app.use('/api', urlshortener)
app.use('/api/redirect',redirectroute)

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongo DB is connected")
    }
    catch (err)
    {
        console.log("Connection Failed")
    }
    
}

connect();

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
