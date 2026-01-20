import { SearchResultContext } from "@/context/searchResult.context"
import useMultiSearch from "@/hooks/useMultiSearch"
import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"
import { useContext } from "react"


const SearchList = () => {
 const {searchData, searchText} = useContext(SearchResultContext)
 useMultiSearch(searchText)
  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-y-3">
      {searchData?.map((data) => (
        <div key={data.id}>
              {data.media_type === "movie" ? (
              <MovieCard movieResult={data as any}/>
              ): (
                <TvShowCard tvshowResult={data as any}/>
              )}
          </div>
      ))}
    </div>
  )
}

export default SearchList
