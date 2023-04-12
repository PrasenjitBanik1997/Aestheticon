import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProtectRoute(props) {

    const { Component, userData } = props;
    const naviget = useNavigate();
    let userDetails = userData.authReducer.data;

    useEffect(() => {
        if (!userDetails.token) {
            naviget("/login")
        }
    });

    return (
        <div>
            <Component />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
    };
};

export default connect(mapStateToProps)(ProtectRoute);