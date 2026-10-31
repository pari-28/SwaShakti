const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_URL = (
  configuredApiUrl || "http://localhost:5001"
).replace(/\/+$/, "");

export const API_BASE_URL = API_URL + "/api";
