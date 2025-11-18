// src/services/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_RPG_API_URL ?? "http://localhost:8080",
});
