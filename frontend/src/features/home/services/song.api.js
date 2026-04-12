import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,

})

export const getSong = async ({mood}) => {
    try {
        const response = await api.get(`/api/song?mood=${encodeURIComponent(mood)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song:", error);
        throw error;
    }



};
