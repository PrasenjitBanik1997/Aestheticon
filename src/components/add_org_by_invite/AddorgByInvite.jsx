import React, { useState } from 'react'
import { material } from '../../library/material'
import { useForm } from "react-hook-form"
import { getInviteDetails, registerByInvite } from '../../services/OrganisationService';
import Snackbar from '../toastrmessage/Snackbar';
import { useNavigate } from 'react-router-dom';
import { dateFormat, dateAndTimeFormat } from '../../date-and-time-format/DateAndTimeFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

var userRole;

function AddorgByInvite() {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: "onTouched"
  });
  const navigate = useNavigate();
  const [isEnableFormField, setisEnableFormField] = useState(true);
  const [openSnackBar, setOpenSnackBar] = useState({
    "action": false,
    "type": "",
    "message": "",
  });
  const [dateOfBirth, setDateOfBirth] = React.useState();
  const [date, setDate] = React.useState();
  const [selectGender, setSelectGender] = useState('');
  const [endDate, setEndDate] = React.useState();
  const [startDate, setStartDate] = React.useState();


  const checkInviteCode = async (event) => {
    let obj = { inviteCode: event.target.value };
    // setTimeout(() => {
    await getInviteDetails(obj).then((res) => {
      setisEnableFormField(false)
      userRole = res.data.role;
      reset({ email: res.data.email, role: res.data.role })
    }).catch((err) => {
      setisEnableFormField(true)
    })
    // },3000)
  };

  const changeGender = (event) => {
    setSelectGender(event.target.value)
  };

  const addOrganisation = async (formData) => {
    if (userRole === "PRESCRIBER") {
      let obj = {
        ...formData,
        dateOfBirth: dateFormat(dateOfBirth),
        gender: selectGender,
        startDate: dateFormat(startDate),
        endDate: dateFormat(endDate),
        timeStamp: dateAndTimeFormat(date)
      }
      await registerByInvite(obj).then((res) => {
        setOpenSnackBar({
          "action": true,
          "type": "success",
          "message": "Your registration successful",
        })
        navigate("/login");
      })
        .catch((error) => {
          setOpenSnackBar({
            "action": true,
            "type": "error",
            "message": "Invalid Credentiall",
          })
        })
    } else {
      await registerByInvite({ ...formData, dateOfBirth: dateFormat(dateOfBirth) }).then((res) => {
        setOpenSnackBar({
          "action": true,
          "type": "success",
          "message": "Your registration successful",
        })
        navigate("/login");
      })
        .catch((error) => {
          setOpenSnackBar({
            "action": true,
            "type": "error",
            "message": "Invalid Credentiall",
          })
        })
    }
  };

  return (
    <div className='p-4 mt-2' >
      <material.Paper className='p-4 mt-2' elevation={1}>
        <form >
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.inviteCode?.type === "required"}
                {...register("inviteCode", { required: true })}
                label="Enter Invite Code"
                id="standard-error"
                variant="standard"
                type="text"
                // defaultValue="Small"
                onChange={checkInviteCode}
                size="small"
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
              />
            </div>
          </div>
          <div className="row">
            {userRole !== "PRESCRIBER" ? (
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.orgName?.type === "required"}
                    {...register("orgName", { required: true })}
                    label="Organisation Name"
                    id="standard-error"
                    variant="standard"
                    type="text"
                    // defaultValue="Small"
                    size="small"
                    disabled={isEnableFormField}
                    fullWidth
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 }, textTransform: "capitalize" }}
                  />
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.director1Id?.type === "required"}
                    {...register("director1Id", { required: true })}
                    label="Director_1 ID"
                    id="standard-size-small"
                    variant="standard"
                    // defaultValue="Small"
                    size="small"
                    type='text'
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.director1?.type === "required"}
                    {...register("director1", { required: true })}
                    label="Director_1 Name"
                    id="standard-size-small"
                    variant="standard"
                    // defaultValue="Small"
                    size="small"
                    type="text"
                    disabled={isEnableFormField}
                    fullWidth
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                    InputProps={{
                      startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.director2Id?.type === "required"}
                    {...register("director2Id", { required: true })}
                    label="Director_2 ID"
                    id="standard-size-small"
                    variant="standard"
                    // defaultValue="Small"
                    size="small"
                    type="text"
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.director2?.type === "required"}
                    {...register("director2", { required: true })}
                    label="Director_2 Name"
                    id="standard-size-small"
                    variant="standard"
                    // defaultValue="Small"
                    size="small"
                    type="text"
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                    InputProps={{
                      startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
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
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    type="email"
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    fullWidth
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    error={errors.contact1Mail?.type === "required"}
                    {...register("contact1Mail", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                    label="Contact_1 Email"
                    id="standard-size-small"
                    variant="standard"
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    type="email"
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                    InputProps={{
                      startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
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
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
                    // defaultValue="Small"
                    size="small"
                    type="email"
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
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
                    disabled={isEnableFormField}
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
                    disabled={isEnableFormField}
                    fullWidth
                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                    InputProps={{
                      startAdornment: <material.InputAdornment sx={{ marginBottom: 2.6 }} position="start">+61</material.InputAdornment>,
                    }}
                  />
                  {(errors?.contact2Phone?.type === "minLength" || errors?.contact2Phone?.type === "maxLength") && (
                    <p className='text-danger'>Cannot exceed 10 number</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.FormControl sx={{ marginTop: 4 }}>
                    <material.RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={changeGender}
                      value={selectGender}
                    >
                      <material.FormControlLabel disabled={isEnableFormField} value="MALE" control={<material.Radio color="secondary" />} label="Male" />
                      <material.FormControlLabel disabled={isEnableFormField} value="FEMALE" control={<material.Radio color="secondary" />} label="Female" />
                      <material.FormControlLabel disabled={isEnableFormField} value="TRANSGENDER" control={<material.Radio color="secondary" />} label="Other" />
                    </material.RadioGroup>
                  </material.FormControl>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    {...register("AHPRA_Reg_ID", { required: true })}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="AHPRA Reg ID"
                    type="number"
                    fullWidth
                    disabled={isEnableFormField}
                    variant="standard"
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    {...register("address", { required: true })}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Address"
                    type="text"
                    disabled={isEnableFormField}
                    fullWidth
                    variant="standard"
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <material.TextField
                    {...register("phone", { required: true })}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Phone"
                    disabled={isEnableFormField}
                    type="number"
                    fullWidth
                    variant="standard"
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <material.DesktopDatePicker
                      label="Start Date"
                      readOnly
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue)
                      }}
                      renderInput={(params) => <material.TextField {...params}
                        variant="standard"
                        fullWidth
                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                        InputProps={{ readOnly: true }}
                        disabled={isEnableFormField}
                      />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <material.DesktopDatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue)
                      }}
                      renderInput={(params) => <material.TextField {...params}
                        variant="standard"
                        fullWidth
                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                        disabled={isEnableFormField}
                      />}
                    />
                  </LocalizationProvider>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <material.DateTimePicker
                      label="Time Stamp"
                      readOnly
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue)
                      }}
                      renderInput={(params) => <material.TextField {...params}
                        variant="standard"
                        fullWidth
                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                        InputProps={{ readOnly: true }}
                        disabled={isEnableFormField}
                      />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            )}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.role?.type === "required"}
                {...register("role", { required: true })}
                label="Role"
                id="standard-size-small"
                variant="standard"
                // defaultValue={value.role}
                size="small"
                type='text'
                disabled={isEnableFormField}
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.password?.type === "required"}
                {...register("password", { required: true })}
                label="Password"
                id="standard-size-small"
                variant="standard"
                // defaultValue="Small"
                size="small"
                type='text'
                disabled={isEnableFormField}
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.password?.type === "required"}
                {...register("email", { required: true })}
                label="User Id"
                id="standard-size-small"
                variant="standard"
                // defaultValue={value.email}
                size="small"
                type='text'
                disabled={isEnableFormField}
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.password?.type === "required"}
                {...register("firstName", { required: true })}
                label="First Name"
                id="standard-size-small"
                variant="standard"
                // defaultValue={value.email}
                size="small"
                type='text'
                disabled={isEnableFormField}
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
              // InputProps={{ readOnly: true }}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <material.TextField
                error={errors.password?.type === "required"}
                {...register("lastName", { required: true })}
                label="Last Name"
                id="standard-size-small"
                variant="standard"
                // defaultValue={value.email}
                size="small"
                type='text'
                disabled={isEnableFormField}
                fullWidth
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
              // InputProps={{ readOnly: true }}
              />
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
                    disabled={isEnableFormField}
                  />}
                />
              </LocalizationProvider>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <span className='float-end'><material.Button variant="contained" size="medium" className=" mt-3 " onClick={handleSubmit(addOrganisation)} disabled={!isValid}>Submit</material.Button></span>
            </div>
          </div>
        </form>
      </material.Paper>
      <Snackbar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      />
    </div>
  )
}

export default AddorgByInvite