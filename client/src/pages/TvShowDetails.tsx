import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdbApi from "@/services/api-client";

import TvHero from "@/components/tv/TvHero";
import TvInfo from "@/components/tv/TvInfo";
import TvCast from "@/components/tv/TvCast";
import TvSeasons from "@/components/tv/TvSeasons";
import ReviewsSection from "@/components/ReviewsSection";

const TvShowDetails = () => {
  const { tvId } = useParams<{ tvId: string }>();
  const navigate = useNavigate();

  if (!tvId) return null;

  const [tv, setTv] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    tmdbApi.get(`/tv/${tvId}`).then(res => setTv(res.data));
    tmdbApi
      .get(`/tv/${tvId}/credits`)
      .then(res => setCast(res.data.cast || []));
  }, [tvId]);

  if (!tv) return null;

  // ✅ BUILD POSTER URL ONCE
  const posterUrl = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    : null;

  return (
    <div className="text-white">
      <TvHero tv={tv} />

      <TvInfo tv={tv} />

      <TvCast cast={cast} />

      <TvSeasons
        seasons={tv.seasons}
        onPlay={(season, episode) =>
          navigate(`/tv/${tvId}/${season}/${episode}`, {
            state: {
              poster: posterUrl,
              title: tv.name,
            },
          })
        }
      />

      {/* ⭐ REVIEWS */}
      <ReviewsSection mediaId={tvId} mediaType="tv" />
    </div>
  );
};

export default TvShowDetails;
