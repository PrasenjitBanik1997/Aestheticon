import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const getCallCredential = async (treatmentPlanRequestId) => {
    return await axios.get(`${rootApiUrl}/get-call-credential/${treatmentPlanRequestId}`)
};
