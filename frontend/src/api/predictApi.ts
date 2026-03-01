import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const predictManual = (data: any) =>
  axios.post(`${API_URL}/predict`, data);

export const predictFile = (file: File) => {
  const f = new FormData();
  f.append("file", file);
  return axios.post(`${API_URL}/upload`, f);
};
