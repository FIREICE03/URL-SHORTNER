import axiosInstance from "../utils/axiosInstance"

export const createShortUrl = async (url,slug) =>{
    // Only send `slug` when a custom slug is provided (Custom mode).
    // Normal mode sends just { url } so the backend generates a random short URL.
    const payload = slug ? {url,slug} : {url}
    const {data} = await axiosInstance.post("/api/create",payload)
    return data.shortUrl
}