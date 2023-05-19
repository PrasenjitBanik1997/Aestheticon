import React, { useEffect, useState } from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { activeOrDeactiveClinic, deleteClinicById, getAllClinic, getClinicForInjector } from '../../services/ClinicService';
import Snackbar from '../toastrmessage/Snackbar'
import { connect } from 'react-redux';
import { getClinicAction } from '../../store/action/Action';


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

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

let allClinicData;

function Clinic(props) {

  const { userData, getClinicDetails } = props;
  let userDetails = userData.authReducer.data;
  const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState({ open: false, Id: null });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [clinicData, setClinicData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [openSnackBar, setOpenSnackBar] = useState({
    "action": false,
    "type": "",
    "message": "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails.role === "INJECTOR") {
      clinicDetailsForInjector()
    } else {
      getClinic()
    }
  }, []);

  const getClinic = async () => {
    await getAllClinic()
      .then((resp) => {
        allClinicData = resp.data
        setClinicData(resp.data)
        setisLoading(false)
      })
      .catch((error) => {
        setTimeout(() => {
          setisLoading(false)
        }, 1000);
      })
  };

  const clinicDetailsForInjector = async () => {
    await getClinicForInjector()
      .then((resp) => {
        setClinicData(resp.data)
        setisLoading(false)
      })
      .catch((error) => {

      })
  };

  const deleteClinic = async (clinicId) => {
    setOpenConfirmationDialog({ open: true, Id: clinicId })
  };

  const deleteClinicAfterConformation = async (clinicId) => {
    await deleteClinicById(clinicId)
      .then(() => {
        setOpenConfirmationDialog({ open: false, Id: null })
        setOpenSnackBar({
          "action": true,
          "type": "success",
          "message": "Clinic delete successful",
        })
        setisLoading(true)
        getClinic()
      })
      .catch(() => {
        setOpenSnackBar({
          "action": true,
          "type": "error",
          "message": "Something went Wrong",
        })
        setisLoading(false)
      })
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const enableAndDisableClinic = async (clinicId) => {
    setisLoading(true)
    await activeOrDeactiveClinic(clinicId)
      .then((resp) => {
        getClinic()
      })
  };

  const goToAddClinicPage = (organisationData) => {
    navigate("/clinic/add_clinic", { state: { organisationData } })
  };

  const viewClinicDetails = (organisationData) => {
    navigate("/clinic/add_clinic", { state: { organisationData } })
  };

  const filterByClinicName = (value) => {
    const filteredRows = clinicData.filter((row) => {
      return row.clinicName
        .toString()
        .toLowerCase()
        .trim()
        .includes(value.toString().toLowerCase().trim())
    })
    if (value.trim().toString().length < 1) {
      setClinicData(allClinicData);
    } else {
      setClinicData(filteredRows);
    }
  };

  const selectClinic = (clinicData) => {
    getClinicDetails(clinicData)
    navigate("/dashboard")
  };


  return (
    <div className='body'>
      <Swipedrawer />
      <div className="row">
        <div className="col-6">
          <span><material.Typography variant="h5">Clinic</material.Typography>
          </span>
        </div>
        <div className="col-6" hidden={userDetails.role === "INJECTOR"}>
          <span className="float-end">
            <material.Button variant="contained" onClick={() => goToAddClinicPage({ "readOnly": false, "parentComponent": "clinic" })} startIcon={<material.ApartmentIcon />}> Add-Clinic</material.Button>
          </span>
        </div>
      </div>
      <span style={{ marginLeft: 5 }}>
        <material.TextField
          sx={{ width: "30ch" }}
          variant="standard"
          label="Filter by Clinic Name"
          onChange={(e) => filterByClinicName(e.target.value)}
        />
      </span>
      <div className="row mt-3">
        <div className="col-12">
          <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <material.TableContainer sx={{ maxHeight: 460 }}>
              <material.Table stickyHeader aria-label="sticky table">
                <material.TableHead >
                  <material.TableRow>
                    <StyledTableCell >Clinic ID</StyledTableCell>
                    <StyledTableCell>Clinic Name</StyledTableCell>
                    <StyledTableCell align="right" hidden={userDetails.role === "INJECTOR"}>Director Name</StyledTableCell>
                    <StyledTableCell align="right" hidden={userDetails.role === "INJECTOR"}>Director's Ph No.</StyledTableCell>
                    <StyledTableCell align="right" hidden={userDetails.role === "INJECTOR"}>Status</StyledTableCell>
                    <StyledTableCell align="right" hidden={userDetails.role === "INJECTOR"}>Actions</StyledTableCell>
                  </material.TableRow>
                </material.TableHead>
                <material.TableBody>
                  {isLoading ? (
                    <material.TableRow >
                      <material.TableCell colSpan={6}>
                        <SkeletonTheme baseColor="#bbdefb" highlightColor="#c6ff00" enableAnimation="true" inline="true" width="100% " height="30px">
                          <Skeleton count={10} />
                        </SkeletonTheme>
                      </material.TableCell>
                    </material.TableRow>
                  ) : (
                    <>
                      {clinicData.length ? clinicData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                        <material.TableRow
                          key={i}
                          sx={userDetails.role === "INJECTOR" ?
                            { '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer", ":hover": { backgroundColor: "lightgray" } }
                            : { '&:last-child td, &:last-child th': { border: 0 } }}
                          onClick={userDetails.role === "INJECTOR" ? () => selectClinic(row) : null}
                        >
                          <material.TableCell sx={{ pt: 2, pb: 2 }} size='small' component="th" scope="row">{row.clinicId}</material.TableCell>
                          <material.TableCell size='small'>{row.clinicName}</material.TableCell>
                          <material.TableCell size='small' align="right" hidden={userDetails.role === "INJECTOR"}>{row.director1}</material.TableCell>
                          <material.TableCell size='small' align="right" hidden={userDetails.role === "INJECTOR"}>{row.director1Phone}</material.TableCell>
                          <material.TableCell size='small' align="right" hidden={userDetails.role === "INJECTOR"}>{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                          <material.TableCell align="right" hidden={userDetails.role === "INJECTOR"}>
                            <material.IconButton title='Edit Organisation' aria-label="create" size="large" onClick={() => viewClinicDetails({ ...row, "readOnly": false, "callFrom": "edit" })}>
                              <material.CreateIcon color='primary' />
                            </material.IconButton>
                            <material.IconButton title='Delete Organisation' aria-label="delete" size="large" onClick={() => deleteClinic(row.clinicId)}>
                              <material.DeleteIcon color='warning' />
                            </material.IconButton>
                            <material.IconButton title='Show Organisation Details' aria-label="visibility" size="large" onClick={() => viewClinicDetails({ ...row, "readOnly": true, "callFrom": "show" })}>
                              <material.VisibilityIcon color='success' />
                            </material.IconButton>
                            <material.Switch {...label} checked={row.active} onChange={() => enableAndDisableClinic(row.clinicId)} />

                          </material.TableCell>
                        </material.TableRow>
                      )) : (
                        <material.TableRow >
                          <material.TableCell colSpan={6}>
                            <h6 className='d-flex justify-content-center text-danger fw-bold'>No data found</h6>
                          </material.TableCell>
                        </material.TableRow>
                      )}
                    </>)}
                </material.TableBody>
              </material.Table>
            </material.TableContainer>
            <hr />
            <material.TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={clinicData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </material.Paper>
        </div>
      </div>
      <Snackbar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      />
      <ConfirmationDialog
        openConfirmationDialog={openConfirmationDialog}
        setOpenConfirmationDialog={setOpenConfirmationDialog}
        deleteClinicAfterConformation={deleteClinicAfterConformation}
      />
    </div>
  );
};

function ConfirmationDialog(props) {
  const { openConfirmationDialog, setOpenConfirmationDialog, deleteClinicAfterConformation } = props

  const dialogClose = () => {
    setOpenConfirmationDialog({ openConfirmationDialog: false, Id: null })
  }

  const deleteClinic = () => {
    deleteClinicAfterConformation(openConfirmationDialog.Id)
  }


  return (
    <div >
      <material.Dialog maxWidth="40%" open={openConfirmationDialog.open} hideBackdrop >
        <material.DialogTitle>Delete Clinic</material.DialogTitle>
        <material.DialogContent>Are you sure,you want to delete this Clinic?</material.DialogContent>
        <material.DialogActions className='me-3'>
          <material.Button onClick={dialogClose} variant="outlined" startIcon={<material.CloseIcon />}>Cancel</material.Button>
          <material.Button onClick={deleteClinic} variant="contained" color="error" startIcon={<material.DeleteIcon />}>Delete</material.Button>
        </material.DialogActions>
      </material.Dialog>
    </div>
  )
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

export default connect(mapStateToProps, mapDispatchToProps)(Clinic);
