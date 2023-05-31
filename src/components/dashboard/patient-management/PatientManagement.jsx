import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPAtients, getAllPatientByClinicId } from '../../../services/PatientService';
import { connect } from 'react-redux';


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

var allPatientData;
// var history;

function PatientManagement(props) {

    const { userData, clinicData } = props;
    let userDetails = userData.authReducer.data;
    let clinicDetails = clinicData.clinicReducer.data;

    const [patientsData, setPatientsData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setisLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetails.role === "INJECTOR") {
            getAllPatientListByClinicId()
        } else {
            getPatientList();
        };
    }, []);

    const getPatientList = async () => {
        await getAllPAtients()
            .then((res) => {
                allPatientData = res.data
                setPatientsData(res.data)
                setisLoading(false)
            })
    };

    const getAllPatientListByClinicId = async () => {
        await getAllPatientByClinicId(clinicDetails.clinicId)
            .then((res) => {
                allPatientData = res.data
                setPatientsData(res.data)
                setisLoading(false)
            })
            .catch((error) => {

            })
    };

    const addPatient = (patientData) => {
        navigate("/patient-list/add-patient")
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filterByPatientName = (value) => {
        const filteredRows = patientsData.filter((row) => {
            return row.name
                .toString()
                .toLowerCase()
                .trim()
                .includes(value.toString().toLowerCase().trim())
        })
        if (value.trim().toString().length < 1) {
            setPatientsData(allPatientData);
        } else {
            setPatientsData(filteredRows);
        }
    };

    const showPatientData = (patientData) => {
        navigate("/patient-list/edit-patient", { state: { patientData } })
    };

    // const goBack = () => {
    //     navigate("/dashboard")
    // };

    const openTreatmentPlan = (patientData) => {
        navigate("/patient-list/treatment-plan", { state: { patientData } })
    };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Patient List</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" onClick={() => addPatient({ "readOnly": false, "callFrom": "add" })} startIcon={<material.AddIcon />}> Add-Patient</material.Button>
                        {/* <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button> */}
                    </span>
                </div>
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
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Patient ID</StyledTableCell>
                                        <StyledTableCell>Date of Birth</StyledTableCell>
                                        <StyledTableCell>Email</StyledTableCell>
                                        <StyledTableCell>Gender</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </material.TableRow>
                                </material.TableHead>
                                <material.TableBody>
                                    {isLoading ? (
                                        <material.TableRow >
                                            <material.TableCell colSpan={7}>
                                                <SkeletonTheme baseColor="#bbdefb" highlightColor="#c6ff00" enableAnimation="true" inline="true" width="100% " height="30px">
                                                    <Skeleton count={10} />
                                                </SkeletonTheme>
                                            </material.TableCell>
                                        </material.TableRow>
                                    ) : (
                                        <>
                                            {patientsData.length ? patientsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        // cursor: "pointer",
                                                        // ":hover": { backgroundColor: "lightgray" }
                                                    }}
                                                // onClick={() => showPatientData({ ...row, "action": "edit" })}
                                                >
                                                    <material.TableCell sx={{ textTransform: "capitalize" }} size='small' component="th" scope="row">{row.name} </material.TableCell>
                                                    <material.TableCell size='small'>{row.patientId}</material.TableCell>
                                                    <material.TableCell size='small'>{row.dateOfBirth}</material.TableCell>
                                                    <material.TableCell size='small'>{row.email}</material.TableCell>
                                                    <material.TableCell size='small'>{row.gender}</material.TableCell>
                                                    <material.TableCell size='small'>{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                                                    <StyledTableCell>
                                                        <span className='d-flex flex-column'>
                                                            <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" size="small" color='secondary' startIcon={<material.VisibilityIcon />} onClick={() => showPatientData({ ...row, "action": "edit" })}>View</material.Button>
                                                            {/* <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" size="small" startIcon={<material.AddIcon />} onClick={() => showHistory({ ...row, "component": "patientList" })}>History</material.Button> */}
                                                            <material.Button sx={{ mb: 1, textTransform: "none" }} variant="contained" size="small" startIcon={<material.AddIcon />} onClick={() => openTreatmentPlan({ ...row, "component": "patientList" })}>Add Treatment</material.Button>
                                                        </span>
                                                    </StyledTableCell>
                                                </material.TableRow>
                                            )) : (
                                                <material.TableRow >
                                                    <material.TableCell colSpan={7}>
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
                            count={patientsData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </material.Paper>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(PatientManagement);