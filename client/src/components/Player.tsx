import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tmdbApi from "@/services/api-client";
import userApi from "@/services/userApi";

type Language = "sub" | "dub";

const Player = () => {
  const { playerId } = useParams<{ playerId: string }>();

  const [movie, setMovie] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("sub");
  const [dubAvailable, setDubAvailable] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  if (!playerId) return null;

  /* 🎬 FETCH MOVIE + CHECK DUB */
  useEffect(() => {
    tmdbApi.get(`/movie/${playerId}`).then((res) => {
      setMovie(res.data);

      const hasEnglish = res.data.spoken_languages?.some(
        (l: any) => l.iso_639_1 === "en"
      );

      setDubAvailable(hasEnglish);
    });
  }, [playerId]);

  /* 🔁 FORCE SUB IF DUB NOT AVAILABLE */
  useEffect(() => {
    if (!dubAvailable && language === "dub") {
      setLanguage("sub");
    }
  }, [dubAvailable, language]);

  /* ▶️ CONTINUE WATCHING */
  useEffect(() => {
    if (!movie || !playerId) return;

    const saveProgress = () => {
      userApi
        .post("/continue", {
          mediaId: Number(playerId), // ✅ FIX (string → number)
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

  /* 🔗 STREAM URL */
  const src = `https://vidsrc-embed.ru/embed/movie/${playerId}?lang=${language}`;

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full aspect-video bg-black">
        <iframe
          key={`${language}-${reloadKey}`}
          src={src}
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="w-full bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">
          <div className="bg-yellow-400/10 text-yellow-300 rounded-lg px-4 py-2 text-sm w-fit">
            You are watching <b>{movie?.title}</b>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-12 text-gray-400 text-sm">SUB:</span>
            <ServerBtn
              active={language === "sub"}
              onClick={() => {
                setLanguage("sub");
                setReloadKey((k) => k + 1);
              }}
            >
              VidSrc
            </ServerBtn>
          </div>

          {dubAvailable && (
            <div className="flex items-center gap-3">
              <span className="w-12 text-gray-400 text-sm">DUB:</span>
              <ServerBtn
                active={language === "dub"}
                onClick={() => {
                  setLanguage("dub");
                  setReloadKey((k) => k + 1);
                }}
              >
                VidSrc
              </ServerBtn>
            </div>
          )}
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
    className={`px-4 py-1.5 rounded-md text-sm transition ${
      active
        ? "bg-yellow-400 text-black font-semibold"
        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
    }`}
  >
    {children}
  </button>
);
