import { Url } from "../models/url.js";
import { generateshortcode } from "../utils/shortcodegenerate.js";

export const shortenurl = async (req, res) => {
    try {
        const { originalUrl, expireInMinutes } = req.body;
        if (!originalUrl) return res.status(400).json({ message: "URL required" });

        const shortCode = generateshortcode();

        const DEFAULT_EXPIRY_MINUTES = 1 * 24 * 60;

        // If expiry provided → set expiry date
        const minutesToUse = expireInMinutes || DEFAULT_EXPIRY_MINUTES;
        const expiresAt = new Date(Date.now() + minutesToUse * 60 * 1000);
        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            expiresAt,
        });

        return res.json({
            shortUrl: `${req.headers.host}/${shortCode}`,
            expiresAt: expiresAt ? expiresAt.toISOString() : "Never",
            message: "Short URL created successfully ",
        });
    } catch (err) {
        console.error("Shortenurl error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};
