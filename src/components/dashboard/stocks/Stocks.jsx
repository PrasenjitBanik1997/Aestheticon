import React, { useEffect, useState } from 'react';
import SwipeDrawer from "../../drawer/Swipedrawer";
import { material } from '../../../library/material';
import { connect } from 'react-redux';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useForm } from 'react-hook-form';
import "./Stocks.css"
import { getAllClinic } from '../../../services/ClinicService';
import { getAllStocks, saveOrUpdateStock } from '../../../services/StocksService';
import moment from 'moment';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


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

var allClinicData;
var clinicId;

function Stocks(props) {

    const { userData } = props;
    let userDetails = userData.authReducer.data;
    const [stocksData, setStockesData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [isLoading, setisLoading] = useState(true);
    const [addStocksHideShow, setAddStocksHideShow] = useState(true);
    const [allClinic, setAllClinic] = useState([]);
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [dateIn, setDateIn] = React.useState();
    const { register, handleSubmit, resetField, formState: { errors, isValid } } = useForm({
        mode: "onTouched"
    });

    useEffect(() => {
        getClinics();
        allStocks()
    }, []);

    const allStocks = async () => {
        await getAllStocks()
            .then((resp) => {
                setStockesData(resp.data)
                setisLoading(false)
            })
    }

    const getClinics = async () => {
        await getAllClinic()
            .then((resp) => {
                allClinicData = resp.data;
                let clinicName = resp.data.map((ele) => ele.clinicName);
                setAllClinic(clinicName)
            })
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addStocks = () => {
        setAddStocksHideShow(false);
    };

    const selectClinic = (event, value) => {
        clinicId = allClinicData.filter((ele) => ele.clinicName === value).map((res) => res.clinicId)
    };

    const submit = async (fromData) => {
        resetField("supplier")
        resetField("product")
        resetField("productType")
        resetField("units")
        resetField("unitType")
        resetField("cost")
        resetField("comment")
        let obj = {
            "clinicId": clinicId[0],
            "orgId": userDetails.orgId,
            "active": 1,
            "supplier": fromData.supplier,
            "product": fromData.product,
            "productType": fromData.productType,
            "units": fromData.units,
            "unitType": fromData.unitType,
            "dateIn": moment(dateIn).format("YYYY-MM-DDTHH:mm:ss"),
            "cost": fromData.cost,
            "enitedBy": userDetails.userId,
            "comment": fromData.comment,
            "timeStamp": date,
            "createdAt": "2023-05-26T12:33:05.000Z",
            "updatedAt": "2023-05-26T12:33:05.000Z"
        }
        await saveOrUpdateStock(obj)
            .then((resp) => {
                allStocks()
            })
        setAddStocksHideShow(true)
    };

    return (
        <div className='body '>
            <SwipeDrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Stocks</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end" hidden={userDetails.role === "INJECTOR"}>
                        {addStocksHideShow ? (
                            <material.Button variant="contained" onClick={addStocks}>Add-Stock</material.Button>
                        ) : (
                            <material.Button variant="contained" onClick={handleSubmit(submit)} disabled={!isValid}>Submit</material.Button>
                        )}
                    </span>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <material.Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <material.TableContainer sx={{ maxHeight: 460 }}>
                            <material.Table stickyHeader aria-label="sticky table">
                                <material.TableHead >
                                    <material.TableRow>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Supplier</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Product</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Product Type</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Units</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Box/Vial</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Date in</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Cost</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Edited by</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Time stamp</StyledTableCell>
                                        <StyledTableCell sx={{ minWidth: 220 }}>Comments</StyledTableCell>
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
                                            {stocksData.length ? stocksData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <material.TableRow
                                                    key={i}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                    }}
                                                >
                                                    <material.TableCell sx={{ pt: 2, pb: 2 }} size='small'>{row.supplier}</material.TableCell>
                                                    <material.TableCell size='small'>{row.product}</material.TableCell>
                                                    <material.TableCell size='small'>{row.productType}</material.TableCell>
                                                    <material.TableCell size='small'>{row.units}</material.TableCell>
                                                    <material.TableCell size='small'>{row.unitType}</material.TableCell>
                                                    <material.TableCell size='small'>{row.dateIn}</material.TableCell>
                                                    <material.TableCell size='small'>{row.cost}</material.TableCell>
                                                    <material.TableCell size='small'>{row.enitedBy}</material.TableCell>
                                                    <material.TableCell size='small'>{row.timeStamp}</material.TableCell>
                                                    <material.TableCell size='small'>{row.comment}</material.TableCell>
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
                                    <material.Autocomplete
                                        id="area"
                                        sx={{ minWidth: 220, p: 1 }}
                                        onChange={selectClinic}
                                        options={allClinic}
                                        renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Clinic"
                                        // {...register({ required: true })}
                                        />}
                                    />
                                    <material.TextField
                                        label="Supplier"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("supplier", { required: true })}
                                    />
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
                                        {...register("units", { required: true })}
                                    />
                                    <material.TextField
                                        label="Box/Vial"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("unitType", { required: true })}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <material.DateTimePicker
                                            label="Date In"
                                            value={dateIn}
                                            onChange={(newValue) => {
                                                setDateIn(newValue)
                                            }}
                                            renderInput={(params) => <material.TextField {...params}
                                                // error={errors.dateOfEntry?.type === "required"}
                                                // {...register("dateOfEntry", { required: true })}
                                                variant="standard"
                                                sx={{ minWidth: 220, p: 1 }}
                                            />}
                                        />
                                    </LocalizationProvider>
                                    <material.TextField
                                        label="Cost"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("cost", { required: true })}
                                    />
                                    {/* <material.TextField
                                        label="Edited by"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("editedBy", { required: true })}
                                    /> */}
                                    <material.TextField
                                        label="Time stamp"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        value={dateAndTimeFormat(date)}
                                    // {...register("timeStamp", { required: true })}
                                    />
                                    <material.TextField
                                        label="Comments"
                                        size="small"
                                        variant='standard'
                                        sx={{ minWidth: 220, p: 1 }}
                                        {...register("comment", { required: true })}
                                    />
                                </div>
                            </div>
                        </material.TableContainer>
                        <hr />
                        <material.TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={stocksData.length}
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

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(Stocks);