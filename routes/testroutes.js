import express from "express";
import { redirectCached, redirectNoCache } from "../controllers/testcachecontroller.js";

const router = express.Router();
router.get("/cache/:shortCode", redirectCached);
router.get("/nocache/:shortCode", redirectNoCache);

export default router;
