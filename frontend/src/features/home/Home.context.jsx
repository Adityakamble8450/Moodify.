import { createContext, useState ,  } from "react";


export const HomeContext = createContext()

export const HomeProvider = ({children}) =>{

   const [song , setSong] = useState(null)

   const [loading , setLoading] = useState(false)


    return (
        <HomeContext.Provider value={{ song, setSong, loading, setLoading }} >
            {children}
        </HomeContext.Provider>
    )
}

