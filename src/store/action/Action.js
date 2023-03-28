import { authActionType } from "../Constant";


export function loginAction(data) {
    return (dispatch) => {
        try {
            dispatch({ type: authActionType.LOGIN_SUCCESS, payload: data })
        } catch (error) {
        }
    }
};

export function logoutAction(initialState, navigate) {
    return (dispatch) => {
        dispatch({
            type: authActionType.LOGOUT_SUCCESS,
            payload: initialState
        })
        navigate("/login")
        window.location.reload()
        sessionStorage.removeItem("main-root")
    }
};