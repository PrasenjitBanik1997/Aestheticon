import React, { useEffect, useState } from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import { useNavigate } from 'react-router-dom';
import { getClinicForInjector } from '../../services/ClinicService';
import { connect } from 'react-redux';
import { getClinicAction } from '../../store/action/Action';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


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


let clinicDetalis;
let clinicId;

function Dashboard(props) {
    const { userData, getClinicDetails } = props;
    let userDetails = userData.authReducer.data;
    const navigate = useNavigate();
    const [hideAndShow, setHideAndShow] = useState(true);
    const [clinicName, setClinicName] = useState([])

    useEffect(() => {
        // if (userDetails.role === "INJECTOR") {
        //     clinicDetailsForInjector()
        // }
    }, []);

    // const clinicDetailsForInjector = async () => {
    //     await getClinicForInjector()
    //         .then((resp) => {
    //             clinicDetalis = resp.data;
    //             let clinicName = clinicDetalis.map((ele) => ele.clinicName);
    //             setClinicName(clinicName)
    //         })
    //         .catch((error) => {

    //         })
    // };

    const handleClick = (value) => {
        if (value.action === "patientManagement") {
            if (clinicName.length) {
                setHideAndShow(false)
            } else {
                navigate("/dashboard/patient-list");
            };
        } else if (value.action === "injectorManagement") {
            navigate("/dashboard/injector-list");
        } else if (value.action === "approvalWaiting") {
            navigate("/dashboard/approval-waiting-quere");
        } else if (value.action === "approvalRequest") {
            navigate("/dashboard/approval-requests");
        }
    };

    const selectClinic = (e, value) => {
        let clinicData = clinicDetalis.filter((ele) => ele.clinicName === value);
        clinicId = clinicData.map((resp) => resp.clinicId)
        getClinicDetails(...clinicData);
        navigate("/dashboard/patient-list");
    };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                {/* <div className='col-12'>
                    <ClinicList />
                </div> */}
                <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                    <material.Card sx={{ backgroundColor: "lightblue" }}>
                        <material.CardActionArea onClick={() => handleClick({ "action": "patientManagement" })} sx={{ pt: 3, pb: 3 }}>
                            <material.CardContent>
                                <h6 className='text-center'>Patient Management</h6>
                            </material.CardContent>
                        </material.CardActionArea>
                    </material.Card>
                    {/* <div hidden={hideAndShow}>
                        <material.Autocomplete
                            id="orgId"
                            className='mt-3'
                            onChange={selectClinic}
                            options={clinicName}
                            renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Clinic Name"
                            />}
                        />
                    </div> */}
                </div>
                {userDetails.role === "MANAGER" ? (
                    <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                        <material.Card sx={{ backgroundColor: "lightblue" }}>
                            <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "injectorManagement" })}>
                                <material.CardContent>
                                    <h6 className='text-center'>Injector Management</h6>
                                </material.CardContent>
                            </material.CardActionArea>
                        </material.Card>
                    </div>
                ) : userDetails.role === "INJECTOR" ? (
                    <>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Stocks</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Current Running Procedures</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "approvalWaiting" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Approval Waiting Quere</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mt-3'>
                            <material.Card sx={{ backgroundColor: "lightblue" }}>
                                <material.CardActionArea sx={{ pt: 3, pb: 3 }} onClick={() => handleClick({ "action": "approvalRequest" })}>
                                    <material.CardContent>
                                        <h6 className='text-center'>Approved Requests</h6>
                                    </material.CardContent>
                                </material.CardActionArea>
                            </material.Card>
                        </div>
                        {/* </div> */}
                    </>
                ) : null}
            </div>
        </div>
    );
};

const ClinicList = () => {

    const [clinicData, setClinicData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setisLoading] = useState(true);


    useEffect(() => {
        clinicDetailsForInjector()
    })

    const clinicDetailsForInjector = async () => {
        await getClinicForInjector()
            .then((resp) => {
                setClinicData(resp.data)
                setisLoading(false)
            })
            .catch((error) => {

            })
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const selectClinic = (clinicData) => {
        console.log(clinicData)
    }

    return (
        <div>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell >Clinic ID</StyledTableCell>
                                        <StyledTableCell>Clinic Name</StyledTableCell>
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
                                                    sx={{'&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer",":hover": { backgroundColor: "lightgray" }}}
                                                    onClick={() => selectClinic(row)}
                                                >
                                                    <material.TableCell sx={{ pt: 3, pb: 3 }} size='small' component="th" scope="row">{row.clinicId}  </material.TableCell>
                                                    <material.TableCell sx={{ pt: 3, pb: 3 }} size='small'>{row.clinicName}</material.TableCell>
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
        </div>
    )
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);