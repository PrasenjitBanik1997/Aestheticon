import React, { useEffect } from 'react'
import { styled } from "@mui/material/styles";
import { material } from '../../library/material'
import { connect } from 'react-redux';
import { logoutAction } from '../../store/action/Action';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const { handleDrawer, open, user, authLogout } = props;
  let userDetails = user.authReducer.data;
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userDetails.token}`;
  }, [])

  function logOut() {
    authLogout(initialState, navigate)
  }


  return (
    <div>
      <material.Box>
        <Header open={open} style={{ backgroundColor: "#87CEFA" }}>
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
              <material.IconButton
                onClick={logOut}
              // edge="end"
              // sx={{ marginRight: "30px" }}
              >
                <material.LogoutIcon sx={{ fontSize: 30 }} />
              </material.IconButton>
            </material.Toolbar>
          </material.Container>
        </Header>
      </material.Box>
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

