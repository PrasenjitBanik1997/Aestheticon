import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { getPendingTreatmentRequest } from '../../../services/PrescriberService';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import { changePlanStatus } from '../../../services/PrescriberService';
import Snackbar from '../../toastrmessage/Snackbar';
import StatusChangeReasonDialog from '../../dialog/StatusChangeReasonDialog';


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

var allPatientRequestData;

function WatingRoom(props) {

    const [isLoading, setisLoading] = useState(true);
    const [patientRequestData, setPatientRequestData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [openStatusChangeDialog, setOpenStatusChangeDialog] = useState({
        "action": false, "data": ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        pendingTreatmantRequest()
    }, []);

    const pendingTreatmantRequest = async () => {
        await getPendingTreatmentRequest()
            .then((resp) => {
                allPatientRequestData = resp.data;
                setPatientRequestData(resp.data)
                setisLoading(false)
            })
            .catch((error) => {

            })
    };

    function goBack() {
        navigate("/dashboard")
    };

    function filterByPatientName(value) {
        const filteredRows = allPatientRequestData.filter((row) => {
            return row.patientName
                .toString()
                .toLowerCase()
                .trim()
                .includes(value.toString().toLowerCase().trim())
        })
        if (value.trim().toString().length < 1) {
            setPatientRequestData(allPatientRequestData);
        } else {
            setPatientRequestData(filteredRows);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function showTreatmentPlan(treatmentPlanDetails) {
        navigate("/waiting-room/treatment-plan-details", { state: { treatmentPlanDetails } })
    };

    const statusChange = async (value) => {
        setOpenStatusChangeDialog({ action: true, data: value })
    };

    const startVideoChat = (treatmentPlanDetails) => {
        navigate("/waiting-room/treatment-plan-details", { state: { treatmentPlanDetails } })
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    <span><material.Typography variant="h5">Waiting Room</material.Typography></span>
                </div>
                {/* <div className="col-6">
                    <span className="float-end">
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div> */}
            </div>
            <span style={{ marginLeft: 5 }}>
                <material.TextField
                    sx={{ width: "30ch" }}
                    variant="standard"
                    label="Filter by Patient Name"
                    onChange={(e) => filterByPatientName(e.target.value)}
                />
            </span>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell >Patient Name</StyledTableCell>
                                        <StyledTableCell >Clinic Name</StyledTableCell>
                                        <StyledTableCell >Treatment</StyledTableCell>
                                        <StyledTableCell >Request Generate Time</StyledTableCell>
                                        <StyledTableCell >Status</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
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
                                            {patientRequestData.length ? patientRequestData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                    }}
                                                >
                                                    <material.TableCell sx={{ pt: 2, pb: 2 }} size='small'>{row.patientName}</material.TableCell>
                                                    <material.TableCell size='small'>{row.clinicName}</material.TableCell>
                                                    <material.TableCell size='small'>
                                                        {row.treatmentPlan.map((treatment, k) => (
                                                            <span className='d-flex flex-wrap' key={k}>
                                                                {treatment.treatment} {treatment.area} {treatment.product} {treatment.qty}
                                                            </span>
                                                        ))}
                                                    </material.TableCell>
                                                    <material.TableCell size='small'>{dateAndTimeFormat(row.timeStamp)}</material.TableCell>
                                                    <material.TableCell size='small'>
                                                        {row.status === "PENDING" ? (
                                                            <span className="badge" style={{ backgroundColor: "yellowgreen" }}>
                                                                PENDING
                                                            </span>
                                                        ) : null}
                                                    </material.TableCell>
                                                    <material.TableCell>
                                                        <span className='d-flex flex-column'>
                                                            <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" color='secondary' size="small" startIcon={<material.VisibilityIcon />} onClick={() => showTreatmentPlan({ ...row, "parentComponent": "waitingRoom" })}>View</material.Button>
                                                            <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" color='success' size="small" startIcon={<material.DoneIcon />} onClick={() => statusChange({ "action": "approve", ...row })}>Approve</material.Button>
                                                            <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" color='error' size="small" startIcon={<material.PriorityHighIcon />} onClick={() => statusChange({ "action": "reject", ...row })}>Reject</material.Button>
                                                            <material.Button sx={{ textTransform: "none" }} variant="contained" color='info' size="small" startIcon={<material.VideoCallIcon />} onClick={() => startVideoChat({ "action": "videoCall", ...row })}>Call</material.Button>
                                                        </span>
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
                            count={patientRequestData.length}
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
            <StatusChangeReasonDialog
                openStatusChangeDialog={openStatusChangeDialog}
                setOpenStatusChangeDialog={setOpenStatusChangeDialog}
            />
        </div>
    );
}

export default WatingRoom;