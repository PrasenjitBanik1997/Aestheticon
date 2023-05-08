import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { material } from '../../library/material'
import { getClinicList, getOrgList, inviteUser, userRegisterByAdmin, userRegisterBySuperAdmin } from '../../services/UserManagementService';
import Snackbar from '../toastrmessage/Snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dateFormat } from '../../date-and-time-format/DateAndTimeFormat';

let organisationDetails;
let organisationId;
let clinicDetalis;
let clinicId;

function InviteUser(props) {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched"
    });
    const { openInvitePoup, setOpenInvitePoup, userData, getAllUserList, setisLoading } = props;

    let userDetails = userData.authReducer.data;

    const [role, setRole] = useState("")
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [organisation, setOrganisation] = useState([]);
    const [clinicData, setClinicData] = useState([]);
    const [dateOfBirth, setDateOfBirth] = React.useState();

    useEffect(() => {
        if (userDetails.role === "SUPERADMIN") {
            getAllOrg();
        } else if (userDetails.role === "ADMIN") {
            getAllClinic();
        }
    }, []);

    const getAllOrg = async () => {
        await getOrgList()
            .then((resp) => {
                organisationDetails = resp.data
                let orgName = resp.data.map((ele) => ele.orgName)
                setOrganisation(orgName)
            })
    };

    const getAllClinic = async () => {
        await getClinicList()
            .then((resp) => {
                clinicDetalis = resp.data
                let clinicName = resp.data.map((ele) => ele.clinicName)
                setClinicData(clinicName)
            })
    };

    const selectOrg = (e, value) => {
        let orgId = organisationDetails.filter((ele) => ele.orgName === value).map((element) => element.orgId)
        organisationId = orgId
    };

    const handleClose = () => {
        setOpenInvitePoup(false);
    };

    const roleChange = (event) => {
        setRole(event.target.value)
    };

    const selectClinic = (e, value) => {
        let id = clinicDetalis.filter((ele) => ele.clinicName === value).map((res) => res.clinicId)
        clinicId = id
    };

    const selectMultipleClinic = (e, value) => {
        let id = clinicDetalis.filter((ele) => value.includes(ele.clinicName)).map((res) => res.clinicId)
        clinicId = id
    };

    const inviteUserByMail = async (fromData) => {
        await inviteUser(fromData).then((res) => {
            reset({ email: "" })
            setRole("")
            setOpenSnackBar({
                "action": true,
                "type": "success",
                "message": "Invite send successfully"
            })
            setOpenInvitePoup(false);
        }).catch((error) => {
            // console.log()
            setOpenSnackBar({
                "action": true,
                "type": "error",
                "message": error.message
            })
        })
    };

    const addUserByOrg = async (fromData) => {
        if (userDetails.role === "SUPERADMIN") {
            let obj = {
                "firstName": fromData.firstName,
                "lastName": fromData.lastName,
                "dateOfBirth": dateFormat(dateOfBirth),
                "role": fromData.role,
                "email": fromData.email,
                "orgId": organisationId[0],
                "password": fromData.password
            }
            await userRegisterBySuperAdmin(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "User add successfully"
                    })
                    setOpenInvitePoup(false);
                    setisLoading(true)
                    getAllUserList()
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": error.message
                    })
                })
        } else if (userDetails.role === "ADMIN") {
            let obj = {
                "firstName": fromData.firstName,
                "lastName": fromData.lastName,
                "dateOfBirth": dateFormat(dateOfBirth),
                "role": fromData.role,
                "email": fromData.email,
                "orgId": userDetails.orgId,
                "clinicId": clinicId,
                "password": fromData.password
            }
            await userRegisterByAdmin(obj)
                .then((res) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "User add successfully"
                    })
                    setOpenInvitePoup(false);
                    setisLoading(true)
                    getAllUserList()
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": error.message
                    })
                })
        }

    };


    return (
        <div style={{ width: "25%" }}>
            <form >
                <material.Dialog fullWidth open={openInvitePoup.open} hideBackdrop >
                    {openInvitePoup.action === "add-user" ? (
                        <>
                            <material.DialogTitle>Add User For Organisation</material.DialogTitle>
                            <material.DialogContent sx={{ height: "50vh" }}>
                                <material.TextField
                                    {...register("firstName", { required: true })}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="First Name"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                />
                                <material.TextField
                                    {...register("lastName", { required: true })}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Last Name"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <material.DesktopDatePicker
                                        label="Date of Birth"
                                        value={dateOfBirth}
                                        onChange={(newValue) => {
                                            setDateOfBirth(newValue)
                                        }}
                                        renderInput={(params) => <material.TextField {...params}
                                            error={errors.dateOfBirth?.type === "required"}
                                            {...register("dateOfBirth", { required: true })}
                                            variant="standard"
                                            fullWidth
                                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                        />}
                                    />
                                </LocalizationProvider>
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
                                        {...register("role", { required: true, })}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={role}
                                        onChange={roleChange}
                                    >
                                        <material.MenuItem value="ADMIN">ADMIN</material.MenuItem>
                                        <material.MenuItem value="MANAGER" hidden={userDetails.role === "SUPERADMIN"}>MANAGER</material.MenuItem>
                                        <material.MenuItem value="INJECTOR" hidden={userDetails.role === "SUPERADMIN"}>INJECTOR</material.MenuItem>
                                    </material.Select>
                                </material.FormControl>
                                {userDetails.role === "SUPERADMIN" ? (
                                    <material.Autocomplete
                                        fullWidth
                                        id="orgId"
                                        className='mt-2'
                                        onChange={selectOrg}
                                        options={organisation}
                                        renderInput={(params) => <material.TextField {...params} variant="standard" label="Organisation Name"
                                            {...register("orgId", {
                                                required: true,
                                            })}
                                        />}
                                    />
                                ) : userDetails.role === "ADMIN" && role !== "INJECTOR" ? (
                                    <material.Autocomplete
                                        fullWidth
                                        id="orgId"
                                        className='mt-2'
                                        onChange={selectClinic}
                                        options={clinicData}
                                        renderInput={(params) => <material.TextField {...params} variant="standard" label="Clinic Name"
                                            {...register("clinicName", {
                                                required: true,
                                            })}
                                        />}
                                    />
                                ) : null}
                                {role === "INJECTOR" ? (
                                    <material.Autocomplete
                                        multiple
                                        fullWidth
                                        id="orgId"
                                        className='mt-2'
                                        onChange={selectMultipleClinic}
                                        options={clinicData}
                                        renderInput={(params) => <material.TextField {...params} variant="standard" label="Clinic Name"
                                        />}
                                    />
                                ) : null}
                                <material.TextField
                                    {...register("password", { required: true })}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    variant="standard"
                                />
                                {(errors?.password?.type === "password") && (
                                    <p className='text-danger'>This is not a valid Password</p>
                                )}
                            </material.DialogContent>
                            <material.DialogActions className='me-3'>
                                <material.Button onClick={handleClose} variant="outlined" color="error" startIcon={<material.CloseIcon />}>Cancel</material.Button>
                                <material.Button onClick={handleSubmit(addUserByOrg)} variant="contained" startIcon={<material.ForwardToInboxIcon />}>Send</material.Button>
                            </material.DialogActions>
                        </>
                    ) : openInvitePoup.action === "invite-user" ? (
                        <>
                            <material.DialogTitle>Invite User</material.DialogTitle>
                            <material.DialogContent>
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
                                        {...register("role", { required: true, })}
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
                        </>
                    ) : null}
                    {/* <material.DialogActions className='me-3'>
                        <material.Button onClick={handleClose} variant="outlined" color="error" startIcon={<material.CloseIcon />}>Cancel</material.Button>
                        <material.Button onClick={handleSubmit(inviteUserByMail)} variant="contained" startIcon={<material.ForwardToInboxIcon />}>Send</material.Button>
                    </material.DialogActions> */}
                </material.Dialog>
            </form>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
    };
};

export default connect(mapStateToProps)(InviteUser)
