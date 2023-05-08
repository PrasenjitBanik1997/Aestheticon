import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getClinicDetailsByClinicId = async (clinicId) => {
    return await axios.get(`${rootApiUrl}/get-clinic-by-clinic-id/${clinicId}`);
};

// export const getInjectorDetails = async (injectorId) => {
//     return await axios.get(`${rootApiUrl}/get-injector-details/${injectorId}`);
// };

export const saveTreatmentPlan = async (treatmentData) => {
    return await axios.post(`${rootApiUrl}/save-treatment-plan`, treatmentData);
};

export const getTreatmentPlanByPlanId = async (treatmentPlanRequestId) => {
    return await axios.get(`${rootApiUrl}/get-treatent-plan-by-planId/${treatmentPlanRequestId}`);
};

export const createBlankTreatmentPlan = async (data) => {
    return await axios.post(`${rootApiUrl}/create-blank-treatment-plan`, data)
}