import React, { useState, useEffect } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { material } from '../../../library/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { dateAndTimeFormat, dateFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import { updateInjector } from '../../../services/InjectorService';
import Snackbar from '../../toastrmessage/Snackbar';

function EditInjector(props) {

    const location = useLocation();
    let injectorData = location.state ? location.state.injectorData : "";
    const [dateOfBirth, setDateOfBirth] = useState(moment().format("MM-DD-YYYY"));
    const [date, setDate] = useState(moment().format("MM-DD-YYYY HH:mm"));
    const [selectGender, setSelectGender] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
        defaultValues: injectorData ? injectorData : ""
    });


    useEffect(() => {
        setDateOfBirth(injectorData.dateOfBirth ? injectorData.dateOfBirth : dateOfBirth);
        setDate(injectorData.timeStamp ? injectorData.timeStamp : date);
        setSelectGender(injectorData.gender ? injectorData.gender : selectGender);
        console.log(injectorData)
    }, []);

    const goBack = () => {
        navigate("/dashboard/injector-list")
    };

    const handleChange = (event) => {
        setSelectGender(event.target.value)
    };

    const updateInjectorDetails = async (formData) => {
        let obj = {
            userId: injectorData.userId,
            title: "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: dateFormat(dateOfBirth),
            gender: selectGender,
            AHPRA_Reg_ID: formData.AHPRA_Reg_ID,
            address: formData.address,
            email: formData.email,
            phone: formData.phone,
            timeStamp: moment(date, "MM-DD-YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss")
        }
        await updateInjector(obj)
            .then((res) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Injector Updated successfully",
                })
            })
            .catch((error) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
    }

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Edit Injector</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            <material.Paper className='p-4 mt-2' elevation={1}>
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.firstName?.type === "required"}
                            label="First Name"
                            id="standard-error"
                            variant="standard"
                            type="text"
                            size="small"
                            fullWidth
                            // InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("firstName", { required: true, minLength: 3 })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
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
                            // InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("lastName", { required: true, minLength: 3 })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                        />
                        <p className='form-text text-danger'>{errors.lastName?.type === "required" && 'This field is required'}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <material.DesktopDatePicker
                                label="Date of Birth"
                                value={dateOfBirth}
                                onChange={(newValue) => {
                                    setDateOfBirth(dateFormat(newValue))
                                }}
                                renderInput={(params) => <material.TextField {...params}
                                    variant="standard"
                                    fullWidth
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    // InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
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
                            error={errors.AHPRA_Reg_ID?.type === "required"}
                            label="AHPRA Reg ID"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            // InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("AHPRA_Reg_ID", { required: true })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                        />
                        <p className='form-text text-danger'>{errors.AHPRA_Reg_ID?.type === "required" && 'This field is required'}</p>
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
                            // InputProps={{ readOnly: patientData ? true : false }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                        />
                        <p className='form-text text-danger'>{errors.email?.type === "required" && 'This field is required'}</p>
                        {(errors?.email?.type === "pattern") && (
                            <p className='text-danger'>This is not a valid Email</p>
                        )}
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <material.TextField
                            error={errors.phone?.type === "required"}
                            label="Phone Number"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            // InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("phone", { required: true, maxLength: 10 })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                        />
                        {errors?.phone?.type === "minLength" && (
                            <p className='text-danger'>This field only contain 10 digits</p>
                        )}
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
                                    variant="standard"
                                    fullWidth
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    // InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                                />}
                            />
                        </LocalizationProvider>
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
                            // InputProps={{ readOnly: patientData ? true : false }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("address", { required: true })}
                            InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
                        />
                    </div>
                    <div className='col-lg-12 col-md-12 col-sm-12 mt-5' hidden={injectorData.action === "view"}>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(updateInjectorDetails)}>
                                Update
                            </material.Button>
                        </span>
                    </div>
                </div>
            </material.Paper>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
}

export default EditInjector;