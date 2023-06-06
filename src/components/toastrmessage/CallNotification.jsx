import React from 'react';
import { material } from '../../library/material'
import { useNavigate } from 'react-router-dom';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <material.MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CallNotification(props) {

    const { openCallNotification, setOpenCallNotification } = props;
    const navigate = useNavigate()

    const addCall = (planRequestId) => {
        navigate("/approval-waiting-quere", { state: { planRequestId } });
        setOpenCallNotification({ action: false })
    }

    return (
        <div>
            <material.Stack>
                <material.Snackbar open={openCallNotification.action} autoHideDuration={20000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                    <Alert severity="info" sx={{ width: '100%' }}>
                        Incoming call for this Treatment plan requestId {openCallNotification.data}
                        <span className='d-block mt-5 float-end'>
                            <material.Button sx={{ textTransform: "none" }} variant="contained" color='success' size="small" onClick={() => addCall(openCallNotification.data)}>Answer</material.Button>
                        </span>
                    </Alert>
                </material.Snackbar>
            </material.Stack>
        </div>
    );
}

export default CallNotification;