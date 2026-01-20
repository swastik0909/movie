import { useEffect, useState } from "react";
import tmdbApi from "@/services/api-client";

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  still_path: string | null;
  overview: string;
}

const useEpisodes = (tvId: string, season: number) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tvId || !season) return;

    setLoading(true);

    tmdbApi
      .get(`/tv/${tvId}/season/${season}`)
      .then((res) => {
        console.log("✅ Episodes fetched:", res.data.episodes);
        setEpisodes(res.data.episodes || []);
      })
      .catch((err) => {
        console.error("❌ Episode fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [tvId, season]);

  return { episodes, loading };
};

export default useEpisodes;
