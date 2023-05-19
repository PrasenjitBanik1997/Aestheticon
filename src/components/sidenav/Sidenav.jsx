import React from 'react';
import { material } from '../../library/material';
import { NavLink } from 'react-router-dom';
import "./Sidenav.css"
import { connect } from 'react-redux';
import { mt } from 'date-fns/locale';

function Sidenav(props) {

    const { openSideNav, setOpenSideNav, userData, clinicData } = props;

    let userDetails = userData.authReducer.data
    let clinicDetails = clinicData.clinicReducer.data;

    function expend() {
        setOpenSideNav(true)
    }

    function collapse() {
        setOpenSideNav(false)
    }

    return (
        <material.Paper elevation={5} style={{ height: '100vh', cursor: 'pointer', backgroundColor: "lightgray" }} onMouseEnter={expend} onMouseLeave={collapse}>
            <div className='side-nav'>
                {userDetails.role === "SUPERADMIN" ? (
                    <>
                        <div>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/organisation">
                                <material.ApartmentIcon sx={{ fontSize: 35, ml: 2 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Organisation</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/user_management" >
                                <material.ManageAccountsIcon sx={{ fontSize: 35, ml: 2 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>User Management</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "ADMIN" ? (
                    <>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/clinic" >
                                <material.MedicalServicesOutlinedIcon sx={{ fontSize: 35, ml: 2 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Clinic</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/user_management" >
                                <material.ManageAccountsIcon sx={{ fontSize: 35, ml: 2 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>User Management</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "MANAGER" || clinicDetails.clinicName || userDetails.role === "PRESCRIBER" ? (
                    <>
                        <div>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/dashboard">
                                <material.DashboardIcon sx={{ fontSize: 35, ml: 2 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Dashboard</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "INJECTOR" ? (
                    <div className='mt-3' hidden={clinicDetails.clinicName}>
                        <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/clinic" >
                            <material.MedicalServicesOutlinedIcon sx={{ fontSize: 35, ml: 2 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Clinic</span>) : null}
                        </NavLink>
                    </div>
                ) : ""}
            </div>
        </material.Paper>
    )
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(Sidenav);
