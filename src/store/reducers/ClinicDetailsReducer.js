import { authActionType } from "../Constant";


const initialState = {
    data: {
        clinicName: "",
        clinicId: ""
    }
};


export default function clinicReducer(state = initialState, action) {
    switch (action.type) {
        case authActionType.CLINIC_ID:
            const clinicianState = {
                data: action.payload,
            }
            return clinicianState
        case authActionType.LOGOUT_SUCCESS:
            return initialState;
        default:
            return state;
    }
};