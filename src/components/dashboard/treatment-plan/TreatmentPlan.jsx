import React, { useEffect, useState, useRef } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { connect } from 'react-redux';
import { treatmentAreaData } from './Treatment';
import { createBlankTreatmentPlan, getClinicDetailsByClinicId, getInjectorDetails, getTreatmentPlanByPlanId, saveTreatmentPlan } from '../../../services/TreatmentPlanService';
import { useForm } from 'react-hook-form'
import moment from 'moment';
import Snackbar from '../../toastrmessage/Snackbar';
import ConsentForm from '../consent-form/ConsentForm';



let treatmentName = [
    "Anti-Wrinkle",
    "Dermal Filler",
    "Skin Booster"
];

let treatmentData = [];
let uploadImage = [];
let array = [];


function TreatmentPlan(props) {

    const { userData, clinicData } = props;
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [openConsentForm, setOpenConsentForm] = useState(true);
    const [open, setOpen] = useState(false);
    const [clinic, setClinic] = useState('');
    const [injectorData, setInjectorData] = useState('');
    const [hideShow, setHideShow] = useState(true);
    const [close, setClose] = useState(true);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState([]);
    const [blankTreatmentData, setBlankTreatmentData] = useState([]);
    const [openFullImage, setOpenFullImage] = useState({ "open": false, "image": "" });
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    let patientData = location.state ? location.state.patientData : "";
    let userDetails = userData.authReducer.data;
    let clinicDetails = clinicData.clinicReducer.data;

    useEffect(() => {
        getClinicByClinicId()
        createBlankTreatment()
        // if (blankTreatmentData !== "") {
        //     getTreatmentPlanData()
        // }
    }, []);

    const getClinicByClinicId = async () => {
        await getClinicDetailsByClinicId(clinicDetails.clinicId)
            .then((resp) => {
                setClinic(resp.data)
            })
    };

    const createBlankTreatment = async () => {
        let obj = {
            patientId: patientData.patientId,
            timeStamp: date
        };
        await createBlankTreatmentPlan(obj)
            .then((resp) => {
                setBlankTreatmentData(resp.data)
            })
    };

    const getTreatmentPlanData = async (value) => {
        await getTreatmentPlanByPlanId(value)
            .then((resp) => {
                console.log(resp.data)
            })
    };

    const goBack = () => {
        navigate("/dashboard/patient-list/edit-patient", { state: { patientData } })
    };

    const openTreatment = () => {
        setOpen(true)
    };

    const getTreatmentData = (data) => {
        if (data !== "") {
            setHideShow(false)
        }
        treatmentData.push(data)
    };

    const addPhoto = () => {
        setClose(false)
        openCamera();
        setImage("")
    };

    async function openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(stream);
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error(error);
        }
    };

    function closeCamera() {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    function capturePhoto() {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        canvas.toBlob(uploadPhoto, "image/jpeg");
        closeCamera();
    };

    async function uploadPhoto(photo) {
        setImage(photo)
        array.push({ "image": photo });
        var reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = function () {
            var base64data = reader.result;
            uploadImage.push(base64data);
        }
    };

    function toggleCamera() {
        if (stream) {
            closeCamera();
        } else {
            openCamera();
        }
    };

    const addConsentForm = () => {
        setOpenConsentForm(false)
    };

    const showImage = (image) => {
        setOpenFullImage({ "open": true, "image": image })
    };


    return (
        <div className='body'>
            <Swipedrawer />
            <div className='row'>
                <div className='col-6'>
                    <span><material.Typography variant="h5">Treatment Plan</material.Typography></span>
                </div>
                <div className='col-6'>
                    <span className="float-end">
                        <material.Button variant="contained" onClick={goBack} startIcon={<material.ReplyIcon />}>Back</material.Button>
                    </span>
                </div>
            </div>
            <material.Paper sx={{ pb: 3, mt: 2 }}>
                <div className='row ms-2'>
                    <div className='col-6 mt-2'>
                        <div>
                            <span className='fw-bold'>Patient Id : </span>
                            <span>{patientData.patientId}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Patient Name : </span>
                            <span>{patientData.name}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Patient Date of Birth : </span>
                            <span>{patientData.dateOfBirth}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Injector Id : </span>
                            <span>{userDetails.userId}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Injector Name : </span>
                            <span>{userDetails.name}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Clinic Name : </span>
                            <span>{clinic.clinicName}</span>
                        </div>
                        <div className='d-flex flex-lg-row flex-md-column'>
                            <span className='fw-bold'>Clinic Address : </span>
                            <span>{clinic.registeredOfficeAddress}</span>
                        </div>
                        <div>
                            <span className='fw-bold'>Time Stamp : </span>
                            <span>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <material.DateTimePicker
                                        label="Date Of Entry"
                                        value={date}
                                        onChange={(newValue) => {
                                            setDate(newValue)
                                        }}
                                        renderInput={(params) => <material.TextField {...params}
                                            variant="standard"
                                        />}
                                    />
                                </LocalizationProvider>
                            </span>
                        </div>
                    </div>
                    <div className='col-6 py-2' hidden={close}>
                        {image ? (
                            <>
                                <span className='me-5'>
                                    {array.length ? array.map((ele, i) => (
                                        <img
                                            key={i}
                                            src={URL.createObjectURL(ele.image)}
                                            height={100} width="25%"
                                            onClick={() => showImage(ele.image)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    )) : ""}
                                    {/* <span className='d-flex justify-content-center mt-2'>
                                        <material.Button variant="contained" onClick={reTakePhoto}>re-take photo</material.Button>
                                    </span> */}
                                </span>
                            </>
                        ) : (
                            <span>
                                <video ref={videoRef} autoPlay height={300} width="100%" />
                                <span className='d-flex justify-content-center mt-2'>
                                    <material.Button variant="contained" onClick={capturePhoto} startIcon={<material.CameraAltIcon />} >take photo</material.Button>
                                    <material.Button variant="contained" onClick={toggleCamera} className='ms-2'>
                                        {stream ? 'Close camera' : 'Open camera'}
                                    </material.Button>
                                </span>
                            </span>
                        )}
                    </div>
                </div>
                <hr />
                <div className='row ms-2'>
                    <div>
                        <span className="float-end">
                            {/* {close === true ? ( */}
                            <material.Button className='me-2' variant="contained" startIcon={<material.AddAPhotoIcon />} onClick={addPhoto} >Add Photo</material.Button>
                            {/* // ) : ""} */}
                            {openConsentForm === true ? (
                                <material.Button variant="contained" startIcon={<material.AddIcon />} onClick={openTreatment} >Add Treatment</material.Button>
                            ) : ""}
                        </span>
                    </div>
                    <div hidden={hideShow}>
                        {treatmentData.length ? treatmentData.map((ele, i) => (
                            <div className='row me-2 mt-3' key={i}>
                                <hr />
                                <div className='col-lg-3 col-md-6'>
                                    <material.TextField
                                        label="Treatment"
                                        id="standard-error"
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        value={ele.treatment}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                        inputProps={{ style: { textTransform: 'capitalize' } }}
                                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    />
                                </div>
                                <div className='col-lg-3 col-md-6'>
                                    <material.TextField
                                        label="Area"
                                        id="standard-error"
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={ele.area}
                                        InputProps={{ readOnly: true }}
                                        inputProps={{ style: { textTransform: 'capitalize' } }}
                                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    />
                                </div>
                                <div className='col-lg-3 col-md-6'>
                                    <material.TextField
                                        label="Product"
                                        id="standard-error"
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={ele.product}
                                        InputProps={{ readOnly: true }}
                                        inputProps={{ style: { textTransform: 'capitalize' } }}
                                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    />
                                </div>
                                <div className='col-lg-3 col-md-6 d-flex flex-row'>
                                    <material.TextField
                                        label="Qty"
                                        id="standard-error"
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={ele.qty}
                                        InputProps={{ readOnly: true }}
                                        inputProps={{ style: { textTransform: 'capitalize' } }}
                                        sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                    />
                                </div>
                            </div>
                        )) : ""}
                        <div className='mb-3'>
                            {openConsentForm === true ? (
                                <span className="float-end mt-5 me-3">
                                    <material.Button variant="contained" startIcon={<material.AddIcon />} onClick={addConsentForm}>Add Consent Form</material.Button>
                                </span>
                            ) : ""}
                        </div>
                    </div>
                </div>
                <ConsentForm
                    openConsentForm={openConsentForm}
                    setOpenConsentForm={setOpenConsentForm}
                    treatmentData={treatmentData}
                    blankTreatmentData={blankTreatmentData}
                    uploadImage={uploadImage}
                    getTreatmentPlanData={getTreatmentPlanData}
                />
            </material.Paper>
            <AddTreatment
                open={open}
                setOpen={setOpen}
                getTreatmentData={getTreatmentData}
            />
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
            <ShowFullImage
                openFullImage={openFullImage}
                setOpenFullImage={setOpenFullImage}
            />
        </div>
    );
};

const AddTreatment = (props) => {

    const { open, setOpen, getTreatmentData } = props;
    const [areaOption, setAreaOption] = useState([]);
    const [selectAreaData, setSelectAreaData] = useState("");
    const [selectTreatmentData, setSelectTreatmentData] = useState("");

    const { register, handleSubmit, resetField, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
    });

    const selectTreatment = (e, value) => {
        setSelectTreatmentData(value)
        let data = treatmentAreaData.areaData.filter((ele) => ele.name === value).map((resp) => resp.option);
        setAreaOption(data);
    };

    const selectArea = (e, value) => {
        setSelectAreaData(value)
    };

    const addTreatment = (data) => {
        getTreatmentData(data)
        setOpen(false)
        resetField("product")
        resetField("qty")
    }

    return (
        <div>
            <material.Dialog maxWidth="500px" open={open} hideBackdrop>
                <material.DialogTitle>Add Treatment</material.DialogTitle>
                <material.DialogContent>
                    <div className='row'>
                        <div className='col-12'>
                            <material.Autocomplete
                                id="treatment"
                                className='mt-3'
                                onChange={selectTreatment}
                                options={treatmentName}
                                renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Treatment"
                                    {...register("treatment", { required: true })}
                                />}
                            />
                        </div>
                        <div className='col-12'>
                            <material.Autocomplete
                                id="area"
                                className='mt-3'
                                onChange={selectArea}
                                options={areaOption}
                                renderInput={(params) => <material.TextField {...params} variant="standard" label="Select Area"
                                    {...register("area", { required: true })}
                                />}
                            />
                        </div>
                        <div className='col-12'>
                            <material.TextField
                                label="Product"
                                id="product"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                {...register("product", { required: true })}
                            />
                        </div>
                        <div className='col-12'>
                            <material.TextField
                                label="Qty"
                                id="qty"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                inputProps={{ style: { textTransform: 'capitalize' } }}
                                sx={{ marginTop: { xs: 3, sm: 3, md: 3 } }}
                                {...register("qty", { required: true })}
                            />
                        </div>
                        <div>
                            <span className='float-end mt-3'>
                                <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpen(false)}>
                                    Cancel
                                </material.Button>
                                <material.Button variant="contained" size="medium" onClick={handleSubmit(addTreatment)}>
                                    Add
                                </material.Button>
                            </span>
                        </div>
                    </div>
                </material.DialogContent>
            </material.Dialog>
        </div>
    )
};

const ShowFullImage = (props) => {

    const { openFullImage, setOpenFullImage } = props;

    return (
        <div>
            <material.Dialog maxWidth="500px" open={openFullImage.open} hideBackdrop sx={{ padding: "20px" }}>
                <material.DialogActions>
                    <material.CloseIcon onClick={() => setOpenFullImage({ "open": false, "image": "" })} sx={{ cursor: "pointer", margin: "10px" }} />
                </material.DialogActions>
                <material.DialogContent>
                    {openFullImage.image ? (
                        <img
                            src={URL.createObjectURL(openFullImage.image)}
                        />
                    ) : ""}
                </material.DialogContent>
            </material.Dialog>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(TreatmentPlan);