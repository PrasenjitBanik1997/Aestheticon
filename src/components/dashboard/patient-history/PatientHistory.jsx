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


let patientHistoryData = [];
let history = [];

function PatientHistory(props) {
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
    const [hide, setHide] = useState(true);

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
        navigate("/dashboard/patient-list/edit-patient", { state: { patientData } })
    };

    const addInfo = () => {
        setOpenHistory(true)
    };

    const handleClick = (data) => {
        setOpen({ action: true, patientHistory: data })
    };

    const getPatientHistoryData = (data) => {
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
                <div>
                    <div className="row">
                        {patientsHistory.map((ele, i) => (
                            <div className='col-3 mt-3' key={i}>
                                <material.Card sx={{ pt: 3, pb: 3, backgroundColor: "rgb(228, 251, 228)" }}>
                                    <material.CardActionArea onClick={() => handleClick(ele)}>
                                        <material.CardContent>
                                            <h6 className='text-center'>{localDateTimeFormat(ele.dateOfEntry)}</h6>
                                        </material.CardContent>
                                    </material.CardActionArea>
                                </material.Card>
                            </div>
                        ))}
                    </div>
                    {patientHistoryData.length ? (
                        <material.Paper className='p-4 mt-2' elevation={1}>
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
                        </material.Paper>
                    ) : null}
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
}

export default PatientHistory;