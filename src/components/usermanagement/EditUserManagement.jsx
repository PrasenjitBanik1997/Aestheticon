import React, { useEffect, useState } from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { dateFormat, localDateTimeFormat } from '../../date-and-time-format/DateAndTimeFormat';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateInjector } from '../../services/UserManagementService';


function EditUserMangement(props) {

    const [dateOfBirth, setDateOfBirth] = useState(moment().format("MM-DD-YYYY"));
    const [date, setDate] = useState(moment().format("MM-DD-YYYY HH:mm"));
    const [selectGender, setSelectGender] = useState('');

    const location = useLocation();
    let userData = location.state ? location.state.userData : "";

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
        defaultValues: userData
    });

    const navigate = useNavigate();

    useEffect(() => {
        setDateOfBirth(userData.dateOfBirth ? userData.dateOfBirth : dateOfBirth);
        setDate(userData.createdAt ? userData.createdAt : date);
        setSelectGender(userData.gender ? userData.gender : selectGender)
    }, [])

    const goBack = () => {
        navigate("/user_management")
    }

    const changeGender = (event) => {
        setSelectGender(event.target.value)
    };

    const updateserDetails = async (formData) => {
        let obj = {
            userId: userData.userId,
            title: "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: dateFormat(dateOfBirth),
            gender: selectGender,
            AHPRA_Reg_ID: formData.AHPRA_Reg_ID,
            address: formData.address,
            email: formData.email,
            phone: formData.phone,
            timeStamp: moment(date).format("YYYY-MM-DDTHH:mm:ss")
        }
        await updateInjector(obj)
            .then((res) => {

            })
            .catch((error) => {

            })
        // console.log({ ...fromData, dateOfBirth: dateOfBirth, createdAt: moment(date).format("YYYY-MM-DDTHH:mm A"), gender: selectGender })
    }

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Edit User Management</material.Typography></span>
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
                            InputProps={{ readOnly: userData.readOnly }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("firstName", { required: true, minLength: 3 })}
                        // InputProps={{ readOnly: injectorData.action === "view" ? true : false }}
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
                            InputProps={{ readOnly: userData.readOnly }}
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
                                    setDateOfBirth(dateFormat(newValue))
                                }}
                                renderInput={(params) => <material.TextField {...params}
                                    variant="standard"
                                    fullWidth
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    // InputProps={{ readOnly: userData.readOnly }}
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
                            error={errors.AHPRA_Reg_ID?.type === "required"}
                            label="AHPRA Reg ID"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: userData.readOnly }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("AHPRA_Reg_ID", { required: true })}
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
                            InputProps={{ readOnly: userData.readOnly }}
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
                            error={errors.phone?.type === "required"}
                            label="Phone Number"
                            id="standard-error"
                            variant="standard"
                            type="number"
                            size="small"
                            fullWidth
                            InputProps={{ readOnly: userData.readOnly }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("phone", { required: true, maxLength: 10 })}
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
                                    // InputProps={{ readOnly: userData.readOnly }}
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
                            InputProps={{ readOnly: userData.readOnly }}
                            inputProps={{ style: { textTransform: 'capitalize' } }}
                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                            {...register("address", { required: true })}
                        />
                    </div>
                    <div className='col-lg-12 col-md-12 col-sm-12 mt-5'>
                        <span className='float-end' hidden={userData.readOnly}>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(updateserDetails)}>
                                Update
                            </material.Button>
                        </span>
                    </div>
                </div>
            </material.Paper>
        </div>
    );
}

export default EditUserMangement;