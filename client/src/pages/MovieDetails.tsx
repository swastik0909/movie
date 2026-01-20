import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import tmdbApi from "@/services/api-client";

import MovieHero from "@/components/MovieHero";
import MovieInfo from "@/components/MovieInfo";
import MovieCast from "@/components/MovieCast";

import ReviewsSection from "@/components/ReviewsSection";

const MovieDetails = () => {
  const params = useParams();
  const movieId = params.movieId; // string | undefined
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);

  /* 🚫 SAFETY CHECK */
  if (!movieId) {
    return (
      <div className="p-10 text-white">
        Invalid movie
      </div>
    );
  }

  useEffect(() => {
    tmdbApi
      .get(`/movie/${movieId}`)
      .then((res) => setMovie(res.data));

    tmdbApi
      .get(`/movie/${movieId}/credits`)
      .then((res) => setCast(res.data.cast || []));
  }, [movieId]);

  if (!movie) return null;

  return (
    <div className="text-white">
      {/* 🎬 HERO + PLAY BUTTON */}
      <MovieHero
        movie={movie}
        onPlay={() => navigate(`/player/${movieId}`)}
      />

      {/* ℹ️ MOVIE INFO */}
      <MovieInfo movie={movie} />

      {/* 🎭 CAST */}
      <MovieCast cast={cast} />

      {/* ⭐ REVIEWS & RATINGS */}
      <ReviewsSection mediaId={movieId} mediaType="movie" />
    </div>
  );
};

export default MovieDetails;
