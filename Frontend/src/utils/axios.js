import axios from "axios";

const api= axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL,
  timeout: 100000,
  withCredentials:true,
});


export default api;