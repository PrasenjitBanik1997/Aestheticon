import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from 'moment';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm } from 'react-hook-form';


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


function SalePriceManagement(props) {

    const [salePriseData, setSalePriseData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [isLoading, setisLoading] = useState(true);
    const [addStocksHideShow, setAddStocksHideShow] = useState(true);
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [fromDate, setFromDate] = React.useState();
    const [toDate, setToDate] = React.useState();
    const { register, handleSubmit, resetField, formState: { errors, isValid }, reset } = useForm({
        mode: "onTouched"
    });

    useEffect(() => {
        setisLoading(false)
    }, []);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <div className='body'>
            <Swipedrawer />
            <span><material.Typography variant="h5">Sale Price Management</material.Typography></span>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Product</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Product Type</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}> Per Units Price</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>From Date</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>To Date</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Changed By</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Time Stamp</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 100 }}>Status</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Action</StyledTableCell>
                                    </material.TableRow>
                                </material.TableHead>
                                <material.TableBody>
                                    {isLoading ? (
                                        <material.TableRow >
                                            <material.TableCell colSpan={10}>
                                                <SkeletonTheme baseColor="#bbdefb" highlightColor="#c6ff00" enableAnimation="true" inline="true" width="100% " height="30px">
                                                    <Skeleton count={10} />
                                                </SkeletonTheme>
                                            </material.TableCell>
                                        </material.TableRow>
                                    ) : (
                                        <>
                                            {salePriseData.length ? salePriseData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                    }}
                                                >
                                                    <material.TableCell sx={{ pt: 2, pb: 2 }} size='small'>{row.product}</material.TableCell>
                                                    <material.TableCell size='small'>{row.productType}</material.TableCell>
                                                    <material.TableCell size='small'>{row.units}</material.TableCell>
                                                    <material.TableCell size='small'>{row.unitType}</material.TableCell>
                                                    <material.TableCell size='small'>{row.dateIn}</material.TableCell>
                                                    <material.TableCell size='small'>{row.cost}</material.TableCell>
                                                    <material.TableCell size='small'>{row.timeStamp}</material.TableCell>
                                                    <material.TableCell size='small'>{row.active ? (<p style={{ color: "green", fontWeight: "bold" }}>active</p>) : (<p style={{ color: "red", fontWeight: "bold" }}>De-active</p>)}</material.TableCell>
                                                    <StyledTableCell size='small'>
                                                        <material.IconButton title='Edit Stocks' aria-label="create" size="large">
                                                            <material.CreateIcon color='primary' />
                                                        </material.IconButton>
                                                        <material.IconButton title={row.active ? 'Stocks Active' : 'Stocks De-active'} aria-label="create" size="large">
                                                            <material.Switch {...label} checked={row.active} />
                                                        </material.IconButton>
                                                    </StyledTableCell>
                                                </material.TableRow>
                                            )) : (
                                                <material.TableRow >
                                                    <material.TableCell colSpan={10}>
                                                        <h6 className='d-flex justify-content-center text-danger fw-bold'>No data found</h6>
                                                    </material.TableCell>
                                                </material.TableRow>
                                            )}
                                        </>)}
                                </material.TableBody>
                            </material.Table>
                            <div className='mt-2 mb-2' hidden={addStocksHideShow}>
                                <hr />
                                <div className='d-flex'>
                                    <material.TextField
                                        label="Product"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("product", { required: true })}
                                    />
                                    <material.TextField
                                        label="Product Type"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("productType", { required: true })}
                                    />
                                    <material.TextField
                                        label="Units"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("per_units_price", { required: true })}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <material.DateTimePicker
                                            label="From Date"
                                            value={fromDate}
                                            onChange={(newValue) => {
                                                setFromDate(newValue)
                                            }}
                                            renderInput={(params) => <material.TextField {...params}
                                                variant="standard"
                                                sx={{ minWidth: 220, p: 1 }}
                                            />}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <material.DateTimePicker
                                            label="To Date"
                                            value={toDate}
                                            onChange={(newValue) => {
                                                setToDate(newValue)
                                            }}
                                            renderInput={(params) => <material.TextField {...params}
                                                variant="standard"
                                                sx={{ minWidth: 220, p: 1 }}
                                            />}
                                        />
                                    </LocalizationProvider>
                                    <material.TextField
                                        label="Changed by"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("changed_by", { required: true })}
                                    />
                                    <material.TextField
                                        label="Time stamp"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        value={dateAndTimeFormat(date)}
                                    />
                                </div>
                            </div>
                        </material.TableContainer>
                        <hr />
                        <material.TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={salePriseData.length}
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

export default SalePriceManagement;