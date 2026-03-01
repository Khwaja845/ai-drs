import { api } from "./base";

export const downloadReport = (data: any) =>
  api.post("/report", data, {
    responseType: "blob",
  });
