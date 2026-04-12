import { getSong } from "../services/song.api"
import { useContext } from "react"
import { HomeContext } from "../Home.context"

export const UseSong = () => {
  const context = useContext(HomeContext)
  const { song, setSong, loading, setLoading } = context

  const handleGetSongs = async (mood) => {
    setLoading(true)
    try {
      const data = await getSong({ mood })
      setSong(data.song)
    } catch (err) {
      console.error("Failed to fetch song:", err)
    }
    setLoading(false)
  }

  return { loading, song, handleGetSongs }
}
