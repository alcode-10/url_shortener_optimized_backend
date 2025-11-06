import { Url } from "../models/url.js";

export const getStats = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode });

        if (!url) return res.status(404).json({ message: "Short code not found" });

        res.json({
            shortCode: url.shortCode,
            originalUrl: url.originalUrl,
            totalClicks: url.clicks,
            createdAt: url.createdAt,
            lastAccessed: url.lastAccessed,
            clickHistory: url.clickHistory.slice(-10).reverse() // show last 10
        });
    } catch (err) {
        console.error(" Stats error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
