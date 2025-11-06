import { Url } from '../models/url.js'
import { redisClient } from '../config/redis.js';

export const redirect = async (req, res) => {
    try {
        const { shortCode } = req.params

        const cachedUrl = await redisClient.get(shortCode);
        if (cachedUrl) {
            console.log("Cache hit:", shortCode);
            return res.redirect(cachedUrl);
        }
    
        const url = await Url.findOne({ shortCode })

        
    
        if (!url)
            res.status(404).json({ Message: "Code Not Found" })
    
        await Url.findOneAndUpdate(
            { shortCode: shortCode },
            { $inc: { clicks: 1 } }
        );

        await redisClient.set(shortCode, url.originalUrl, { EX: 3600 });
        console.log(" Cache miss → stored:", shortCode);
        //atomicity
        res.redirect(url.originalUrl);
    }
    catch (error) {
        console.error("Redirect error", error.message)
        return res.status(500).json({ message: "Server error" })
    }
    
};