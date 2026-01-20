import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getContinueWatching } from "@/services/userApi"
import type { ContinueWatchingItem } from "@/services/userApi"

const ContinueWatchingRow = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getContinueWatching()
        setItems(res.data)
      } catch (err) {
        console.error("Continue watching error", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading || items.length === 0) return null

  /* ▶️ RESUME PLAYBACK */
  const handleResume = (item: ContinueWatchingItem) => {
    if (item.mediaType === "movie") {
      navigate(`/player/${item.mediaId}`)
    } else {
      navigate(`/tv/${item.mediaId}/${item.season ?? 1}/${item.episode ?? 1}`)
    }
  }

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Continue Watching
      </h2>

      <div className="flex gap-4 overflow-x-auto">
        {items.map((item) => {
          const progressPercent = Math.min(
            Math.floor((item.progress / 1800) * 100),
            100
          )

          return (
            <div
              key={item._id}
              onClick={() => handleResume(item)}
              className="
                min-w-[180px]
                cursor-pointer
                hover:scale-105
                transition
              "
            >
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-48 h-72 object-cover rounded"
                />
              ) : (
                <div className="w-48 h-72 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* PROGRESS BAR */}
              <div className="h-1 bg-gray-700 rounded mt-1">
                <div
                  className="h-1 bg-red-600 rounded"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-1 truncate">
                {item.mediaType === "tv"
                  ? `S${item.season} · E${item.episode}`
                  : "Movie"}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContinueWatchingRow
