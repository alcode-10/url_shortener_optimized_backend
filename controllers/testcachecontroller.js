import { Url } from "../models/url.js";
import {redisClient} from "../config/redis.js";

export const redirectCached = async (req, res) => {
    const { shortCode } = req.params;

    const cachedUrl = await redisClient.get(shortCode);
    if (cachedUrl) {
        return res.status(200).json({ fromCache: true, url: cachedUrl });
    }

    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ message: "Not found" });

    await redisClient.set(shortCode, url.originalUrl, { EX: 3600 });
    return res.status(200).json({ fromCache: false, url: url.originalUrl });
};


export const redirectNoCache = async (req, res) => {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ url: url.originalUrl });
};
