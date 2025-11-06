import express from "express";
import { getStats } from "../controllers/statscontroller.js";

const router = express.Router();
router.get("/stats/:shortCode", getStats);

export default router;
