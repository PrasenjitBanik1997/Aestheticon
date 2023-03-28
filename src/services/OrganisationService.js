import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const getAllOrganisation = async () => {
    return await axios.get(`${rootApiUrl}/get-all-org`);
}

export const createOrganisation = async (organisationInformation) => {
    return await axios.post(`${rootApiUrl}/add-org`,organisationInformation);
}

export const updateOrganisation = async (updatedInformation) => {
    return await axios.put(`${rootApiUrl}/update-org`,updatedInformation);
}

export const getInviteDetails = async (inviteCode) => {
    return await axios.post(`${rootApiUrl}/get-invite-details`,inviteCode);
}

export const registerByInvite = async (organisationInformation) => {
    return await axios.post(`${rootApiUrl}/register-invite`,organisationInformation);
}

export const deleteOrgById = async (organisationId) => {
    return await axios.put(`${rootApiUrl}/delet-org-by-org-id/${organisationId}`);
}

export const activeOrDeactiveOrg = async (organisationId) => {
    return await axios.put(`${rootApiUrl}/toggle-org-by-org-id/${organisationId}`);
}