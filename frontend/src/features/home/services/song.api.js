import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const getSong = async ({mood}) => {
    try {
        const response = await api.get(`/api/song?mood=${encodeURIComponent(mood)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song:", error);
        throw error;
    }



};

export const getMoodPlaylist = async ({ mood }) => {
    try {
        const response = await api.get(`/api/song/playlist/${encodeURIComponent(mood)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching playlist:", error);
        throw error;
    }
};

export const uploadSong = async ({ file, mood }) => {
    const formData = new FormData();
    formData.append("song", file);
    formData.append("mood", mood);

    const response = await api.post("/api/song", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

export const getAdminSongs = async () => {
    const response = await api.get("/api/song/admin/list");
    return response.data;
};
