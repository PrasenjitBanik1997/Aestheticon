import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const getAllClinic = async () => {
    return await axios.get(`${rootApiUrl}/get-all-clinic`);
};

export const createClinic = async (clinicInformation) => {
    return await axios.post(`${rootApiUrl}/add-clinic`,clinicInformation);
};

export const updateClinic = async (updateClinicInformation) => {
    return await axios.put(`${rootApiUrl}/update-clinic`,updateClinicInformation);
};

export const activeOrDeactiveClinic = async (clinicId) => {
    return await axios.put(`${rootApiUrl}/toggle-clinic-by-clinic-id/${clinicId}`);
};

export const deleteClinicById = async (clinicId) => {
    return await axios.put(`${rootApiUrl}/delet-clinic-by-clinic-id/${clinicId}`);
}