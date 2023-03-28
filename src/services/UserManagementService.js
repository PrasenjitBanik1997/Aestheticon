import axios from "axios";
import { rootApiUrl } from "../environment/Environment";


export const inviteUser = async (inviteDetails) => {
    return await axios.post(`${rootApiUrl}/invite`,inviteDetails);
}