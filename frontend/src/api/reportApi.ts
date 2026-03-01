import axios from "axios";
export const downloadReport = (data:any)=>
  axios.post("http://127.0.0.1:8000/report",data,{responseType:"blob"});
