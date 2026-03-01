import axios from "axios";
export const predictManual = (data:any)=>axios.post("http://127.0.0.1:8000/predict",data);
export const predictFile = (file:File)=>{
  const f=new FormData(); f.append("file",file);
  return axios.post("http://127.0.0.1:8000/upload",f);
};
