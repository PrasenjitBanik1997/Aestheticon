import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const inviteUser = async (inviteDetails) => {
    return await axios.post(`${rootApiUrl}/invite`, inviteDetails);
};

export const getOrgList = async () => {
    return await axios.get(`${rootApiUrl}/org-list`);
};

export const getClinicList = async () => {
    return await axios.get(`${rootApiUrl}/clinic-list`);
};

export const userRegisterBySuperAdmin = async (userData) => {
    return await axios.post(`${rootApiUrl}/register`, userData);
};

export const userRegisterByAdmin = async (userData) => {
    return await axios.post(`${rootApiUrl}/register-org-user`, userData);
};

export const getUsersList = async () => {
    return await axios.get(`${rootApiUrl}/get-user-list`);
};

export const activeOrDeactiveUser = async (userId) => {
    return await axios.put(`${rootApiUrl}/toggle-user-active-status/${userId}`);
};