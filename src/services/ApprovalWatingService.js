import axios from "axios";
import { rootApiUrl } from "../environment/Environment";



export const getTreatmentPlanInjector = async () => {
    return await axios.get(`${rootApiUrl}/get-treatent-plan-injector`);
};