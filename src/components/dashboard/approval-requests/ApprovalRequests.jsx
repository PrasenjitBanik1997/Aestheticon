import React from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useNavigate } from 'react-router-dom';

function ApprovalRequests(props) {

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/dashboard")
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Approval Requests</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ApprovalRequests;