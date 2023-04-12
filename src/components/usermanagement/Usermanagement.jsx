import React, { useEffect, useState } from 'react';
import Swipedrawer from '../drawer/Swipedrawer';
import { material } from '../../library/material';
import InviteUser from '../dialog/InviteUser';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { activeOrDeactiveUser, getUsersList } from '../../services/UserManagementService';

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

let allUsersData;

const Usermanagement = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [open, setOpen] = React.useState({ open: false, Id: null })
    const [openInvitePoup, setOpenInvitePoup] = React.useState({
        open: false,
        action: ""
    });

    useEffect(() => {
        getAllUserList()
    }, []);

    const getAllUserList = async () => {
        await getUsersList()
            .then((resp) => {
                allUsersData = resp.data
                setUsersData(resp.data)
                setisLoading(false)
            })
            .catch((error) => {
                setTimeout(() => {
                    setisLoading(false)
                }, 2000)
            })
    };

    const openInviteDialog = (value) => {
        setOpenInvitePoup({ open: true, action: value })
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const enableAndDisableUser = async (userId) => {
        setisLoading(true)
        await activeOrDeactiveUser(userId)
            .then(() => {
                getAllUserList();
            })
            .catch((error) => {
                setTimeout(() => {
                    setisLoading(false)
                }, 2000)
            })
    };

    const viewUserDetails = (usersData) => {
        // navigate("/organisation/add_organisation", { state: { usersData } })
    };

    const deleteUser = async (orgId) => {
        setOpen({ open: true, Id: orgId })
    };

    const filterByUserID = (value) => {
        const filteredRows = usersData.filter((row) => {
            return row.userId
                .toString()
                .toLowerCase()
                .trim()
                .includes(value.toString().toLowerCase().trim())
        })
        if (value.trim().toString().length < 1) {
            setUsersData(allUsersData);
        } else {
            setUsersData(filteredRows);
        }
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <div className="row">
                <div className="col-6">
                    <span><material.Typography variant="h5">User Management</material.Typography>
                    </span>
                </div>
                <div className="col-6">
                    <span className="float-end">
                        <material.Button variant="contained" sx={{ mr: 1 }} startIcon={<material.PersonIcon />} onClick={() => openInviteDialog("add-user")}>Add-User</material.Button>
                        <material.Button variant="contained" startIcon={<material.PersonIcon />} onClick={() => openInviteDialog("invite-user")}>Invite-User</material.Button>
                    </span>
                </div>
            </div>
            <span style={{ marginLeft: 5 }}>
                <material.TextField
                    sx={{ width: "30ch" }}
                    variant="standard"
                    label="Filter by User ID"
                    onChange={(e) => filterByUserID(e.target.value)}
                />
            </span>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell >Org ID</StyledTableCell>
                                        <StyledTableCell align="right">Email ID</StyledTableCell>
                                        <StyledTableCell align="right">Role</StyledTableCell>
                                        <StyledTableCell align="right">User ID</StyledTableCell>
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
                                                {usersData.length ? usersData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                    <material.TableRow
                                                        key={i}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <material.TableCell size='small' component="th" scope="row">{row.orgId}  </material.TableCell>
                                                        <material.TableCell size='small' align="right">{row.email}</material.TableCell>
                                                        <material.TableCell size='small' align="right">{row.role}</material.TableCell>
                                                        <material.TableCell size='small' align="right">{row.userId}</material.TableCell>
                                                        <material.TableCell size='small' align="right">{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                                                        <material.TableCell align="right">
                                                            <material.IconButton title='Edit Organisation' aria-label="create" size="large" onClick={() => viewUserDetails({ ...row, "readOnly": false, "callFrom": "edit" })}>
                                                                <material.CreateIcon color='primary' />
                                                            </material.IconButton>
                                                            <material.IconButton title='Delete Organisation' aria-label="delete" size="large" onClick={() => deleteUser(row.orgId)}>
                                                                <material.DeleteIcon color='warning' />
                                                            </material.IconButton>
                                                            <material.IconButton title='Show Organisation Details' aria-label="visibility" size="large" onClick={() => viewUserDetails({ ...row, "readOnly": true, "callFrom": "show" })}>
                                                                <material.VisibilityIcon color='success' />
                                                            </material.IconButton>
                                                            <material.Switch {...label} checked={row.active} onChange={() => enableAndDisableUser(row.userId)} />

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
                            count={usersData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </material.Paper>
                </div>
            </div>
            <InviteUser
                openInvitePoup={openInvitePoup}
                setOpenInvitePoup={setOpenInvitePoup}
                getAllUserList={getAllUserList}
                setisLoading={setisLoading}
            />
        </div>
    );
};

export default Usermanagement;