import React from 'react'
import { material } from '../../library/material';
import { styled } from "@mui/material/styles";
import Navbar from "../navbar/Navbar";
import Sidenav from "../sidenav/Sidenav";


const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Drawer = styled(material.MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Swipedrawer() {
  const [openSideNav, setOpenSideNav] = React.useState(false);

  const handleDrawer = () => {
    setOpenSideNav((prevState) => !prevState);
  };

  return (
    <div>
      <material.Box sx={{ display: "flex" }}>
        <Navbar openSideNav={openSideNav} handleDrawer={handleDrawer} />
        <Drawer variant="permanent" open={openSideNav}>
          <DrawerHeader></DrawerHeader>
          <Sidenav openSideNav={openSideNav} setOpenSideNav={setOpenSideNav} />
        </Drawer>

        <material.Toolbar />
      </material.Box>
    </div>
  )
}
