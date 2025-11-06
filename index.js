import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

import urlshortener from './routes/url.js'
import redirectroute from './routes/redirect.js'
import statsRoutes from "./routes/statroutes.js";
import { rateLimiter } from "./middleware/ratelimiter.js";
const app = express();
app.use(express.json())

app.use("/api/shortenurl", rateLimiter({ windowMs: 10 * 60 * 1000, max: 20 }));
app.use("/api/stats", rateLimiter({ windowMs: 60 * 1000, max: 60 }));

app.use("/", rateLimiter({ windowMs: 60 * 1000, max: 300 }));
app.use('/api', urlshortener)
app.use('/', redirectroute)
app.use("/api", statsRoutes);

app.get("/flush", async (req, res) => {
    await redisClient.flushAll();
    res.send("Redis cache + rate limit cleared ✅");
});

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
