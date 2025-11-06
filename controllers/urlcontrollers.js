import { Url } from "../models/url.js";
import { generateshortcode } from "../utils/shortcodegenerate.js";

export const shortenurl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) return res.status(400).json({ message: "URL required" });

        let shortCode = generateshortcode();
        let exists = await Url.findOne({ shortCode });
        while (exists) {
            shortCode = generateshortcode();
            exists = await Url.findOne({ shortCode });
        }

        const newUrl = await Url.create({
            originalUrl,
            shortCode,
        });

        return res.json({
            shortUrl: `${req.headers.host}/${shortCode}`,
            originalUrl,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server error" });
    }
};
