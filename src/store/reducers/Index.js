import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import clinicReducer from "./ClinicDetailsReducer";


export default combineReducers({
    authReducer, clinicReducer
})