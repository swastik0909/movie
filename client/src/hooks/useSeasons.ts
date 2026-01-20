import { useEffect, useState } from "react";
import tmdbApi from "@/services/api-client";

const useSeasons = (tvId: string) => {
  const [seasons, setSeasons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tvId) return;

    const load = async () => {
      try {
        const res = await tmdbApi.get(`/tv/${tvId}`);
        const seasonCount = res.data.number_of_seasons;

        setSeasons(
          Array.from({ length: seasonCount }, (_, i) => i + 1)
        );
      } catch (err) {
        console.error("Season fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tvId]);

  return { seasons, loading };
};

export default useSeasons;
