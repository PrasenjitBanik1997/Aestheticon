import React from 'react';
import { material } from '../../library/material'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <material.MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Snackbar(props) {

    const { openSnackBar, setOpenSnackBar } = props;
    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;


    const handleClose = () => {
        setOpenSnackBar({
            "action": false,
            "type": openSnackBar.type,
            "message": ""
        })
    }

    return (

        <material.Stack  sx={{ width: '100%' }}>
            <material.Snackbar open={openSnackBar.action} autoHideDuration={20000} onClose={handleClose} key={vertical + horizontal} sx={{ marginTop: "45px" }} anchorOrigin={{ vertical, horizontal }}>
                <Alert onClose={handleClose} severity={openSnackBar.type} sx={{ width: '100%' }}>{openSnackBar.message}</Alert>
            </material.Snackbar>
        </material.Stack>

    )
}

export default Snackbar