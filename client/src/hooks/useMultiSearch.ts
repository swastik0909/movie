import { SearchResultContext } from "@/context/searchResult.context"
import apiClient from "@/services/api-client"
import { useContext, useEffect } from "react"

const useMultiSearch = (input : string) => {
   const {setSearchData} =useContext(SearchResultContext)
    const fetechSearch = async ()=>{
    const res = await apiClient.get("/search/multi",{
        params :{
            query: input,
        },
    }) 

    setSearchData(res.data.results)
}

useEffect(() => {
    fetechSearch()
}, [input])
}
export default useMultiSearch