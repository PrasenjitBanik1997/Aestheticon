import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addNewPatient, getPatientNote, addPatientHistory } from '../../../services/PatientService';
import Snackbar from '../../toastrmessage/Snackbar';
import { dateAndTimeFormat, dateFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import moment from 'moment';
import ShowPatientNote from '../showPatientNote/ShowPatientNote';
import AddCustomNote from '../../dialog/AddCustomNote';
import AddPatientNote from '../../dialog/AddPatientNote';
import PatientHistory from '../patient-history/PatientHistory';


var patientNoteData = [];
var patientNote;
var patientCustomNote = [];
var allPatientNoteData;

function AddPatient(props) {

    const [dateOfBirth, setDateOfBirth] = React.useState();
    const [date, setDate] = React.useState();
    const [selectGender, setSelectGender] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [openPatientNote, setOpenPatientNote] = useState(false);
    const [hideShow, setHideShow] = useState(false);
    const [patientsHistoryDate, setPatientsHistoryDate] = useState([]);
    const [dateValue, setDateValue] = useState([]);
    const [openCustomNote, setOpenCustomNote] = useState(false);

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
        setSelectGender(patientData ? patientData.gender : selectGender);
        getAllPatientNote()
    }, []);

    const getAllPatientNote = async () => {
        await getPatientNote(patientData.patientId)
            .then((resp) => {
                allPatientNoteData = resp.data;
                let dateOfEntry = resp.data.map((ele) => ele.dateOfEntry);
                setPatientsHistoryDate(dateOfEntry);
            })
    }

    const goBack = () => {
        navigate("/patient-list")
    };

    const changeGender = (event) => {
        setSelectGender(event.target.value)
    };

    const openAddHistory = (data) => {
        setOpenPatientNote(true)
    };

    const addCustomNote = (data) => {
        setOpenCustomNote(true)
    };

    const getPatientHistoryData = (data) => {
        if (data !== "") {
            setHideShow(true)
        }
        let array = [];
        patientNote = data
        array.push(data)
        const outputArray = array.map(obj => {
            const keys = Object.keys(obj);
            let data = keys.map(key => ({ [key]: obj[key] }));
            return data
        });
        patientNoteData = outputArray.flat();
    };

    const getCustomNote = (data) => {
        patientCustomNote.push(data)
        // let obj = { [data.key]: data.value }
        patientNoteData = [...patientNoteData, { [data.key]: data.value }]
    };

    const addPatient = async (fromData) => {
        let obj = {
            "clinicId": userDetails.role === "INJECTOR" ? clinicDetails.clinicId : userDetails.clinicId[0],
            "orgId": userDetails.orgId,
            "title": "as",
            "firstName": fromData.firstName,
            "lastName": fromData.lastName,
            "dateOfBirth": dateFormat(dateOfBirth),
            "gender": selectGender,
            "medicareNumber": fromData.medicareNumber,
            "medicareNumberReference": fromData.medicareNumberReference,
            "medicareExpiry": fromData.medicareExpiry,
            "address": fromData.address,
            "email": fromData.email,
            "phoneNumber": fromData.phoneNumber,
            "dateOfEntry": dateAndTimeFormat(date),
            "history": patientNoteData
        }
        await addNewPatient(obj)
            .then((resp) => {
                reset()
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Patient added successfully",
                })
                getAllPatientNote()
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

    // const showPatientNote = () => {
    //     navigate("/dashboard/patient-list/edit-patient/patient-history", { state: { patientData } });
    // };

    const openTreatmentPlan = () => {
        navigate("/patient-list/edit-patient/treatment-plan", { state: { patientData } })
    };

    const selectDate = (e, value) => {
        let date = moment(value).toISOString()
        let data = allPatientNoteData.filter((ele) => ele.dateOfEntry === value)
        setDateValue(data)
        // console.log(data)
    }

    const addNOte = async () => {
        let obj = {
            "patientId": patientData.patientId,
            "dateOfEntry": moment().format("YYYY-MM-DDTHH:mm:ss"),
            "history": patientNoteData
        }
        await addPatientHistory(obj)
            .then((res) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Note added successfully",
                })
                setHideShow(false)
                getAllPatientNote()
            })
            .catch((error) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
    };


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
                                onChange={changeGender}
                                value={selectGender}
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
                    {patientData.action === "edit" ? (
                        <span className='d-flex flex-row just justify-content-end mt-3'>
                            {hideShow ? (
                                <material.Button variant="contained" className='me-2' onClick={() => addCustomNote({ "action": "addCustomNote" })} startIcon={<material.AddIcon />}>Add-Custom-Note</material.Button>
                            ) : (
                                <material.Button variant="contained" size="medium" onClick={() => openAddHistory({ "action": "addNote" })} startIcon={<material.AddIcon />}>
                                    Add-Note
                                </material.Button>
                            )}
                        </span>
                    ) : null}
                    {patientData.action === "edit" ? (
                        <PatientHistory
                            patientData={patientData}
                        />
                    ) : null}
                    {/* <div className='col-lg-12 col-md-12 col-sm-12'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" className="mt-3" onClick={showHistory}>
                                Next
                            </material.Button>
                        </span>
                    </div> */}
                </div>
                <div className='row mt-5'>
                    <div className='row' hidden={patientData ? patientData.action === "edit" : ""}>
                        <span className='col-lg-6 col-md-6 col-sm-6'><material.Typography variant="h5">Note</material.Typography></span>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <span className='float-end'>
                                {hideShow ? (
                                    <material.Button variant="contained" className='me-2' onClick={() => addCustomNote({ "action": "addCustomNote" })} startIcon={<material.AddIcon />}>Add-Custom-Note</material.Button>
                                ) : (
                                    <material.Button variant="contained" size="medium" onClick={() => openAddHistory({ "action": "addNote" })} startIcon={<material.AddIcon />}>
                                        Add-Note
                                    </material.Button>
                                )}
                            </span>
                        </div>
                    </div>
                    {patientNote ? (
                        <div className='row'>
                            <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                                <material.Typography>Allergies</material.Typography>
                            </div>
                            <div className="col-lg-10 col-md-8 col-sm-6 mb-2 mt-2">
                                <material.TextField
                                    label="Allergies"
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    size="small"
                                    multiline
                                    fullWidth
                                    value={patientNote ? patientNote.allergies : ""}
                                // {...register("allergies")}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                                <material.Typography>Medication</material.Typography>
                            </div>
                            <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                                <material.TextField
                                    multiline
                                    label="Medication"
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    size="small"
                                    fullWidth
                                    value={patientNote ? patientNote.medication : ""}
                                // {...register("medication")}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                                <material.Typography>Diagnosis</material.Typography>
                            </div>
                            <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                                <material.TextField
                                    multiline
                                    label="Diagnosis"
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    size="small"
                                    fullWidth
                                    value={patientNote ? patientNote.diagnosis : ""}
                                // {...register("diagnosis")}
                                />
                            </div>
                        </div>
                    ) : null}
                    {patientCustomNote.length ? patientCustomNote.map((element, i) => (
                        <div className='row' key={i}>
                            <div className='col-lg-2 col-md-4 col-sm-6 mt-2'>
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
                            <material.Button hidden={patientData ? patientData.action === "edit" : ""} variant="contained" size="medium" onClick={handleSubmit(addPatient)} disabled={!isValid}>Save</material.Button>
                            {hideShow ? (
                                <material.Button variant="contained" size="medium" onClick={addNOte}>
                                    Save
                                </material.Button>
                            ) : null}
                        </span>
                    </div>
                </div >
                {patientData.action === "edit" ? (
                    <div className='col-lg-12 col-md-12 col-sm-12 mt-5 pb-5'>
                        <span className='d-flex flex-row just justify-content-end'>
                            <material.Typography sx={{ fontSize: 20, marginRight: 3 }}>Show Patient Note By Date</material.Typography>
                            <material.Autocomplete
                                id="orgId"
                                onChange={selectDate}
                                options={patientsHistoryDate}
                                renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Date"
                                    sx={{ width: 300 }}
                                />}
                            />
                            {/* <material.Button variant="contained" size="medium" onClick={showPatientNote}>
                                Show Patient Note
                            </material.Button> */}
                        </span>
                    </div>
                ) : null}
                {dateValue.length ? (
                    <ShowPatientNote
                        dateValue={dateValue}
                        getAllPatientNote={getAllPatientNote}
                        patientData={patientData}
                    />
                ) : null}
            </material.Paper>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
            <AddPatientNote
                openPatientNote={openPatientNote}
                setOpenPatientNote={setOpenPatientNote}
                getPatientHistoryData={getPatientHistoryData}
            />
            <AddCustomNote
                openCustomNote={openCustomNote}
                setOpenCustomNote={setOpenCustomNote}
                getCustomNote={getCustomNote}
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