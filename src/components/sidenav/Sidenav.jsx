import React from 'react';
import { material } from '../../library/material';
import { NavLink } from 'react-router-dom';
import "./Sidenav.css"
import { connect } from 'react-redux';


function Sidenav(props) {

    const { openSideNav, setOpenSideNav, userData, clinicData } = props;

    let userDetails = userData.authReducer.data;
    let clinicDetails = clinicData.clinicReducer.data;

    function expend() {
        setOpenSideNav(true)
    }

    function collapse() {
        setOpenSideNav(false)
    }

    return (
        <material.Paper elevation={5} style={{ height: '100vh', cursor: 'pointer', backgroundColor: "rgb(197, 192, 192)" }} onMouseEnter={expend} onMouseLeave={collapse}>
            <div className='side-nav'>
                {userDetails.role === "SUPERADMIN" ? (
                    <>
                        <div>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/organisation">
                                <material.ApartmentIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Organisation</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/user_management" >
                                <material.ManageAccountsIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>User Management</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "ADMIN" ? (
                    <>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/clinic" >
                                <material.MedicalServicesOutlinedIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Clinic</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/user_management" >
                                <material.ManageAccountsIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>User Management</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/stocks" >
                                <material.InventoryIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Stocks</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "PRESCRIBER" ? (
                    <>
                        <div>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/waiting-room">
                                <material.HourglassTopIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Waiting Room</span>) : null}
                            </NavLink>
                        </div>
                    </>
                ) : userDetails.role === "INJECTOR" ? (
                    <>
                        <div className='mt-3' hidden={clinicDetails.clinicName}>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/clinic" >
                                <material.MedicalServicesOutlinedIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Clinic</span>) : null}
                            </NavLink>
                        </div>
                        <div hidden={!clinicDetails.clinicName}>
                            <div className='mt-3'>
                                <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/patient-list">
                                    <material.FormatListBulletedIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Patients List</span>) : null}
                                </NavLink>
                            </div>
                            {/* <div className='mt-3'>
                                <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/Stocks">
                                    <material.InventoryIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Stocks</span>) : null}
                                </NavLink>
                            </div> */}
                            <div className='mt-3'>
                                <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/approval-waiting-quere">
                                    <material.HourglassTopIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Waiting Queue</span>) : null}
                                </NavLink>
                            </div>
                        </div>
                    </>
                ) : userDetails.role === "MANAGER" ? (
                    <>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/injector-list">
                                <material.FormatListBulletedIcon sx={{ fontSize: 35, ml: 1 }} />{openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Injector List</span>) : null}
                            </NavLink>
                        </div>
                        <div className='mt-3'>
                            <NavLink className={(navData) => (navData.isActive ? 'sideNav-text' : 'text-content')} to="/stocks" >
                                <material.InventoryIcon sx={{ fontSize: 35, ml: 1 }} /> {openSideNav === true ? (<span className='ms-2' style={{ fontSize: "18px", fontWeight: "bold" }}>Stocks</span>) : null}
                            </NavLink>
                        </div>
                    </>
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
