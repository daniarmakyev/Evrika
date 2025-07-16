import axios from "axios";


export const API_URL = "https://eureka-course.onrender.com";
export const $api = axios.create({ baseURL: API_URL });
export const $apiPrivate = axios.create({ baseURL: API_URL });

$apiPrivate.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("evrika-access-token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});


//   
