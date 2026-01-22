import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useEpisodes from "@/hooks/useEpisodes";
import useSeasons from "@/hooks/useSeasons";
import EpisodeRow from "@/components/EpisodeRow";
import SeasonSelector from "@/components/SeasonSelector";
import { saveContinueProgress } from "@/services/userApi";

// 🛠️ Server Configurations (TV)
const SERVERS = [
  { name: "VidSrc", url: (id: string, s: number, e: number) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}` },
  { name: "VidLink", url: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
];

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

  /* 🔊 PLAYER STATE */
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [activeServerName, setActiveServerName] = useState<string>("VidSrc");
  const [reloadKey, setReloadKey] = useState(0);

  // Initialize with Default
  useEffect(() => {
    if (tvIdNum && seasonNum && episodeNum) {
      setActiveUrl(SERVERS[0].url(tvId, seasonNum, episodeNum));
    }
  }, [tvIdNum, seasonNum, episodeNum]);

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
    }).catch(() => { });
  }, [tvIdNum, seasonNum, episodeNum, poster, title]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ▶️ PLAYER */}
      <div className="w-full aspect-video bg-black">
        {activeUrl && (
          <iframe
            key={activeUrl + reloadKey}
            className="w-full h-full"
            src={activeUrl}
            referrerPolicy="origin"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* 🎧 SERVER PANEL */}
      <div className="px-6 mt-4">
        <div className="w-full bg-zinc-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="text-sm text-yellow-300 bg-yellow-300/10 rounded-lg px-4 py-2 w-fit">
              You are watching <b>Season {seasonNum} • Episode {episodeNum}</b>
            </div>
            <div className="text-xs text-gray-500">
              Selected: <span className="text-white font-bold">{activeServerName}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-24 shrink-0 flex items-center gap-2 text-sm font-bold text-gray-400">
                <span className="bg-zinc-800 p-1 rounded">SRV</span> SERVER
              </div>
              <div className="flex flex-wrap gap-2">
                {SERVERS.map((server) => (
                  <button
                    key={server.name}
                    onClick={() => {
                      setActiveUrl(server.url(tvId, seasonNum, episodeNum));
                      setActiveServerName(server.name);
                      setReloadKey(k => k + 1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition tracking-wide ${activeUrl === server.url(tvId, seasonNum, episodeNum)
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                      : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {server.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
