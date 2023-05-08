import React, { useEffect, useState } from 'react'
import Swipedrawer from '../drawer/Swipedrawer'
// import PlacesAutocomplete from '../fetch_address_google/Address'
import { material } from '../../library/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import "./Addorganisation.css"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm } from "react-hook-form"
import moment from 'moment/moment';
import { createOrganisation, updateOrganisation } from '../../services/OrganisationService';
import { useLocation, useNavigate } from 'react-router-dom'
import Snackbar from '../toastrmessage/Snackbar';
import { connect } from 'react-redux';
import { createClinic, updateClinic } from '../../services/ClinicService';

function Addorganisation(props) {
    const { userData } = props;
    let userDetails = userData.authReducer.data;
    const location = useLocation();
    let organisatioDetails = location.state ? location.state.organisationData : "";
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
        defaultValues: organisatioDetails ? organisatioDetails : ""
    });
    const [value, setValue] = React.useState(moment().format("MM-DD-YYYY, HH:mm"));
    const navigate = useNavigate();
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });

    const addOrganisation = async (formData) => {
        if (organisatioDetails.callFrom === "add") {
            await createOrganisation(formData).then((res) => {
                reset()
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Organosation added successfully",
                })
            }).catch((err) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
        } else if (organisatioDetails.parentComponent === "clinic") {
            await createClinic(formData)
                .then((res) => {
                    reset()
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Clinic added successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": error.response.data.info,
                    })
                })
        };

    };

    const updateOrganisationDetails = async (formData) => {
        if (userDetails.role === "SUPERADMIN") {
            await updateOrganisation(formData).then(() => {
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Organosation updated successfully",
                })
                setTimeout(() => {
                    reset()
                    goBack()
                }, 1000)
            }).catch(() => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
        } else if (userDetails.role === "ADMIN") {
            await updateClinic(formData)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Organosation updated successfully",
                    })
                    setTimeout(() => {
                        reset()
                        goBack()
                    }, 1000)
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        };

    };

    const goBack = () => {
        if (userDetails.role === "ADMIN") {
            navigate("/clinic")
        } else if (userDetails.role === "SUPERADMIN") {
            navigate("/organisation")
        }
    };

    // const handleChange = (newValue) => {
    //     setValue(newValue);
    // };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    {organisatioDetails.parentComponent === "clinic" ? (
                        <span><material.Typography variant="h5">Add Clinic</material.Typography></span>
                    ) : organisatioDetails.callFrom === "add" ? (
                        <span><material.Typography variant="h5">Add Organisation</material.Typography></span>
                    ) : ""}
                </div>
                <div className="col-6">
                    <span className='float-end'>
                        <material.Button variant="contained" onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>

            <material.Paper className='p-4 mt-2' elevation={1}>
                <form >
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            {userDetails.role === "ADMIN" ? (
                                <material.TextField
                                    error={errors.orgName?.type === "required"}
                                    {...register("clinicName", { required: true })}
                                    label="Clinic Name"
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    // defaultValue="Small"
                                    size="small"
                                    fullWidth
                                    inputProps={{ style: { textTransform: 'capitalize' } }}
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    InputProps={{ readOnly: organisatioDetails.readOnly }}

                                />
                            ) : (
                                <material.TextField
                                    error={errors.orgName?.type === "required"}
                                    {...register("orgName", { required: true })}
                                    label="Organisation Name"
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    // defaultValue="Small"
                                    size="small"
                                    fullWidth
                                    inputProps={{ style: { textTransform: 'capitalize' } }}
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    InputProps={{ readOnly: organisatioDetails.readOnly }}

                                />
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.acn?.type === "required"}
                                {...register("acn", { required: true, minLength: 9, maxLength: 9 })}
                                label="ACN"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="number"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {(errors?.acn?.type === "minLength" || errors?.acn?.type === "maxLength") && (
                                <p className='text-danger'>This field only contain 9 digits</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.abn?.type === "required"}
                                {...register("abn", { required: true, minLength: 11, maxLength: 11 })}
                                label="ABN"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="number"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {(errors?.abn?.type === "minLength" || errors?.abn?.type === "maxLength") && (
                                <p className='text-danger'>This field only contain 11 digits</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 ">
                            <material.TextField
                                error={errors.registeredOfficeAddress?.type === "required"}
                                {...register("registeredOfficeAddress", { required: true })}
                                label="Register Office"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type='text'
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director1Id?.type === "required"}
                                {...register("director1Id", { required: organisatioDetails.parentComponent === "clinic" ? false : true })}
                                label="Director_1 ID"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type='text'
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director1?.type === "required"}
                                {...register("director1", { required: organisatioDetails.parentComponent === "clinic" ? false : true })}
                                label="Director_1 Name"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="text"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director1Phone?.type === "required"}
                                {...register("director1Phone", { required: true, minLength: 10, maxLength: 10 })}
                                label="Director_1 Ph."
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                type="number"
                                size="small"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{
                                    startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
                                    readOnly: organisatioDetails.readOnly
                                }}
                            />
                            {(errors?.director1Phone?.type === "minLength" || errors?.director1Phone?.type === "maxLength") && (
                                <p className='text-danger'>Cannot exceed 10 number</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director1Mail?.type === "required"}
                                {...register("director1Mail", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                                label="Director_1 Email"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="email"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {(errors?.director1Mail?.type === "pattern") && (
                                <p className='text-danger'>This is not a valid Email</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director2Id?.type === "required"}
                                {...register("director2Id", { required: organisatioDetails.parentComponent === "clinic" ? false : true })}
                                label="Director_2 ID"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="text"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director2?.type === "required"}
                                {...register("director2", { required: organisatioDetails.parentComponent === "clinic" ? false : true })}
                                label="Director_2 Name"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="text"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director2Phone?.type === "required"}
                                {...register("director2Phone", { required: true, minLength: 10, maxLength: 10 })}
                                label="Director_2 Ph."
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="number"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{
                                    startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
                                    readOnly: organisatioDetails.readOnly
                                }}
                            />
                            {(errors?.director2Phone?.type === "minLength" || errors?.director2Phone?.type === "maxLength") && (
                                <p className='text-danger'>Cannot exceed 10 number</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.director2Mail?.type === "required"}
                                {...register("director2Mail", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                                label="Director_2 Email"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="email"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {(errors?.director2Mail?.type === "pattern") && (
                                <p className='text-danger'>This is not a valid Email</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact1Name?.type === "required"}
                                {...register("contact1Name", { required: true })}
                                label="Contact_1 Name"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact1Mail?.type === "required"}
                                {...register("contact1Mail", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                                label="Contact_1 Email"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="email"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {(errors?.contact1Mail?.type === "pattern") && (
                                <p className='text-danger'>This is not a valid Email</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact1Address?.type === "required"}
                                {...register("contact1Address", { required: true })}
                                label="Contact_1 Address"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact1Phone?.type === "required"}
                                {...register("contact1Phone", { required: true, minLength: 10, maxLength: 10 })}
                                label="Contact_1 Ph."
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="number"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{
                                    startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
                                    readOnly: organisatioDetails.readOnly
                                }}
                            />
                            {(errors?.contact1Phone?.type === "minLength" || errors?.contact1Phone?.type === "maxLength") && (
                                <p className='text-danger'>Cannot exceed 10 number</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact2Name?.type === "required"}
                                {...register("contact2Name", { required: true })}
                                label="Contact_2 Name"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact2Mail?.type === "required"}
                                {...register("contact2Mail", {
                                    required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                                })}
                                label="Contact_2 Email"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type="email"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{ readOnly: organisatioDetails.readOnly }}
                            />
                            {errors?.contact2Mail?.type === "pattern" && (
                                <p className='text-danger'>This is not a valid email</p>
                            )}
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact2Address?.type === "required"}
                                {...register("contact2Address", { required: true })}
                                label="Contact_2 Address"
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <material.TextField
                                error={errors.contact2Phone?.type === "required"}
                                {...register("contact2Phone", { required: true, minLength: 10, maxLength: 10 })}
                                label="Contact_2 Ph."
                                id="standard-size-small"
                                variant="standard"
                                // defaultValue="Small"
                                size="small"
                                type='number'
                                fullWidth
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                InputProps={{
                                    startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
                                    readOnly: organisatioDetails.readOnly
                                }}
                            />
                            {(errors?.contact2Phone?.type === "minLength" || errors?.contact2Phone?.type === "maxLength") && (
                                <p className='text-danger'>Cannot exceed 10 number</p>
                            )}
                        </div>
                        {/* <div className="col-lg-3 col-md-6 col-sm-12">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <material.DateTimePicker
                                    label="Date&Time"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue)
                                    }}
                                    renderInput={(params) => <material.TextField {...params}
                                        {...register("timeStamp", { required: true })}
                                        variant="standard"
                                        fullWidth
                                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    />}
                                />
                            </LocalizationProvider>
                        </div> */}
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            {organisatioDetails.callFrom === "add" || organisatioDetails.parentComponent === "clinic" ? (
                                <span className='float-end'>
                                    <material.Button variant="contained" size="medium" className=" mt-3 " onClick={handleSubmit(addOrganisation)} disabled={!isValid}>
                                        Save
                                    </material.Button>
                                </span>
                            ) : organisatioDetails.callFrom === "edit" ? (
                                <span className='float-end'>
                                    <material.Button variant="contained" size="medium" className=" mt-3 " onClick={handleSubmit(updateOrganisationDetails)} disabled={!isValid}>
                                        Update
                                    </material.Button>
                                </span>
                            ) : ""}

                        </div>
                    </div>
                </form>
            </material.Paper>


            {/* <PlacesAutocomplete/> */}
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />

        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        userData: state,
    };
};

export default connect(mapStateToProps)(Addorganisation)