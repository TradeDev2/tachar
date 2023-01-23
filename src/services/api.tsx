import { DB_URL } from "../config/constants";
import axios from "axios";

export const api = axios.create({
    baseURL: DB_URL,
    timeout: 15000
})