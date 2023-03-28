import React, { useState } from 'react'
import { material } from '../../library/material'
import { useForm } from "react-hook-form"
import { getInviteDetails, registerByInvite } from '../../services/OrganisationService';


function AddorgByInvite() {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: "onTouched"
  });
  const [isEnableFormField, setisEnableFormField] = useState(true);
  const addOrganisation = async (formData) => {
   console.log(formData)
   await registerByInvite(formData).then((res)=>{
    console.log(res)
   })
  }

  const checkInviteCode = async (event) => {
    let obj = { inviteCode: event.target.value };
    // setTimeout(() => {
     await getInviteDetails(obj).then((res) => {
        setisEnableFormField(false)
        reset({email:res.data.email,role:res.data.role})
      }).catch((err) => {
        setisEnableFormField(true)
        console.log(err)
      })
    // },3000)


  }





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
                inputProps={{style: {textTransform: 'capitalize'}}}
                sx={{ marginTop: { xs: 3, sm: 3, md: 3 },textTransform:"capitalize" }}
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
                inputProps={{style: {textTransform: 'capitalize'}}}
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
                inputProps={{style: {textTransform: 'capitalize'}}}
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
                inputProps={{style: {textTransform: 'capitalize'}}}
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
                InputLabelProps={{shrink:true}}
                InputProps={{readOnly:true}}
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
                InputLabelProps={{ shrink:true}}
                InputProps={{readOnly:true}}
              />
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
              <span className='float-end'><material.Button variant="contained" size="medium" className=" mt-3 " onClick={handleSubmit(addOrganisation)} disabled={!isValid}>Submit</material.Button></span>
            </div>
          </div>
        </form>
      </material.Paper>
    </div>
  )
}

export default AddorgByInvite