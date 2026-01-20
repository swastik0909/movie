import axios from "axios";

// 🔄 PROXY CLIENT
// Instead of calling TMDB directly (which gets blocked), we call our Backend.
const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/tmdb`
    : "http://localhost:5000/api/tmdb",
  // No api_key here! The backend adds it securely.
});

export default tmdbApi;
