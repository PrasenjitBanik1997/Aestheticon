import React, { useState, useEffect } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { getAllInjectors } from '../../../services/InjectorService';


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

function InjectorList(props) {

    const [injectorsData, setInjectorsData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setisLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        getInjectorList()
    }, []);

    const getInjectorList = async () => {
        await getAllInjectors()
            .then((resp) => {
                setInjectorsData(resp.data)
                setisLoading(false)
            })
            .catch((error) => {
                setTimeout(() => {
                    setisLoading(false)
                }, 2000)
            })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const goBack = () => {
        navigate("/dashboard");
    };

    // const addInjector = () => {
    //     navigate("/dashboard/injector-list/add-injector")
    // };

    // const editInjector = (injectorData) => {
    //     navigate("/dashboard/injector-list/edit-injector", { state: { injectorData } })
    // };

    // const viewInjectorDetails = (injectorData) => {
    //     navigate("/dashboard/injector-list/edit-injector", { state: { injectorData } })
    // };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Injector List</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        {/* <material.Button variant="contained" startIcon={<material.AddIcon />} onClick={addInjector}> Add-Injector</material.Button> */}
                        <material.Button variant="contained" className='ms-2' onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            <span style={{ marginLeft: 5 }}>
                <material.TextField
                    sx={{ width: "30ch" }}
                    variant="standard"
                    label="Filter by Injector Name"
                // onChange={(e) => filterByPatientName(e.target.value)}
                />
            </span>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell >Injector Name</StyledTableCell>
                                        <StyledTableCell align="right">Injector ID</StyledTableCell>
                                        <StyledTableCell align="right">Email ID</StyledTableCell>
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
                                    ) : (
                                        <>
                                            {injectorsData.length ? injectorsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <material.TableCell sx={{ textTransform: "capitalize" }} size='small' component="th" scope="row">{row.name}</material.TableCell>
                                                    <material.TableCell sx={{ textTransform: "capitalize" }} size='small' align="right">{row.userId}</material.TableCell>
                                                    <material.TableCell size='small' align="right">{row.email}</material.TableCell>
                                                    <material.TableCell size='small' align="right">{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                                                    {/* <material.TableCell align="right">
                                                        <material.IconButton title='Edit Organisation' aria-label="create" size="large" onClick={() => editInjector({ ...row, "action": "edit" })}>
                                                            <material.CreateIcon color='primary' />
                                                        </material.IconButton>
                                                        <material.IconButton title='Delete Organisation' aria-label="delete" size="large">
                                                            <material.DeleteIcon color='warning' />
                                                        </material.IconButton>
                                                        <material.IconButton title='Show Organisation Details' aria-label="visibility" size="large" onClick={() => viewInjectorDetails({ ...row, "action": "view" })}>
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
                            count={injectorsData.length}
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

export default InjectorList;