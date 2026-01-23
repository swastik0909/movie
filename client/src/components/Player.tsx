import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tmdbApi from "@/services/api-client";
import userApi from "@/services/userApi";

// 🛠️ Server Configurations
const SERVERS = [
  { name: "VidSrc", url: (id: string) => `https://vidsrc-embed.ru/embed/movie/${id}` },
  { name: "VidLink", url: (id: string) => `https://vidlink.pro/movie/${id}` },
  { name: "Smashy", url: (id: string) => `https://player.smashy.stream/movie/${id}` },
];

const Player = () => {
  const { playerId } = useParams<{ playerId: string }>();

  const [movie, setMovie] = useState<any>(null);

  // State tracks the *full URL* directly
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [activeServerName, setActiveServerName] = useState<string>("VidSrc");

  const [reloadKey, setReloadKey] = useState(0);

  if (!playerId) return null;

  /* 🎬 FETCH MOVIE */
  useEffect(() => {
    tmdbApi.get(`/movie/${playerId}`).then((res) => {
      setMovie(res.data);
      // Set default server
      setActiveUrl(`https://vidsrc-embed.ru/embed/movie/${playerId}`);
    });
  }, [playerId]);

  /* ▶️ CONTINUE WATCHING */
  useEffect(() => {
    if (!movie || !playerId) return;

    const saveProgress = () => {
      userApi
        .post("/continue", {
          mediaId: Number(playerId),
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          mediaType: "movie",
          progress: 5,
        })
        .catch((err) => {
          console.error("Continue error:", err.response?.data);
        });
    };

    const interval = setInterval(saveProgress, 30000);
    window.addEventListener("beforeunload", saveProgress);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveProgress);
      saveProgress();
    };
  }, [movie, playerId]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full aspect-video bg-black">
        {activeUrl && (
          <iframe
            key={activeUrl + reloadKey}
            src={activeUrl}
            referrerPolicy="origin"
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="w-full bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="bg-yellow-400/10 text-yellow-300 rounded-lg px-4 py-2 text-sm w-fit">
              You are watching <b>{movie?.title}</b>
            </div>

            <div className="text-xs text-gray-400">
              Selected: <span className="text-white font-bold">{activeServerName}</span>
            </div>
          </div>

          {/* SERVER SELECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-24 shrink-0 flex items-center gap-2 text-sm font-bold text-gray-400">
                <span className="bg-zinc-800 p-1 rounded">SRV</span> SERVER
              </div>
              <div className="flex flex-wrap gap-2">
                {SERVERS.map((server) => (
                  <ServerBtn
                    key={server.name}
                    active={activeUrl === server.url(playerId)}
                    onClick={() => {
                      setActiveUrl(server.url(playerId));
                      setActiveServerName(server.name);
                      setReloadKey(k => k + 1);
                    }}
                  >
                    {server.name}
                  </ServerBtn>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Player;

const ServerBtn = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition tracking-wide ${active
      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
      : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
      }`}
  >
    {children}
  </button>
);
