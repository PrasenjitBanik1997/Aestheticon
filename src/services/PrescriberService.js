import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getPendingTreatmentRequest = async () => {
    return await axios.get(`${rootApiUrl}/get-pending-treatment-request-prescriber`);
};

export const changePlanStatus = async (data) => {
    return await axios.put(`${rootApiUrl}/change-plan-status`, data);
};