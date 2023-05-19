import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getConsentFormIdByTreatmentPlanId = async (treatmentPlanRequestId) => {
    return await axios.get(`${rootApiUrl}/get-consent-form-id-by-treatment-plan/${treatmentPlanRequestId}`);
};

// export const saveConsentFormSignature = async (consentFormData) => {
//     return await axios.post(`${rootApiUrl}/save-consent-form-signature`, consentFormData);
// };