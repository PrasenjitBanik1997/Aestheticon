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
import Snackbar from '../../toastrmessage/Snackbar';
import { connect } from 'react-redux';
import VideoCalling from '../video-call/VideoCalling';
import PatientHistory from "../../dashboard/patient-history/PatientHistory";
import { getCallCredential } from '../../../services/VideoCallingService';
import { getPatientHistory } from '../../../services/PatientService';
import StatusChangeReasonDialog from '../../dialog/StatusChangeReasonDialog';
import { createBlankTreatmentPlan } from '../../../services/TreatmentPlanService';
import AddTreatmentPlan from '../treatment-plan/AddTreatmentPlan';
import ConsentForm from '../consent-form/ConsentForm';


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

var treatmentData = [];
var uniqueTreatmentName = [];

function TreatmentPlanDetails(props) {

    const { userData } = props;
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [isLoading, setisLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [openVideoChat, setOpenVideoChat] = useState(false);
    const [credentialData, setCredentialData] = useState([]);
    const [patientHistory, setPatientHistory] = useState([]);
    const [openStatusChangeDialog, setOpenStatusChangeDialog] = useState({
        "action": false, "data": ""
    });
    const [openTreatmentPlan, setOpenTreatmentPlan] = useState(false);
    const [hideShow, setHideShow] = useState(true);
    const [openConsentForm, setOpenConsentForm] = useState(true);
    const [blankTreatmentData, setBlankTreatmentData] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    let userDetails = userData.authReducer.data;
    let treatmentPlanDetails = location.state ? location.state.treatmentPlanDetails : "";

    useEffect(() => {
        setisLoading(false)
        if (treatmentPlanDetails.status === "PENDING") {
            getCallCredentialData();
        }
        getPatientHistoryByPatientId()
        createBlankTreatment();
    }, []);

    const createBlankTreatment = async () => {
        let obj = {
            patientId: treatmentPlanDetails.patientId,
            timeStamp: date
        };
        await createBlankTreatmentPlan(obj)
            .then((resp) => {
                setBlankTreatmentData(resp.data)
            })
    };

    async function getCallCredentialData() {
        await getCallCredential(treatmentPlanDetails.treatmentPlanRequestId)
            .then((resp) => {
                setCredentialData(resp.data)
            })
    };

    const getPatientHistoryByPatientId = async () => {
        await getPatientHistory(treatmentPlanDetails.patientId)
            .then((resp) => {
                setPatientHistory(resp.data)
            })
    };

    const goBack = () => {
        if (userDetails.role === "PRESCRIBER") {
            navigate("/waiting-room")
        } else {
            navigate("/approval-waiting-quere")
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const startVideoChat = () => {
        setOpenVideoChat(true)
    };

    const openTreatment = () => {
        setOpenTreatmentPlan(true)
    };

    const getTreatmentData = (data) => {
        if (data !== "") {
            setHideShow(false)
        }
        treatmentData.push(data)
        let array = treatmentData.map((ele) => ele.treatment)
        uniqueTreatmentName = array.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    };

    const addConsentForm = () => {
        setOpenConsentForm(false)
    }

    const statusChange = async (value) => {
        setOpenStatusChangeDialog({ action: true, data: value })
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    <span><material.Typography variant="h5">Treatment Plan Details</material.Typography></span>
                </div>
                <div className="col-6">
                    <span className="float-end">
                        {treatmentPlanDetails.status === "DRAFT" ? (
                            <>
                                <material.Button variant="contained" className='me-2' style={{ backgroundColor: "yellowgreen" }} onClick={() => statusChange({ "action": "pending" })}>Pending</material.Button>
                                <material.Button variant="contained" className='ms-2' color='error' onClick={() => statusChange({ "action": "delete" })}>Reject</material.Button>
                            </>
                        ) : treatmentPlanDetails.status === "PENDING" && userDetails.role === "PRESCRIBER" ? (
                            <>
                                <material.Button variant="contained" startIcon={<material.VideoCallIcon />} onClick={startVideoChat}>Call</material.Button>
                                <material.Button variant="contained" className='ms-2' color='error' onClick={() => statusChange({ "action": "reject" })}>Reject</material.Button>
                                <material.Button variant="contained" className='ms-2' color='success' onClick={() => statusChange({ "action": "approve" })}>Approve</material.Button>
                            </>
                        ) : treatmentPlanDetails.status === "PENDING" && userDetails.role === "INJECTOR" ? (
                            <material.Button variant="contained" startIcon={<material.VideoCallIcon />} onClick={startVideoChat}>Call</material.Button>
                        ) : null}
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
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
                                            style={{ cursor: "pointer" }}
                                        />
                                    )) : ""}
                                </span>
                            </div>
                        </div>
                        <hr />
                        <PatientHistory
                            patientHistory={patientHistory}
                        />
                        <hr />
                        <div hidden={treatmentPlanDetails.status === "PENDING"}>
                            <span className='d-flex justify-content-end'>
                                <material.Button variant="contained" className='me-2' startIcon={<material.AddIcon />} onClick={openTreatment} >Add Treatment</material.Button>
                            </span>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
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
                            </div>
                        </div>
                        <div hidden={hideShow}>
                            {treatmentData.length ? treatmentData.map((ele, i) => (
                                <div className='row me-2 mt-3' key={i}>
                                    <div className='col-lg-3 col-md-6'>
                                        <material.TextField
                                            label="Treatment"
                                            id="standard-error"
                                            variant="standard"
                                            type="text"
                                            size="small"
                                            value={ele.treatment}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                            inputProps={{ style: { textTransform: 'capitalize' } }}
                                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                        />
                                    </div>
                                    <div className='col-lg-3 col-md-6'>
                                        <material.TextField
                                            label="Area"
                                            id="standard-error"
                                            variant="standard"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            value={ele.area}
                                            InputProps={{ readOnly: true }}
                                            inputProps={{ style: { textTransform: 'capitalize' } }}
                                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                        />
                                    </div>
                                    <div className='col-lg-3 col-md-6'>
                                        <material.TextField
                                            label="Product"
                                            id="standard-error"
                                            variant="standard"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            value={ele.product}
                                            InputProps={{ readOnly: true }}
                                            inputProps={{ style: { textTransform: 'capitalize' } }}
                                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                        />
                                    </div>
                                    <div className='col-lg-3 col-md-6 d-flex flex-row'>
                                        <material.TextField
                                            label="Qty"
                                            id="standard-error"
                                            variant="standard"
                                            type="text"
                                            size="small"
                                            fullWidth
                                            value={ele.qty}
                                            InputProps={{ readOnly: true }}
                                            inputProps={{ style: { textTransform: 'capitalize' } }}
                                            sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                        />
                                    </div>
                                </div>
                            )) : ""}
                            <div className='mb-3'>
                                {openConsentForm === true ? (
                                    <span className="float-end mt-5 me-3">
                                        <material.Button variant="contained" startIcon={<material.AddIcon />} onClick={addConsentForm}>Add Consent Form</material.Button>
                                    </span>
                                ) : ""}
                            </div>
                        </div>
                    </material.Paper>
                </div>
            </div>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
            {openVideoChat || treatmentPlanDetails.action === "videoCall" ? (
                <div>
                    <VideoCalling
                        openVideoChat={openVideoChat}
                        setOpenVideoChat={setOpenVideoChat}
                        credentialData={credentialData}
                    />
                </div>
            ) : null}
            <StatusChangeReasonDialog
                openStatusChangeDialog={openStatusChangeDialog}
                setOpenStatusChangeDialog={setOpenStatusChangeDialog}
            />
            <AddTreatmentPlan
                openTreatmentPlan={openTreatmentPlan}
                setOpenTreatmentPlan={setOpenTreatmentPlan}
                getTreatmentData={getTreatmentData}
            />
            <ConsentForm
                openConsentForm={openConsentForm}
                treatmentData={treatmentData}
                blankTreatmentData={blankTreatmentData}
                uniqueTreatmentName={uniqueTreatmentName}
                component="treatmentPlanDetails"
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
    };
};

export default connect(mapStateToProps)(TreatmentPlanDetails);