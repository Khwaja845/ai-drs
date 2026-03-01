import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getShap = (data: any) =>
  axios.post(`${API_URL}/explain`, data);
