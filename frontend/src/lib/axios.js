import axios from "axios";
import { tr } from "framer-motion/m";
  export const axiosInstance = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true,
  });