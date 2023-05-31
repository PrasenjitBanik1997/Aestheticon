import React, { useState } from 'react';
import { material } from '../../../library/material';
import { useForm } from 'react-hook-form';
import { addPatientHistory } from '../../../services/PatientService';
import Snackbar from '../../toastrmessage/Snackbar';
import moment from 'moment';
import AddCustomNote from '../../dialog/AddCustomNote';
import AddPatientNote from '../../dialog/AddPatientNote';



var patientNoteData = [];
var patientNote;
var patientCustomNote = [];

function ShowPatientNote(props) {

    const { dateValue, getAllPatientNote, patientData } = props;
    const [openPatientNote, setOpenPatientNote] = useState(false);
    const [openCustomNote, setOpenCustomNote] = useState(false);
    const [hideShow, setHideShow] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });

    const addInfo = () => {
        setOpenPatientNote(true)
    };

    const addCustomNote = () => {
        setOpenCustomNote(true)
    }

    const getPatientHistoryData = (data) => {
        if (data !== "") {
            setHideShow(true)
        }
        let array = [];
        patientNote = data
        array.push(data)
        const outputArray = array.map(obj => {
            const keys = Object.keys(obj);
            let data = keys.map(key => ({ [key]: obj[key] }));
            return data
        });
        patientNoteData = outputArray.flat();
    };

    const getCustomNote = (data) => {
        patientCustomNote.push(data)
        // let obj = { [data.key]: data.value }
        patientNoteData = [...patientNoteData, { [data.key]: data.value }]
    };

    const addNOte = async () => {
        let obj = {
            "patientId": patientData.patientId,
            "dateOfEntry": moment().format("YYYY-MM-DDTHH:mm:ss"),
            "history": patientNoteData
        }
        await addPatientHistory(obj)
            .then((res) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Note added successfully",
                })
                setHideShow(false)
                getAllPatientNote()
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
        <div>
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Patient Note</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" className='me-2' onClick={addInfo} startIcon={<material.AddIcon />}>Add-Note</material.Button>
                    </span>
                </div>
            </div>
            <hr />
            {dateValue[0].info.length ? dateValue[0].info.map((ele, k) => (
                <div className='row' key={k}>
                    <div className='col-lg-2 col-md-4 col-sm-12'>
                        <material.Typography sx={{ fontWeight: "bold" }}>{Object.keys(ele)}</material.Typography>
                    </div>
                    <div className='col-lg-10 col-md-8 col-sm-12'>
                        <material.Typography sx={{ fontWeight: "bold", textAlign:"justify" }}>{Object.values(ele)}</material.Typography>
                    </div>
                </div>
            )) : null}
            <hr />
            {hideShow ? (
                <div className='m-3'>
                    <span className='d-flex justify-content-between'>
                        <material.Typography variant="h5">Note</material.Typography>
                        <material.Button variant="contained" className='me-2' onClick={addCustomNote} startIcon={<material.AddIcon />} hidden={!hideShow}>Add-Custom-Note</material.Button>
                    </span>
                    <div className='row'>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Allergies</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mb-2 mt-2">
                            <material.TextField
                                label="Allergies"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                multiline
                                fullWidth
                                value={patientNote ? patientNote.allergies : ""}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Medication</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                multiline
                                label="Medication"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                value={patientNote ? patientNote.medication : ""}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Diagnosis</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                multiline
                                label="Diagnosis"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                value={patientNote ? patientNote.diagnosis : ""}
                            />
                        </div>
                    </div>
                    {patientCustomNote.length ? patientCustomNote.map((element, i) => (
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
                    )) : null}
                    <div className='row mt-5'>
                        <div className='col-lg-12 col-md-12 col-sm-12'>
                            <span className='float-end'>
                                <material.Button variant="contained" size="medium" onClick={addNOte}>
                                    Save
                                </material.Button>
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
            <AddPatientNote
                openPatientNote={openPatientNote}
                setOpenPatientNote={setOpenPatientNote}
                getPatientHistoryData={getPatientHistoryData}
            />
            <AddCustomNote
                openCustomNote={openCustomNote}
                setOpenCustomNote={setOpenCustomNote}
                getCustomNote={getCustomNote}
            />
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
}


export default ShowPatientNote;