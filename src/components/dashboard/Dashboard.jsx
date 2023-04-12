import React from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import { useNavigate } from 'react-router-dom';

function Dashboard(props) {

    const navigate = useNavigate();

    const openPatientManagement = () => {
        navigate("/dashboard/patient-list")
    }

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-3'>
                    <material.Card sx={{ pt: 3, pb: 3, backgroundColor:"rgb(228, 251, 228)" }}>
                        <material.CardActionArea onClick={openPatientManagement}>
                            <material.CardContent>
                                <h6 className='text-center'>Patient Management</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                </div>
                <div className='col-3'>
                    <material.Card sx={{ pt: 3, pb: 3, backgroundColor:"rgb(228, 251, 228)" }}>
                        <material.CardActionArea>
                            <material.CardContent>
                                <h6 className='text-center'>Incoming Request</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                </div>
                <div className='col-3'>
                    <material.Card sx={{ pt: 3, pb: 3, backgroundColor:"rgb(228, 251, 228)" }}>
                        <material.CardActionArea>
                            <material.CardContent>
                                <h6 className='text-center'>Current Running Procedures</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                </div>
                <div className='col-3'>
                    <material.Card sx={{ pt: 3, pb: 3, backgroundColor:"rgb(228, 251, 228)" }}>
                        <material.CardActionArea>
                            <material.CardContent>
                                <h6 className='text-center'>User Management</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;