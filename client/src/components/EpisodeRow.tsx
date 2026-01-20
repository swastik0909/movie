import type { Episode } from "@/hooks/useEpisodes";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  tvId: string;
  season: number;
  currentEpisode: number;
  episodes: Episode[];
}

const EpisodeRow = ({
  tvId,
  season,
  currentEpisode,
  episodes,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Episodes · Season {season}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {episodes.map((ep) => {
          const isActive = ep.episode_number === currentEpisode;

          return (
            <div
              key={ep.id}
              onClick={() =>
                navigate(`/tv/${tvId}/${season}/${ep.episode_number}`)
              }
              className={`
                min-w-[280px] cursor-pointer rounded-xl overflow-hidden
                bg-zinc-900 hover:bg-zinc-800 transition
                ${isActive ? "ring-2 ring-red-600" : ""}
              `}
            >
              {ep.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                  alt={ep.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-zinc-800 flex items-center justify-center">
                  <Play className="text-gray-400" />
                </div>
              )}

              <div className="p-3">
                <p className="text-sm font-semibold line-clamp-1">
                  E{ep.episode_number}: {ep.name}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {ep.overview || "No description available"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodeRow;
