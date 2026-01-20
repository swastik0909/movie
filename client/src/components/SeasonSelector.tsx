import { useNavigate } from "react-router-dom";

interface Props {
  tvId: string;
  currentSeason: number;
  seasons: number[];
}

const SeasonSelector = ({ tvId, currentSeason, seasons }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-4">
      <select
        value={currentSeason}
        onChange={(e) =>
          navigate(`/tv/${tvId}/${e.target.value}/1`)
        }
        className="
          bg-zinc-900 text-white px-4 py-2 rounded
          border border-zinc-700
          focus:outline-none focus:ring-2 focus:ring-red-600
        "
      >
        {seasons.map((s) => (
          <option key={s} value={s}>
            Season {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;
