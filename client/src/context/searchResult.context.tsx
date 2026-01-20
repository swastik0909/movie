import { createContext, useState } from "react";

export interface SearchResult {
  id: number;
  media_type: string;
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  title?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  name?: string;
  [key: string]: any;
}

export const SearchResultContext = createContext<{
  searchText: string;
  searchData: SearchResult[];
  setSearchData: (data: SearchResult[]) => void;
  setSearchText: (text: string) => void;
}>({
  searchText: "",
  searchData: [],
  setSearchData: () => {},
  setSearchText: () => {},
});

export const SearchProvider = ({children} : {children : React.ReactNode}) =>{
const [searchText, setSearchText] = useState<string>("")
const [searchData, setSearchData] = useState<SearchResult[]>([])

const value = {searchText, searchData, setSearchData, setSearchText}
 return (
 <SearchResultContext.Provider value={value}>
    {children}
</SearchResultContext.Provider>
 )
}
