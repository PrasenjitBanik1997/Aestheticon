import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addNewPatient } from '../../../services/PatientService';
import Snackbar from '../../toastrmessage/Snackbar';
import { dateAndTimeFormat, dateFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import AddPatientHistory from '../../dialog/AddPatientHistory';


let patientHistory = [];
let history = [];

function AddPatient(props) {

    const [dateOfBirth, setDateOfBirth] = React.useState();
    const [date, setDate] = React.useState();
    const [selectValue, setSelectValue] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [openHistory, setOpenHistory] = useState(false);

    const { userData, clinicData } = props;
    let userDetails = userData.authReducer.data;
    let clinicDetails = clinicData.clinicReducer.data;

    const navigate = useNavigate();
    const location = useLocation();

    let patientData = location.state ? location.state.patientData : "";
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
        defaultValues: patientData ? patientData : ""
    });

    useEffect(() => {
        setDateOfBirth(patientData ? patientData.dateOfBirth : dateOfBirth);
        setDate(patientData ? patientData.createdAt : date);
        setSelectValue(patientData ? patientData.gender : selectValue);
        console.log(userDetails)
    });

    const goBack = () => {
        navigate("/dashboard/patient-list")
    };

    const getPatientHistoryData = (data) => {
        patientHistory.push(data)
        let obj = {}
        obj[data.key] = data.value
        history.push(obj)
    };

    const addPatient = async (fromData) => {
        let obj = {
            "clinicId": userDetails.role === "INJECTOR" ? clinicDetails.clinicId : userDetails.clinicId[0],
            "orgId": userDetails.orgId,
            "title": "as",
            "firstName": fromData.firstName,
            "lastName": fromData.lastName,
            "dateOfBirth": dateFormat(dateOfBirth),
            "gender": selectValue,
            "medicareNumber": fromData.medicareNumber,
            "medicareNumberReference": fromData.medicareNumberReference,
            "medicareExpiry": fromData.medicareExpiry,
            "address": fromData.address,
            "email": fromData.email,
            "phoneNumber": fromData.phoneNumber,
            "dateOfEntry": dateAndTimeFormat(date),
            "history": history
        }
        await addNewPatient(obj)
            .then((resp) => {
                reset()
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Patient added successfully",
                })
                console.log(resp)
            })
            .catch((error) => {
                console.log(error)
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
    };

    const handleChange = (event) => {
        setSelectValue(event.target.value)
    };

    const showPatientHistory = () => {
        navigate("/dashboard/patient-list/edit-patient/patient-history", { state: { patientData } });
    };

    const openAddHistory = () => {
        setOpenHistory(true)
    };

    const openTreatmentPlan = () => {
        navigate("/dashboard/patient-list/edit-patient/treatment-plan", { state: { patientData } })
    }


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    {patientData ? (
                        <span><material.Typography variant="h5">Show Patient Details</material.Typography></span>
                    ) : (
                        <span><material.Typography variant="h5">Add Patient</material.Typography></span>
                    )}
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        {userDetails.role === "INJECTOR" ? (
                            <material.Button variant="contained" className='me-2' onClick={openTreatmentPlan} startIcon={<material.ScheduleIcon />} hidden={!patientData} >Schedule Treatment</material.Button>
                        ) : ""}
                        <material.Button variant="contained" onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            <material.Paper className='p-4 mt-2' elevation={1}>
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            label="Organisation ID"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            value={userDetails.orgId}
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            label="Clinic ID"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            value={userDetails.role === "INJECTOR" ? clinicDetails.clinicId : userDetails.clinicId[0]}
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <material.DateTimePicker
                                label="Date Of Entry"
                                value={date}
                                onChange={(newValue) => {
                                    setDate(newValue)
                                }}
                                renderInput={(params) => <material.TextField {...params}
                                    error={errors.dateOfEntry?.type === "required"}
                                    {...register("dateOfEntry", { required: true })}
                                    variant="standard"
                                    fullWidth
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.firstName?.type === "required"}
                            label="First Name"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("firstName", { required: true, minLength: 3 })}
                        />
                        <p className='form-text text-danger'>{errors.firstName?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.lastName?.type === "required"}
                            label="Last Name"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("lastName", { required: true, minLength: 3 })}
                        />
                        <p className='form-text text-danger'>{errors.lastName?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
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
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.FormControl sx={{ marginTop: 4 }}>
                            <material.RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={handleChange}
                                value={selectValue}
                            >
                                <material.FormControlLabel value="MALE" control={<material.Radio color="secondary" />} label="Male" />
                                <material.FormControlLabel value="FEMALE" control={<material.Radio color="secondary" />} label="Female" />
                                <material.FormControlLabel value="TRANSGENDER" control={<material.Radio color="secondary" />} label="Other" />
                            </material.RadioGroup>
                        </material.FormControl>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.medicareNumber?.type === "required"}
                            label="Medicare Number"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("medicareNumber", { required: true })}
                        />
                        <p className='form-text text-danger'>{errors.medicareNumber?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.medicareNumberReference?.type === "required"}
                            label="Medicare Reference Number"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("medicareNumberReference", { required: true })}
                        />
                        <p className='form-text text-danger'>{errors.medicareNumberReference?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.medicareExpiry?.type === "required"}
                            label="Medicare Expiry"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("medicareExpiry", { required: true })}
                        />
                        <p className='form-text text-danger'>{errors.medicareExpiry?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.email?.type === "required"}
                            label="Email ID"
                            id="standard-error"
                            variant="standard"
                            type="email"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                        />
                        <p className='form-text text-danger'>{errors.email?.type === "required" && 'This field is required'}</p>
                        {(errors?.email?.type === "pattern") && (
                            <p className='text-danger'>This is not a valid Email</p>
                        )}
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.phoneNumber?.type === "required"}
                            label="Phone Number"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("phoneNumber", { required: true, maxLength: 10 })}
                        />
                        {errors?.phoneNumber?.type === "minLength" && (
                            <p className='text-danger'>This field only contain 10 digits</p>
                        )}
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <material.TextField
                            error={errors.address?.type === "required"}
                            label="Address"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("address", { required: true })}
                        />
                    </div>
                    {/* <div className='col-lg-12 col-md-12 col-sm-12'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" className="mt-3" onClick={showHistory}>
                                Next
                            </material.Button>
                        </span>
                    </div> */}
                </div>
                <div className='row mt-5' hidden={patientData ? patientData.action === "edit" : ""}>
                    <span className='col-lg-6 col-md-6 col-sm-6'><material.Typography variant="h5">History</material.Typography></span>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" onClick={openAddHistory} startIcon={<material.AddIcon />}>
                                Add-History
                            </material.Button>
                        </span>
                    </div>
                    {patientHistory.length ? patientHistory.map((element, i) => (
                        <div className='row' key={i}>
                            <div className='col-lg-2 col-md-4 col-sm-6 mt-3'>
                                <material.Typography>{element ? element.key : ""}</material.Typography>
                            </div>
                            <div className='col-lg-10 col-md-8 col-sm-6'>
                                <material.TextField
                                    error={errors.allergies?.type === "required"}
                                    label={element ? element.key : ""}
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    size="small"
                                    multiline
                                    fullWidth
                                    value={element ? element.value : ""}
                                    InputProps={{ readOnly: true }}
                                    inputProps={{ style: { textTransform: 'capitalize' } }}
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                />
                            </div>
                        </div>
                    )) : ""}
                    <div className='col-lg-12 col-md-12 col-sm-12 mt-5'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(addPatient)} disabled={!isValid}>
                                Save
                            </material.Button>
                        </span>
                    </div>
                </div >
                {patientData.action === "edit" ? (
                    <div className='mt-5 pb-5'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" onClick={showPatientHistory}>
                                Show Patient History
                            </material.Button>
                        </span>
                    </div>
                ) : null
                }
            </material.Paper>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
            <AddPatientHistory
                openHistory={openHistory}
                setOpenHistory={setOpenHistory}
                getPatientHistoryData={getPatientHistoryData}
            />
        </div >
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(AddPatient);