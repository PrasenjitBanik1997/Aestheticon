import React, { useEffect, useState } from 'react'
import { styled } from "@mui/material/styles";
import { material } from '../../library/material'
import { connect } from 'react-redux';
import { logoutAction } from '../../store/action/Action';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../socket/Socket';
import Snackbar from '../toastrmessage/Snackbar';
import CallNotification from '../toastrmessage/CallNotification';

const Header = styled(material.AppBar)`z-Index:1201;
{'' }
${""}
${""}
`;

const initialState = {
  isLoggedIn: false,
  data: {
    email: "",
    orgId: "",
    refreshToken: "",
    role: "",
    token: "",
    userId: ""
  },
};

function Navbar(props) {

  const [choseOptine, setChoseOption] = React.useState(null);
  const [openSnackBar, setOpenSnackBar] = useState({
    "action": false,
    "type": "",
    "message": "",
  });
  const [openCallNotification, setOpenCallNotification] = useState({ "action": false, "data": "" })
  const { handleDrawer, openSideNav, user, authLogout } = props;
  let userDetails = user.authReducer.data;
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userDetails.token}`;
    if (userDetails.role === "INJECTOR") {
      socket.on('join-call', (resp) => {
        setOpenCallNotification({ action: true, data: resp.data })
      })
    }
  }, []);

  function logOut() {
    authLogout(initialState, navigate)
    socket.disconnect()
  };

  const handleMenu = (event) => {
    setChoseOption(event.currentTarget);
  };

  const handleClose = () => {
    setChoseOption(null);
  };


  return (
    <div>
      <material.Box>
        <Header open={openSideNav} style={{ backgroundColor: "#87CEFA" }}>
          <material.Container maxWidth="xl">
            <material.Toolbar disableGutters>
              <material.IconButton
                onClick={handleDrawer}
                edge="start"
                sx={{ marginRight: "30px" }}
              >
                <material.MenuIcon sx={{ fontSize: 30 }} />
              </material.IconButton>
              <material.Typography sx={{ color: "black", marginTop: "-2px !important", flexGrow: 1 }} className="nav-content">Logged in as ({userDetails.email} , {userDetails.role})</material.Typography>
              {/* <material.IconButton
                onClick={logOut}><material.LogoutIcon sx={{ fontSize: 30 }} />
              </material.IconButton> */}
              <material.IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <material.Tooltip>
                  <material.Avatar />
                </material.Tooltip>
              </material.IconButton>
              <material.Menu
                id="menu-appbar"
                anchorEl={choseOptine}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(choseOptine)}
                onClose={handleClose}
              >
                <material.MenuItem className="nav-content">Profile</material.MenuItem>
                <material.MenuItem onClick={logOut} className="nav-content">Logout</material.MenuItem>
              </material.Menu>
            </material.Toolbar>
          </material.Container>
        </Header>
      </material.Box>
      <Snackbar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      />
      <CallNotification
        openCallNotification={openCallNotification}
        setOpenCallNotification={setOpenCallNotification}
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
    authLogout: (initialState, navigate) => {
      dispatch(logoutAction(initialState, navigate))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

