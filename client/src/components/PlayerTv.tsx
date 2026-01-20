import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useEpisodes from "@/hooks/useEpisodes";
import useSeasons from "@/hooks/useSeasons";
import EpisodeRow from "@/components/EpisodeRow";
import SeasonSelector from "@/components/SeasonSelector";
import { saveContinueProgress } from "@/services/userApi";

type Language = "sub" | "dub";

const PlayerTV = () => {
  const { tvId, season, episode } = useParams<{
    tvId: string;
    season?: string;
    episode?: string;
  }>();

  const location = useLocation();

  if (!tvId) {
    return (
      <div className="text-white text-center mt-20">
        Invalid TV show
      </div>
    );
  }

  const tvIdNum = Number(tvId);
  const seasonNum = Number(season);
  const episodeNum = Number(episode);

  // ✅ GET POSTER & TITLE FROM ROUTE STATE
  const poster: string | null = location.state?.poster ?? null;
  const title: string = location.state?.title ?? "TV Show";

  /* 🔊 LANGUAGE STATE */
  const [language, setLanguage] = useState<Language>("sub");

  /* ⚠️ DUB AVAILABILITY (STATIC FOR NOW) */
  const dubAvailable = false;

  /* 🎥 EMBED URL */
  const tvUrl =
    Number.isFinite(seasonNum) && Number.isFinite(episodeNum)
      ? `https://vidsrc-embed.ru/embed/tv/${tvIdNum}/${seasonNum}/${episodeNum}?lang=${language}`
      : "";

  const { episodes } = useEpisodes(tvId, seasonNum || 1);
  const { seasons } = useSeasons(tvId);

  /* ✅ CONTINUE WATCHING (SAFE & CORRECT) */
  useEffect(() => {
    // ⛔ Do not save unless episode & season exist
    if (
      !Number.isFinite(tvIdNum) ||
      !Number.isFinite(seasonNum) ||
      !Number.isFinite(episodeNum)
    ) {
      return;
    }

    saveContinueProgress({
      mediaId: tvIdNum,
      title,
      poster, // ✅ REAL TV POSTER
      mediaType: "tv",
      season: seasonNum,
      episode: episodeNum,
      progress: 5,
    }).catch(() => {});
  }, [tvIdNum, seasonNum, episodeNum, poster, title]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ▶️ PLAYER */}
      {tvUrl && (
        <iframe
          key={`${tvIdNum}-${seasonNum}-${episodeNum}-${language}`}
          className="w-full h-[75vh]"
          src={tvUrl}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* 🎧 SUB / DUB PANEL */}
      <div className="px-6 mt-4">
        <div className="w-full bg-zinc-900 rounded-xl p-4">
          <div className="mb-4 text-sm text-yellow-300 bg-yellow-300/10 rounded-lg px-4 py-2 w-fit">
            You are watching <b>Season {seasonNum} • Episode {episodeNum}</b>
            <br />
            If the video doesn’t work, try switching language.
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm w-12 text-gray-400">SUB:</span>

            <button
              onClick={() => setLanguage("sub")}
              className={`px-4 py-1.5 rounded-md text-sm transition ${
                language === "sub"
                  ? "bg-yellow-400 text-black font-semibold"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              VidSrc
            </button>
          </div>

          {dubAvailable && (
            <div className="flex items-center gap-4">
              <span className="text-sm w-12 text-gray-400">DUB:</span>

              <button
                onClick={() => setLanguage("dub")}
                className={`px-4 py-1.5 rounded-md text-sm transition ${
                  language === "dub"
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                VidSrc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🎬 SEASON SELECTOR */}
      {seasons.length > 0 && (
        <div className="px-6 mt-6">
          <SeasonSelector
            tvId={tvId}
            currentSeason={seasonNum || 1}
            seasons={seasons}
          />
        </div>
      )}

      {/* 📺 EPISODES */}
      <div className="px-6 pb-16">
        <EpisodeRow
          tvId={tvId}
          season={seasonNum || 1}
          currentEpisode={episodeNum || 1}
          episodes={episodes}
        />
      </div>
    </div>
  );
};

export default PlayerTV;
