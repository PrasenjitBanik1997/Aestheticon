import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { getAllPAtient } from '../../../services/PatientService';


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

let allPatientData;

function PatientManagement(props) {

    const [patientsData, setPatientsData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setisLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        getPatientList();
    }, []);

    const getPatientList = async () => {
        await getAllPAtient()
            .then((res) => {
                allPatientData = res.data
                setPatientsData(res.data)
                setisLoading(false)
            })
    }

    const addPatient = () => {
        navigate("/dashboard/patient-list/add-patient")
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
        console.log(filteredRows)
    };

    const showPatientData = (patientData) => {
        navigate("/dashboard/patient-list/edit-patient", { state: { patientData } })
    }

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
                                        <StyledTableCell >Patient Name</StyledTableCell>
                                        <StyledTableCell align="right">Clinic ID</StyledTableCell>
                                        <StyledTableCell align="right">Patient ID</StyledTableCell>
                                        <StyledTableCell align="right">Status</StyledTableCell>
                                        {/* <StyledTableCell align="right">Actions</StyledTableCell> */}
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
                                            {patientsData.length ? patientsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer",
                                                        ":hover": { backgroundColor: "lightgray" }
                                                    }}
                                                    onClick={() => showPatientData({ ...row, "action": "edit" })}
                                                >
                                                    <material.TableCell sx={{ textTransform: "capitalize" }} size='small' component="th" scope="row">{row.name} </material.TableCell>
                                                    <material.TableCell sx={{ textTransform: "capitalize" }} size='small' align="right">{row.clinicId}</material.TableCell>
                                                    <material.TableCell size='small' align="right">{row.patientId}</material.TableCell>
                                                    <material.TableCell size='small' align="right">{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                                                    {/* <material.TableCell align="right">
                                                        <material.IconButton title='Edit Organisation' aria-label="create" size="large">
                                                            <material.CreateIcon color='primary' />
                                                        </material.IconButton>
                                                        <material.IconButton title='Delete Organisation' aria-label="delete" size="large">
                                                            <material.DeleteIcon color='warning' />
                                                        </material.IconButton>
                                                        <material.IconButton title='Show Organisation Details' aria-label="visibility" size="large">
                                                            <material.VisibilityIcon color='success' />
                                                        </material.IconButton>
                                                        <material.Switch {...label} checked={row.active} />

                                                    </material.TableCell> */}
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
}

export default PatientManagement;