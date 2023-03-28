import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { material } from '../../library/material'
import { inviteUser } from '../../services/UserManagementService';
import Snackbar from '../toastrmessage/Snackbar';



function InviteUser(props) {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched"
    });
    const { open, setOpen } = props;
    const [role, setRole] = useState("")
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const handleClose = () => {
        setOpen(false);
    };

    const roleChange = (event) => {
        setRole(event.target.value)
    }

    const inviteUserByMail = async (fromData) => {
        await inviteUser(fromData).then((res) => {
            reset({email:""})
            setRole("")
            setOpenSnackBar({
                "action": true,
                "type": "success",
                "message": "Invite send successfully"
            })
        }).catch((error) => {
            // console.log()
            setOpenSnackBar({
                "action": true,
                "type": "error",
                "message": error.message
            })
        })
    }


    return (
        <div sx={{ width: "25%" }}>
            <form >
                <material.Dialog fullWidth open={open} hideBackdrop >
                    <material.DialogTitle>Invite User</material.DialogTitle>
                    <material.DialogContent>
                        {/* <material.DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </material.DialogContentText> */}
                        <material.TextField
                            {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                        {(errors?.email?.type === "pattern") && (
                            <p className='text-danger'>This is not a valid Email</p>
                        )}
                        <material.FormControl variant="standard" fullWidth className='mt-2'>
                            <material.InputLabel id="demo-simple-select-label">Role</material.InputLabel>
                            <material.Select
                                {...register("role", {required: true,})}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={role}
                                onChange={roleChange}
                            >
                                <material.MenuItem value="ADMIN">ADMIN</material.MenuItem>
                                <material.MenuItem value="MANAGER">MANAGER</material.MenuItem>
                            </material.Select>
                        </material.FormControl>
                    </material.DialogContent>
                    <material.DialogActions className='me-3'>
                        <material.Button onClick={handleClose} variant="outlined" color="error" startIcon={<material.CloseIcon />}>Cancel</material.Button>
                        <material.Button onClick={handleSubmit(inviteUserByMail)} variant="contained" startIcon={<material.ForwardToInboxIcon />}>Send</material.Button>
                    </material.DialogActions>
                </material.Dialog>
            </form>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
}

export default InviteUser
