import React from 'react';
import { material } from '../../library/material';
import { NavLink } from 'react-router-dom';
import "./Sidenav.css"
import { connect } from 'react-redux';

function Sidenav(props) {

    const { open, setOpen, user } = props;

    let userDetails = user.authReducer.data

    function expend() {
        setOpen(true)
    }

    function collapse() {
        setOpen(false)
    }

    return (
        <material.Paper elevation={5} style={{ height: '100vh', cursor: 'pointer', backgroundColor: "lightgray" }} onMouseEnter={expend} onMouseLeave={collapse}>
            <div className='side-nav'>
                {userDetails.role === "SUPERADMIN" ? (
                    <>
                        <div>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/organisation">
                                <material.ApartmentIcon sx={{ fontSize: "60px", padding: "10px" }} />{open === true ? (<span className='ms-2' style={{ fontSize: "20px" }}>Organisation</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-1'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/user_management" >
                                <material.ManageAccountsIcon sx={{ fontSize: "60px", padding: "10px" }} /> {open === true ? (<span className='ms-2' style={{ fontSize: "20px" }}>Usermanagement</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "ADMIN" ? (<>
                    <div className='mt-1'>
                        <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/clinic" >
                            <material.MedicalServicesOutlinedIcon sx={{ fontSize: "60px", padding: "10px" }} /> {open === true ? (<span className='ms-2' style={{ fontSize: "20px" }}>Clinic</span>) : null}
                        </NavLink>
                    </div>
                </>):""}
            </div>
        </material.Paper>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state,
    };
};

export default connect(mapStateToProps)(Sidenav);
