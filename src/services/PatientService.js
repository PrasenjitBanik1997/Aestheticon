import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getAllPAtient = async () => {
    return await axios.get(`${rootApiUrl}/get-all-patients`);
};

export const addNewPatient = async (patientData) => {
    return await axios.post(`${rootApiUrl}/add-patient-details`, patientData);
};

export const getPatientHistory = async (patientId) => {
    return await axios.get(`${rootApiUrl}/get-patient-history/${patientId}`);
};

export const addPatientHistory = async (patientHistory) => {
    return await axios.post(`${rootApiUrl}/add-patient-history`, patientHistory);
};