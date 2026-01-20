import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GenresContext } from "@/context/genres_context"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"



const genreList =[
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]


const Genres = () => {
   const{genres, setGenres}= useContext(GenresContext)
   const [genreName, setGenreName] = useState<string | null>(null)
    console.log(genres)
    const navigate = useNavigate()

    const onChange = (value: string) =>{
        setGenres(Number(value));
        navigate("/movies")
    }

  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <h1
      className="
        cursor-pointer
        text-black
        dark:text-white
        hover:text-red-500
        transition
      "
    >
      {genres ? genreName || "Genres" : "Genres"}
    </h1>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    className="
      w-56
      bg-[#141414]
      text-gray-300
      border border-white/10
      rounded-xl
      shadow-xl shadow-black/80
      p-2
    "
  >
    <DropdownMenuSeparator />

    <DropdownMenuRadioGroup
      value={genres?.toString()}
      onValueChange={onChange}
    >
      {genreList.map((genre) => (
        <DropdownMenuRadioItem
          key={genre.id}
          value={genre.id.toString()}
          onClick={() => setGenreName(genre.name)}
          className="
            cursor-pointer
            focus:bg-red-600
            focus:text-white
          "
        >
          {genre.name}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
)}

export default Genres



