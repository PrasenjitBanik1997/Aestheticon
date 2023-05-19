import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useNavigate } from 'react-router-dom';
import { getTreatmentPlanInjector } from '../../../services/ApprovalWatingService';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { localDateTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';


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

function ApprovalWating(props) {

    const [patientData, setPatientData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [isLoading, setisLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTreatmentPlan()
    }, []);


    const getTreatmentPlan = async () => {
        await getTreatmentPlanInjector()
            .then((resp) => {
                setPatientData(resp.data)
                setisLoading(false)
                allPatientData = resp.data
            })
    }

    const goBack = () => {
        navigate("/dashboard")
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filterByPatientId = (value) => {
        const filteredRows = patientData.filter((row) => {
            return row.patientId
                .toString()
                .toLowerCase()
                .trim()
                .includes(value.toString().toLowerCase().trim())
        })
        if (value.trim().toString().length < 1) {
            setPatientData(allPatientData);
        } else {
            setPatientData(filteredRows);
        }
    };

    const showTreatmentPlan = (treatmentPlanDetails) => {
        navigate("/dashboard/patient-waiting-list/treatment-plan-details", { state: { treatmentPlanDetails } })
    }

    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Approval Waiting Quere</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            <span style={{ marginLeft: 5 }}>
                <material.TextField
                    sx={{ width: "30ch" }}
                    variant="standard"
                    label="Filter by Patient Id"
                    onChange={(e) => filterByPatientId(e.target.value)}
                />
            </span>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell>Patient Name</StyledTableCell>
                                        <StyledTableCell>Patient ID</StyledTableCell>
                                        {/* <StyledTableCell >Clinic Name</StyledTableCell> */}
                                        <StyledTableCell>Created At</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
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
                                            {patientData.length ? patientData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer",
                                                        ":hover": { backgroundColor: "lightgray" }
                                                    }}
                                                    onClick={() => showTreatmentPlan({ ...row, "parentComponent": "approvalWating" })}
                                                >
                                                    <material.TableCell sx={{ pt: 2, pb: 2 }} size='small' scope="row">{row.patientName} </material.TableCell>
                                                    <material.TableCell size='small' scope="row">{row.patientId} </material.TableCell>
                                                    {/* <material.TableCell size='small'>{row.clinicName}</material.TableCell> */}
                                                    <material.TableCell size='small'>{localDateTimeFormat(row.timeStamp)}</material.TableCell>
                                                    <material.TableCell size='small'>
                                                        {row.status === "PENDING" ? (
                                                            <span className="badge" style={{ backgroundColor: "yellowgreen" }}>
                                                                PENDING
                                                            </span>
                                                        ) : null}
                                                        {row.status === "REJECTED" ? (
                                                            <span className="badge bg-danger">
                                                                REJECTED
                                                            </span>
                                                        ) : null}
                                                        {row.status === "APPROVED" ? (
                                                            <span className="badge bg-success">
                                                                APPROVED
                                                            </span>
                                                        ) : null}
                                                        {row.status === "DRAFT" ? (
                                                            <span className="badge" style={{ backgroundColor: "gray" }}>
                                                                DRAFT
                                                            </span>
                                                        ) : null}
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
                            count={patientData.length}
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

export default ApprovalWating;