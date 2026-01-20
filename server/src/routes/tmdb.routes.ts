import express from "express";
import { getTmdbData } from "../controllers/tmdb.controller";

const router = express.Router();

// Capture everything using Regex
// matches any path starting with /
router.get(/^\/(.*)/, getTmdbData);

export default router;
