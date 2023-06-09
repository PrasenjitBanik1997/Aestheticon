import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getAllPAtients = async () => {
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

export const getAllPatientByClinicId = async (clinicId) => {
    return await axios.get(`${rootApiUrl}/get-patient-details-by-clinicId/${clinicId}`);
};

export const getPatientNote = async (patientId) => {
    return await axios.get(`${rootApiUrl}/get-patient-note/${patientId}`);
};