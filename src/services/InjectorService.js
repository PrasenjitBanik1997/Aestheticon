import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const getAllInjector = async () => {
    return await axios.get(`${rootApiUrl}/get-injector-list`);
};

export const addInjector = async (injectorDetails) => {
    return await axios.post(`${rootApiUrl}/save-injector-details`, injectorDetails);
};

export const updateInjector = async (injectorDetails) => {
    return await axios.post(`${rootApiUrl}/save-or-update-injector-details`, injectorDetails);
};