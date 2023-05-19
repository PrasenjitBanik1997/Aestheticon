import React, { useEffect, useState } from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import { useNavigate } from 'react-router-dom';
import { getClinicForInjector } from '../../services/ClinicService';
import { connect } from 'react-redux';
import { getClinicAction } from '../../store/action/Action';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#80d8ff",
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


let clinicDetalis;
let clinicId;

function Dashboard(props) {
    const { userData, getClinicDetails } = props;
    let userDetails = userData.authReducer.data;
    const navigate = useNavigate();
    const [hideAndShow, setHideAndShow] = useState(true);
    const [clinicName, setClinicName] = useState([])

    useEffect(() => {
        // if (userDetails.role === "INJECTOR") {
        //     clinicDetailsForInjector()
        // }
    }, []);

    // const clinicDetailsForInjector = async () => {
    //     await getClinicForInjector()
    //         .then((resp) => {
    //             clinicDetalis = resp.data;
    //             let clinicName = clinicDetalis.map((ele) => ele.clinicName);
    //             setClinicName(clinicName)
    //         })
    //         .catch((error) => {

    //         })
    // };

    const handleClick = (value) => {
        if (value.action === "patientManagement") {
            navigate("/dashboard/patient-list");
        } else if (value.action === "injectorManagement") {
            navigate("/dashboard/injector-list");
        } else if (value.action === "approvalWaiting") {
            navigate("/dashboard/approval-waiting-quere");
        } else if (value.action === "approvalRequest") {
            navigate("/dashboard/approval-requests");
        } else if (value.action === "watingRoom") {
            navigate("/dashboard/waiting-room");
        }
    };

    // const selectClinic = (e, value) => {
    //     let clinicData = clinicDetalis.filter((ele) => ele.clinicName === value);
    //     clinicId = clinicData.map((resp) => resp.clinicId)
    //     getClinicDetails(...clinicData);
    //     navigate("/dashboard/patient-list");
    // };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                {/* <div className='col-12'>
                    <ClinicList />
                </div> */}
                <div className='col-lg-3 col-md-6 col-sm-12 mt-3' hidden={userDetails.role === "PRESCRIBER"}>
                    <material.Card sx={{ backgroundColor: "lightblue" }}>
                        <material.CardActionArea onClick={() => handleClick({ "action": "patientManagement" })} sx={{ pt: 3, pb: 3 }}>
                            <material.CardContent>
                                <h6 className='text-center'>Patient Management</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                    {/* <div hidden={hideAndShow}>
                        <material.Autocomplete
                            id="orgId"
                            className='mt-3'
                            onChange={selectClinic}
                            options={clinicName}
                            renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Clinic Name"
                            />}
                        />
                    </div> */}
                </div>
                {userDetails.role === "MANAGER" ? (
                    <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                        <material.Card sx={{ backgroundColor: "lightblue" }}>
                            <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "injectorManagement" })}>
                                <material.CardContent>
                                    <h6 className='text-center'>Injector Management</h6>
                                </material.CardContent>
                            </material.CardActionArea>
                        </material.Card>
                    </div>
                ) : userDetails.role === "INJECTOR" ? (
                    <>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Stocks</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Current Running Procedures</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "approvalWaiting" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Approval Waiting Quere</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "approvalRequest" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Approved Requests</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        {/* </div> */}
                    </>
                ) : userDetails.role === "PRESCRIBER" ? (
                    <>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "watingRoom" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Waiting Room</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "previouslyApproved" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Previously Approved / Rejected Request</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getClinicDetails: (data) => {
            dispatch(getClinicAction(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);