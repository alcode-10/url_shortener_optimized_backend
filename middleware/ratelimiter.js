import {redisClient} from "../config/redis.js";

export const rateLimiter = ({
    windowMs = 15 * 60 * 1000, //
    max = 20,                 
    keyGenerator = (req) => req.ip,
    prefix = "rl:"
} = {}) => {
    return async (req, res, next) => {
        try {
            const key = prefix + keyGenerator(req);
            const now = Date.now();
            const windowStart = now - windowMs;

            await redisClient.zRemRangeByScore(key, 0, windowStart);

            
            await redisClient.zAdd(key, [{ score: now, value: `${now}-${Math.random()}` }]);

        
            const count = await redisClient.zCard(key);

    
            const ttlSec = Math.ceil(windowMs / 1000);
            await redisClient.expire(key, ttlSec);

            res.setHeader("X-RateLimit-Limit", max);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count));
            res.setHeader("X-RateLimit-WindowMS", windowMs);

            if (count > max) {
                return res.status(429).json({
                    message: "Too many requests, slow down.",
                    retryAfterMs: windowMs
                });
            }

            return next();
        } catch (err) {
            console.error("RateLimiter error:", err.message);

            return next();
        }
    };
};
