import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import moment from 'moment';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { changePlanStatus } from '../../../services/PrescriberService';
import Snackbar from '../../toastrmessage/Snackbar';


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

function TreatmentPlanDetails(props) {
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [isLoading, setisLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const location = useLocation();
    const navigate = useNavigate();

    let treatmentPlanDetails = location.state ? location.state.treatmentPlanDetails : "";

    useEffect(() => {
        setisLoading(false)
        // console.log(treatmentPlanDetails)
    }, [])

    const goBack = () => {
        if (treatmentPlanDetails.parentComponent === "waitingRoom") {
            navigate("/dashboard/waiting-room")
        } else {
            navigate("/dashboard/approval-waiting-quere")
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const startVideoChat = async () => {
      
    };

    const statusChange = async (value) => {
        if (value.action === "reject") {
            let obj = {
                "treatmentPlanRequestId": treatmentPlanDetails.treatmentPlanRequestId,
                "status": "REJECTED"
            }
            await changePlanStatus(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Rejected successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        } else {
            let obj = {
                "treatmentPlanRequestId": treatmentPlanDetails.treatmentPlanRequestId,
                "status": "APPROVED"
            }
            await changePlanStatus(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Approved successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        };
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    <span><material.Typography variant="h5">Tratment Plan Details</material.Typography></span>
                </div>
                <div className="col-6">
                    <span className="float-end">
                        {treatmentPlanDetails.status === "DRAFT" ? (
                            <material.Button variant="contained" className='ms-2' color='secondary' onClick={() => statusChange({ "action": "pending" })}>Pending</material.Button>
                        ) : (
                            <>
                                <material.Button variant="contained" startIcon={<material.VideoCallIcon />} onClick={startVideoChat}>Call</material.Button>
                                <material.Button variant="contained" className='ms-2' color='error' onClick={() => statusChange({ "action": "reject" })}>Reject</material.Button>
                                <material.Button variant="contained" className='ms-2' color='success' onClick={() => statusChange({ "action": "approve" })}>Approve</material.Button>
                            </>
                        )}
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
                {/* <div className='row mt-3'> */}
                <div className='col-12 mt-3'>
                    <material.Paper sx={{ width: "100%", overflow: 'hidden', p: 2 }}>
                        <div className='row ms-2'>
                            <div className='col-lg-8 col-md-6 col-sm-12 mt-2'>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='fw-bold'>
                                            <td>Treatment Plan ID</td>
                                            <td>{treatmentPlanDetails.treatmentPlanRequestId}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Time Stamp</td>
                                            <td>{dateAndTimeFormat(date)}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Patient Id</td>
                                            <td>{treatmentPlanDetails.patientId}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Patient Name</td>
                                            <td>{treatmentPlanDetails.patientName}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Patient Date of Birth</td>
                                            <td>{treatmentPlanDetails.patientDateOfBirth}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Injector Id</td>
                                            <td>{treatmentPlanDetails.injectorId}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Injector Name</td>
                                            <td>{treatmentPlanDetails.injectorName}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Clinic Name</td>
                                            <td>{treatmentPlanDetails.clinicName}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Clinic Address</td>
                                            <td>{treatmentPlanDetails.clinicAddress}</td>
                                        </tr>
                                        <tr className='fw-bold'>
                                            <td>Status</td>
                                            <td>{treatmentPlanDetails.status}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='col-lg-4 col-md-6 col-sm-12'>
                                <span className='me-5'>
                                    {treatmentPlanDetails.targetAreaBefore.length ? treatmentPlanDetails.targetAreaBefore.map((ele, i) => (
                                        <img
                                            key={i}
                                            src={ele}
                                            height={100} width="25%"
                                            // onClick={() => showImage(ele.image)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    )) : ""}
                                </span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                {/* <material.Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
                                <material.TableContainer sx={{ maxHeight: 460 }}>
                                    <material.Table stickyHeader aria-label="sticky table">
                                        <material.TableHead >
                                            <material.TableRow>
                                                <StyledTableCell >Treatment</StyledTableCell>
                                                <StyledTableCell >Area</StyledTableCell>
                                                <StyledTableCell >Product</StyledTableCell>
                                                <StyledTableCell >Qty</StyledTableCell>
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
                                                    {treatmentPlanDetails.treatmentPlan.length ? treatmentPlanDetails.treatmentPlan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                        <material.TableRow
                                                            key={i}
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 }
                                                            }}
                                                        // onClick={() => showTreatmentPlan(row)}
                                                        >
                                                            <material.TableCell sx={{ pt: 3, pb: 3 }} size='small' component="th" scope="row">{row.treatment}</material.TableCell>
                                                            <material.TableCell size='small'>{row.area}</material.TableCell>
                                                            <material.TableCell size='small'>{row.product}</material.TableCell>
                                                            <material.TableCell size='small'>{row.qty}</material.TableCell>
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
                                    count={treatmentPlanDetails.treatmentPlan.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                {/* </material.Paper> */}
                            </div>
                        </div>
                    </material.Paper>
                </div>
                {/* </div> */}
            </div>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
}

export default TreatmentPlanDetails;