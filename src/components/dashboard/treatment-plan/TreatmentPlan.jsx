import React, { useEffect, useState, useRef } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createBlankTreatmentPlan, getClinicDetailsByClinicId, getInjectorDetails, getTreatmentPlanByPlanId, saveTreatmentPlan } from '../../../services/TreatmentPlanService';
import moment from 'moment';
import Snackbar from '../../toastrmessage/Snackbar';
import ConsentForm from '../consent-form/ConsentForm';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import AddTreatmentPlan from './AddTreatmentPlan';



var treatmentData = [];
var uploadImage = [];
var allImages = [];
var uniqueTreatmentName = [];

function TreatmentPlan(props) {

    const { userData, clinicData } = props;
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
    const [openConsentForm, setOpenConsentForm] = useState(true);
    const [openTreatmentPlan, setOpenTreatmentPlan] = useState(false);
    const [clinic, setClinic] = useState('');
    const [hideShow, setHideShow] = useState(true);
    const [close, setClose] = useState(true);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState([]);
    const [blankTreatmentData, setBlankTreatmentData] = useState([]);
    const [treatmentPlanData, setTreatmentPlanData] = useState();
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
        treatmentData = [];
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
                // setTreatmentPlanData(resp.data)
            })
    };

    const goBack = () => {
        navigate("/dashboard/patient-list/edit-patient", { state: { patientData } })
    };

    const openTreatment = () => {
        setOpenTreatmentPlan(true)
    };

    const getTreatmentData = (data) => {
        if (data !== "") {
            setHideShow(false)
        }
        treatmentData.push(data)
        let array = treatmentData.map((ele) => ele.treatment)
        uniqueTreatmentName = array.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
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
        allImages.push({ "image": photo });
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
            <material.Paper sx={{ pb: 3, mt: 2 }} className='container'>
                <div className='row ms-2'>
                    <div className='col-6 mt-2'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='fw-bold'>
                                    <td>Patient Id</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.patientId : patientData.patientId}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Patient Name</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.patientName : patientData.name}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Patient Date of Birth</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.patientDateOfBirth : patientData.dateOfBirth}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Injector Id</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.injectorId : userDetails.userId}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Injector Name</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.injectorName : userDetails.name}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Clinic Name</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.clinicName : clinic.clinicName}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Clinic Address</td>
                                    <td>{treatmentPlanData ? treatmentPlanData.clinicAddress : clinic.registeredOfficeAddress}</td>
                                </tr>
                                <tr className='fw-bold'>
                                    <td>Time Stamp</td>
                                    <td>{treatmentPlanData ? dateAndTimeFormat(treatmentPlanData.createdAt) : dateAndTimeFormat(date)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* {treatmentPlanData ? treatmentPlanData.targetAreaBefore.map((ele, k) => (
                        <div className='col-6 py-2' key={k}>
                            <img
                                src={ele}
                                height={100} width="25%"
                            />
                        </div>
                    )) : ( */}
                    <div className='col-6 py-2' hidden={close}>
                        {image ? (
                            <>
                                <span className='me-5'>
                                    {allImages.length ? allImages.map((ele, i) => (
                                        <img
                                            key={i}
                                            src={URL.createObjectURL(ele.image)}
                                            height={100} width="25%"
                                            onClick={() => showImage(ele.image)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    )) : ""}
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
                    {/* )} */}
                </div>
                <hr />
                <div className='row ms-2'>
                    <div hidden={treatmentPlanData}>
                        <span className="float-end">
                            {/* {close === true ? ( */}
                            <material.Button className='me-2' variant="contained" startIcon={<material.AddAPhotoIcon />} onClick={addPhoto} >Add Photo</material.Button>
                            {/* // ) : ""} */}
                            {/* {openConsentForm === true ? ( */}
                            <material.Button variant="contained" className='me-2' startIcon={<material.AddIcon />} onClick={openTreatment} >Add Treatment</material.Button>
                            {/* // ) : ""} */}
                        </span>
                    </div>
                    <div hidden={hideShow}>
                        {treatmentData.length ? treatmentData.map((ele, i) => (
                            <div className='row me-2 mt-3' key={i}>
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
                    treatmentData={treatmentData}
                    uniqueTreatmentName={uniqueTreatmentName}
                    blankTreatmentData={blankTreatmentData}
                    uploadImage={uploadImage}
                />
            </material.Paper>
            <AddTreatmentPlan
                openTreatmentPlan={openTreatmentPlan}
                setOpenTreatmentPlan={setOpenTreatmentPlan}
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