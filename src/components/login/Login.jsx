/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react'
import { material } from '../../library/material'
import "./Login.css"
import logo from '../../assets/medical-logo.jpg'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { userLogin } from '../../services/LoginService'
import { connect } from 'react-redux';
import { loginAction } from '../../store/action/Action'
import Snackbar from '../toastrmessage/Snackbar'

function Login(props) {

  const { authLogin } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [Type, setType] = useState("password");
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm();
  const [openSnackBar, setOpenSnackBar] = useState({
    "action": false,
    "type": "",
    "message": "",
  });
  const navigate = useNavigate();

  function showPassword() {
    setIsVisible(!isVisible)
    setType("text")
  }

  function hidePassword() {
    setIsVisible(!isVisible)
    setType("password")
  }

  async function login(formData) {
    await userLogin(formData)
      .then((res) => {
        authLogin(res.data)
        setOpenSnackBar({
          "action": true,
          "type": "success",
          "message": "You have succesfully logedin",
        })
        setTimeout(()=>{
          navigate("/organisation")
          reset()
        },500)
       
      }).catch(() => {
        setOpenSnackBar({
          "action": true,
          "type": "error",
          "message": "Invalid Credentiall",
        })
      })

  }






  return (
    <div>
      <div className="wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="text-center mt-4 name">
          Aesthetion
        </div>
        <form className="p-3 mt-3">
          <div className="form-field d-flex align-items-center">
            <span ><material.PermIdentityIcon /></span>
            <input type="text" name="userName" id="userName" placeholder="Email" {...register("email", { required: true })} />
          </div>
          <div className="errmsg align-items-center">{errors.userId && <span>This field is required</span>}</div>
          <div className="form-field d-flex align-items-center">
            <span><material.KeyOutlinedIcon /></span>
            <input type={Type} name="password" id="pwd" placeholder="Password" {...register("password", { required: true })} />
            {isVisible === false ? (<span className='me-2'><material.VisibilityIcon onClick={showPassword} /></span>) : (<span className='me-2'><material.VisibilityOffIcon onClick={hidePassword} /></span>)}
          </div>
          <div className="errmsg  align-items-center">{errors.password && <span>This field is required</span>}</div>

          <button className="btn mt-3" onClick={handleSubmit(login)} disabled={!isValid}>Login</button>
        </form>
        <div className="text-center row fs-6">
          <div className="col-6"><a href="/registerorganisation">Register by invite code</a></div>
          <div className="col-6"> <a href="#">Forget password?</a> </div>

        </div>
      </div>
      <Snackbar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      />
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authLogin: (data) => {
      dispatch(loginAction(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

