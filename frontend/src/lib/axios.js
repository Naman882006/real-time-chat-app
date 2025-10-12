import axios from "axios";
import { tr } from "framer-motion/m";
  export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api":"/api",
    withCredentials:true,
  });