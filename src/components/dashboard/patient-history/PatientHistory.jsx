import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import { addPatientHistory, getPatientHistory } from '../../../services/PatientService';
import '../patient-history/PatientHistory';
import { localDateTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import Snackbar from '../../toastrmessage/Snackbar';
import AddPatientHistory from '../../dialog/AddPatientHistory';
import moment from 'moment';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';



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

let patientHistoryData = [];
let history = [];

function PatientHistory(props) {

    const { userData } = props;
    let userDetails = userData.authReducer.data;
    const location = useLocation();
    const navigate = useNavigate();

    const [patientsHistory, setPatientsHistory] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [openHistory, setOpenHistory] = useState(false);
    const [open, setOpen] = useState({ "action": false, "patientHistory": "" });
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const [hideShow, setHideShow] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    let patientData = location.state ? location.state.patientData : "";

    useEffect(() => {
        getAllHistoryOfPatient()
    }, [])

    const getAllHistoryOfPatient = async () => {
        await getPatientHistory(patientData.patientId)
            .then((resp) => {
                setPatientsHistory(resp.data)
                setisLoading(false)
            })
    }

    const goBack = () => {
        // if (userDetails.role === "INJECTOR") {
        navigate("/dashboard/patient-list/edit-patient", { state: { patientData } })
        // } else {
        //     navigate("/clinic/patient-list/edit-patient", { state: { patientData } })
        // }
    };

    const addInfo = () => {
        setOpenHistory(true)
    };

    const handleClick = (data) => {
        setOpen({ action: true, patientHistory: data })
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getPatientHistoryData = (data) => {
        if (data !== "") {
            setHideShow(true)
        }
        patientHistoryData.push(data)
        let obj = {}
        obj[data.key] = data.value
        history.push(obj)
    };

    const addHistory = async (data) => {
        let obj = {
            "patientId": patientData.patientId,
            "dateOfEntry": moment().format("YYYY-MM-DDTHH:mm:ss"),
            "history": history
        }
        await addPatientHistory(obj)
            .then((res) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "History added successfully",
                })
                setHideShow(false)
                getAllHistoryOfPatient()
            })
            .catch((error) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Patient History</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" className='me-2' onClick={addInfo} startIcon={<material.AddIcon />}>Add-History</material.Button>
                        <material.Button variant="contained" onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            {isLoading ? (
                <SkeletonTheme baseColor="#bbdefb" highlightColor="#c6ff00" enableAnimation="true" inline="true" width="100% " height="60px">
                    <Skeleton count={10} />
                </SkeletonTheme>
            ) : (
                <div className='mt-3'>
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <div className="row">
                            {/* {patientsHistory.map((ele, i) => (
                                <div className='col-3 mt-3' key={i}>
                                    <material.Card sx={{ backgroundColor: "lightblue" }}>
                                    <material.CardActionArea onClick={() => handleClick(ele)} sx={{ pt: 3, pb: 3 }}>
                                        <material.CardContent>
                                            <h6 className='text-center'>{localDateTimeFormat(ele.dateOfEntry)}</h6>
                                        </material.CardContent>
                                    </material.CardActionArea>
                                </material.Card>
                                </div>
                            ))} */}
                            <material.TableContainer sx={{ maxHeight: 460 }}>
                                <material.Table stickyHeader aria-label="sticky table">
                                    <material.TableHead >
                                        <material.TableRow>
                                            <StyledTableCell >Date of Entry</StyledTableCell>
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
                                                {patientsHistory.length ? patientsHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                    <material.TableRow
                                                        key={i}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer",
                                                            ":hover": { backgroundColor: "lightgray" }
                                                        }}
                                                        onClick={() => handleClick(row)}
                                                    >
                                                        <material.TableCell sx={{ pt: 3, pb: 3 }} size='small' component="th" scope="row">{localDateTimeFormat(row.dateOfEntry)}</material.TableCell>
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
                            <material.TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={patientsHistory.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                        {hideShow === true ? (
                            <div className='m-3'>
                                <hr />
                                <span><material.Typography variant="h5">History</material.Typography></span>
                                {patientHistoryData.length ? patientHistoryData.map((element, i) => (
                                    <div className='row' key={i}>
                                        <div className='col-lg-2 col-md-4 col-sm-6 mt-3'>
                                            <material.Typography>{element ? element.key : ""}</material.Typography>
                                        </div>
                                        <div className='col-lg-10 col-md-8 col-sm-6'>
                                            <material.TextField
                                                label={element ? element.key : ""}
                                                id="standard-error"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                fullWidth
                                                value={element ? element.value : ""}
                                                InputProps={{ readOnly: true }}
                                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                            />
                                        </div>
                                    </div>
                                )) : ""}
                                <div className='row mt-5'>
                                    <div className='col-lg-12 col-md-12 col-sm-12'>
                                        <span className='float-end'>
                                            <material.Button variant="contained" size="medium" onClick={() => addHistory({ "Action": "save" })}>
                                                Save
                                            </material.Button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </material.Paper>
                </div>
            )}
            <ShowHistory
                open={open}
                setOpen={setOpen}
            />
            <AddPatientHistory
                openHistory={openHistory}
                setOpenHistory={setOpenHistory}
                getPatientHistoryData={getPatientHistoryData}
            />
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
};


const ShowHistory = (props) => {

    const { open, setOpen } = props;

    return (
        <div>
            <material.Dialog fullWidth open={open.action} hideBackdrop >
                <material.DialogTitle className='d-flex flex-row' style={{ justifyContent: "space-between" }}>Patient History
                    <material.Button variant="contained" color='error' size="medium" onClick={() => setOpen({ action: false })}><material.CloseIcon /></material.Button>
                </material.DialogTitle>
                <material.DialogContent>
                    <hr />
                    <div className='row'>
                        {open.patientHistory ? open.patientHistory.info.map((item, i) => (
                            <div className="col-lg-12 col-md-12 col-sm-12" key={i}>
                                <material.TextField
                                    label={Object.keys(item)}
                                    id="standard-error"
                                    variant="standard"
                                    type="text"
                                    size="small"
                                    multiline
                                    fullWidth
                                    value={Object.values(item)}
                                    InputProps={{ readOnly: true }}
                                    inputProps={{ style: { textTransform: 'capitalize' } }}
                                    sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                />
                            </div>
                        )) : ""}
                    </div>
                </material.DialogContent>
            </material.Dialog>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(PatientHistory);