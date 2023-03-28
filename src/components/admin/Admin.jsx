import React, { useEffect, useState } from 'react'
import Swipedrawer from '../drawer/Swipedrawer'
import "./Admin.css"
import { material } from '../../library/material'
import { activeOrDeactiveOrg, deleteOrgById, getAllOrganisation } from '../../services/OrganisationService'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Outlet, useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Snackbar from '../toastrmessage/Snackbar'

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

function Admin() {
  const [open, setOpen] = React.useState({ open: false, Id: null })
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const [organisationData, setOrganisationData] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState({
    "action": false,
    "type": "",
    "message": "",
  });

  useEffect(() => {
    getOrganigation()
  }, [])

  async function getOrganigation() {
    await getAllOrganisation()
      .then((resp) => {
        setOrganisationData(resp.data)
        setisLoading(false)
      }).catch((err) => {
        setOpenSnackBar({
          "action": true,
          "type": "info",
          "message": "Something went Wrong",
        })
        setTimeout(() => {
          setisLoading(false)
        }, 1000);
      })
  }

  const deleteOrganisation = async (orgId) => {
    setOpen({ open: true, Id: orgId })
  }

  const deleteOrgAfterConformation = async (orgId) => {
    await deleteOrgById(orgId).then(() => {
      setOpen({ open: false, Id: null })
      setOpenSnackBar({
        "action": true,
        "type": "success",
        "message": "Organisation delete successful",
      })
      setisLoading(true)
      getOrganigation()
    }).catch(() => {
      setOpenSnackBar({
        "action": true,
        "type": "error",
        "message": "Something went Wrong",
      })
      setisLoading(false)
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const enableAndDisableOrg = async (organisationId) => {
    setisLoading(true)
    await activeOrDeactiveOrg(organisationId).then(() => {
      getOrganigation()
    })
  }

  const goToAddOrganisationPage = (organisationData) => {
    navigate("/organisation/add_organisation", { state: { organisationData } })
  }

  const viewOrganisationDetails = (organisationData) => {
    navigate("/organisation/add_organisation", { state: { organisationData } })
  }

  return (
    <div className='body'>
      <Swipedrawer />
      <div className="row">
        <div className="col-6">
          <span><material.Typography variant="h5">Organisation</material.Typography>
          </span>
        </div>
        <div className="col-6">
          <span className="float-end">
            <material.Button variant="contained" onClick={() => goToAddOrganisationPage({ "readOnly": false, "callFrom": "add" })} startIcon={<material.ApartmentIcon />}> Add-Organisation</material.Button>
          </span>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <material.TableContainer sx={{ maxHeight: 460 }}>
              <material.Table stickyHeader aria-label="sticky table">
                <material.TableHead >
                  <material.TableRow>
                    <StyledTableCell >Org ID</StyledTableCell>
                    <StyledTableCell align="right">Org Name</StyledTableCell>
                    <StyledTableCell align="right">Director Name</StyledTableCell>
                    <StyledTableCell align="right">Director's Ph No.</StyledTableCell>
                    <StyledTableCell align="right">Status</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
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
                  )
                    :
                    (
                      <>
                        {organisationData.length ? organisationData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                          <material.TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <material.TableCell size='small' component="th" scope="row">{row.orgId}  </material.TableCell>
                            <material.TableCell size='small' align="right">{row.orgName}</material.TableCell>
                            <material.TableCell size='small' align="right">{row.director1}</material.TableCell>
                            <material.TableCell size='small' align="right">{row.director1Phone}</material.TableCell>
                            <material.TableCell size='small' align="right">{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                            <material.TableCell align="right">
                              <material.IconButton title='Edit Organisation' aria-label="create" size="large" onClick={() => viewOrganisationDetails({ ...row, "readOnly": false, "callFrom": "edit" })}>
                                <material.CreateIcon color='primary' />
                              </material.IconButton>
                              <material.IconButton title='Delete Organisation' aria-label="delete" size="large" onClick={() => deleteOrganisation(row.orgId)}>
                                <material.DeleteIcon color='warning' />
                              </material.IconButton>
                              <material.IconButton title='Show Organisation Details' aria-label="visibility" size="large" onClick={() => viewOrganisationDetails({ ...row, "readOnly": true, "callFrom": "show" })}>
                                <material.VisibilityIcon color='success' />
                              </material.IconButton>
                              <material.Switch {...label} checked={row.active} onChange={() => enableAndDisableOrg(row.orgId)} />

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
              count={organisationData.length}
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
      <ConfirmationDialog open={open} setOpen={setOpen} deleteOrgAfterConformation={deleteOrgAfterConformation} />
    </div>
  )
};

function ConfirmationDialog(props) {
  const { open, setOpen, deleteOrgAfterConformation } = props

  const dialogClose = () => {
    setOpen({ open: false, Id: null })
  }

  const orgDelete = () => {
    deleteOrgAfterConformation(open.Id)
  }


  return (
    <div >
      <material.Dialog maxWidth="40%" open={open.open} hideBackdrop >
        <material.DialogTitle>Delete Organisation</material.DialogTitle>
        <material.DialogContent>Are you sure,you want to delete this Organisation?</material.DialogContent>
        <material.DialogActions className='me-3'>
          <material.Button onClick={dialogClose} variant="outlined" startIcon={<material.CloseIcon />}>Cancel</material.Button>
          <material.Button onClick={orgDelete} variant="contained"  color="error" startIcon={<material.DeleteIcon />}>Delete</material.Button>
        </material.DialogActions>
      </material.Dialog>
    </div>
  )
}

export default Admin;
