import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const downloadReport = (data: any) =>
  axios.post(`${API_URL}/report`, data, {
    responseType: "blob",
  });
