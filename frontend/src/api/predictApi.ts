import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const predictManual = (data: any) =>
  axios.post(`${API_URL}/predict`, data);

export const predictFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
