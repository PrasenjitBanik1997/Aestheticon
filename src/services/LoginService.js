import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const userLogin = async (userData) => {
    return await axios.post(`${rootApiUrl}/login`,userData);
}