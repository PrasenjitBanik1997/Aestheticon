import { authActionType } from "../Constant";
import axios from "axios";

const initialState = {
    isLoggedIn: false,
    data: {
        email: "",
        orgId: "",
        refreshToken: "",
        role: "",
        token: "",
        userId: ""
    },
};


export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case authActionType.LOGIN_SUCCESS:
            const loginAuthState = {
                isLoggedIn: true,
                data: action.payload,
            };
            // axios.defaults.headers.common[
            //     "Authorization"
            // ] = `Bearer ${action.payload.token}`;
            return loginAuthState;
        case authActionType.LOGOUT_SUCCESS:
            sessionStorage.removeItem("persist:main-root")
            return action.payload;
        default:
            return state;
    }
}