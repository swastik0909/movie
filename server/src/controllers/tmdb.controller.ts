import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "5697d3c0d91fbfd7aa1f8ee62e26b3a8"; // Fallback for dev

export const getTmdbData = async (req: Request, res: Response) => {
    try {
        // Regex route captures the path in params[0]
        const endpoint = req.params[0];
        if (!endpoint) {
            return res.status(400).json({ message: "No endpoint provided" });
        }

        // Merge query params from the client with the API key
        const params = {
            ...req.query,
            api_key: TMDB_API_KEY,
        };

        const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}`, {
            params,
        });

        res.json(response.data);
    } catch (error: any) {
        if (error.response) {
            // TMDB responded with an error
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // Network error (timeout, etc.)
            console.error("TMDB Network Error:", error.message);
            res.status(503).json({ message: "Service Unavailable: Unable to reach TMDB" });
        } else {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
};
