import { Url } from '../models/url.js'
import { redisClient } from '../config/redis.js';

export const redirect = async (req, res) => {
    try {
        const { shortCode } = req.params

        const cachedUrl = await redisClient.get(shortCode);
        if (cachedUrl) {
            console.log("Cache hit:", shortCode);
            Url.updateOne(
                { shortCode },
                {
                    $inc: { clicks: 1 },
                    $push: { clickHistory: new Date() },
                    $set: { lastAccessed: new Date() }
                }
            ).catch(console.error);
            return res.redirect(cachedUrl);
        }
    
        const url = await Url.findOneAndUpdate(
            { shortCode },
            {
                $inc: { clicks: 1 },
                $push: { clickHistory: new Date() },
                $set: { lastAccessed: new Date() }
            },
            { new: true }
        );

        if (!url)
            res.status(404).json({ Message: "Code Not Found" })
    

        await redisClient.set(shortCode, url.originalUrl, { EX: 3600 }); //time to live = 1 hour
        console.log(" Cache miss → stored:", shortCode);
        //atomicity
        res.redirect(url.originalUrl);
    }
    catch (error) {
        console.error("Redirect error", error.message)
        return res.status(500).json({ message: "Server error" })
    }
    
};