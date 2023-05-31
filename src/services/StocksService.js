import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const getAllStocks = async () => {
    return await axios.get(`${rootApiUrl}/get-stock`);
};

export const saveOrUpdateStock = async (data) => {
    return await axios.post(`${rootApiUrl}/save-or-update-stock`, data);
};