import { api } from "./base";

export const predictManual = (data: any) =>
  api.post("/predict", data);

export const getShap = (data: any) =>
  api.post("/explain", data);
