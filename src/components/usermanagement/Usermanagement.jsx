import React from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import InviteUser from '../dialog/InviteUser';

const Usermanagement = () => {

    const [open, setOpen] = React.useState(false);

    const openInviteDialog=()=>{
        setOpen(true)
    }

    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    <span><material.Typography variant="h5">Usermanagement</material.Typography>
                    </span>
                </div>
                <div className="col-6">
                    <span className="float-end">
                        <material.Button variant="contained"  startIcon={<material.PersonIcon />} onClick={openInviteDialog}>Invite-User</material.Button>
                    </span>
                </div>
            </div>
            <InviteUser 
            open={open}
            setOpen={setOpen}
            />
        </div>
    );
};

export default Usermanagement;