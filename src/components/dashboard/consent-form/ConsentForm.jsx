import React, { useEffect, useState } from 'react';
import Swipedrawer from '../../drawer/Swipedrawer';
import { material } from '../../../library/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';
import { getConsentFormIdByTreatmentPlanId, saveConsentFormSignature } from '../../../services/ConsentFormService';
import { connect } from 'react-redux';
import { getClinicDetailsByClinicId, saveTreatmentPlan } from '../../../services/TreatmentPlanService';
import Snackbar from '../../toastrmessage/Snackbar';

let sigPad = {};
let treatmentPlanData;

function ConsentForm(props) {

    const { clinicData, treatmentData, openConsentForm, blankTreatmentData, uploadImage, getTreatmentPlanData } = props;
    const [patientSignature, setPatientSignature] = useState(null);
    const [povSignature, setPovSignature] = useState(null);
    const [consentFormData, setConsentFormData] = useState();
    const [clinic, setClinic] = useState();
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });
    const navigate = useNavigate();
    const location = useLocation();
    // let treatmentData = location.state ? location.state.treatmentData : "";
    let patientData = location.state ? location.state.patientData : "";
    let treatmentPlanRequestId = location.state ? location.state.treatmentPlanRequestId : "";
    let clinicDetails = clinicData.clinicReducer.data;


    useEffect(() => {
        // getConsentFormData();
        // getClinicByClinicId();
        // treatmentType = treatmentData.treatmentPlan;
    }, []);

    const getConsentFormData = async () => {
        await getConsentFormIdByTreatmentPlanId(treatmentPlanRequestId.treatmentPlanRequestId)
            .then((resp) => {
                setConsentFormData(resp.data)
            })
    };

    const getClinicByClinicId = async () => {
        await getClinicDetailsByClinicId(clinicDetails.clinicId)
            .then((resp) => {
                setClinic(resp.data)
            })
    };

    const getPatientSignature = () => {
        setPatientSignature(sigPad.getTrimmedCanvas().toDataURL('image/png'))
        treatmentPlanData = treatmentData.map((ele) => {
            let obj = { ...ele, patientConcentSign: sigPad.getTrimmedCanvas().toDataURL('image/png') }
            return obj
        })
    };

    // const getPovSignature = () => {
    //     setPovSignature(sigPad.getTrimmedCanvas().toDataURL('image/png'))
    // };

    const saveConsentForm = async () => {
        let obj = {
            treatmentPlanRequestId: blankTreatmentData.treatmentPlanRequestId,
            patientId: blankTreatmentData.patientId,
            injectorId: blankTreatmentData.injectorId,
            timeStamp: blankTreatmentData.timeStamp,
            targetAreaBefore: uploadImage,
            treatmentPlan: treatmentPlanData
        };
        await saveTreatmentPlan(obj)
            .then((resp) => {
                console.log(resp)
                setOpenSnackBar({
                    "action": true,
                    "type": "success",
                    "message": "Save successfully",
                })
                // window.location.reload()
                getTreatmentPlanData(blankTreatmentData.treatmentPlanRequestId)
            })
            .catch((error) => {
                setOpenSnackBar({
                    "action": true,
                    "type": "error",
                    "message": "Something went wrong",
                })
            })
    }

    return (
        <div className='content' hidden={openConsentForm}>
            <material.Paper sx={{ width: "60%", mt: 2, m: 2, p: 3, pb: 10 }}>
                <div className='mt-2 fw-bold'>
                    {treatmentData.length ? treatmentData[0].treatment === "Dermal Filler" ? (
                        <span className='d-flex justify-content-center'>Consent Form for Dermal Filler Treatments</span>
                    ) : treatmentData[0].treatment === "Anti-Wrinkle" ? (
                        <span className='d-flex justify-content-center'>Consent Form for Anti-Wrinkle Treatments</span>
                    ) : "" : ""}
                </div>
                <div className='mt-5 ms-5'>
                    {treatmentData.length ? treatmentData[0].treatment === "Anti-Wrinkle" ? (
                        <div className='mb-3'>
                            <span>
                                Anti-wrinkle Injections cause relaxation of targeted muscles, which can take up to 2 weeks before starting to
                                work and the effect lasts approximately 3-4 months.
                            </span>
                        </div>
                    ) : "" : ""}
                    <span>
                        The risks associated with the above treatment include but are not limited to the following:
                    </span>
                    <ul className='ms-3'>
                        <li>Localised burning or stinging pain during injection</li>
                        <li>Bruising</li>
                        <li>Redness</li>
                        <li>Tenderness</li>
                        <li>Mild swelling at the injection site of Infection at the injection site</li>
                        <li>An uneven/inadequate result – may require additional treatment at review</li>
                        <li>Headache, nausea, cold like symptoms after treatment </li>
                    </ul>
                    <span>
                        Uncommon and rare effects include:
                    </span>
                    {treatmentData.length ? treatmentData[0].treatment === "Anti-Wrinkle" ? (
                        <ul className='ms-3'>
                            <li>Temporary drooping of eyelids</li>
                            <li>Temporary drooping of eyebrows</li>
                            <li>Puffy eyes</li>
                            <li>Uneven smile</li>
                            <li>Ineffectiveness due to antibody development</li>
                            <li>Prolonged sensitivity/pain at the treated sites</li>
                            <li>Infection and subsequent scar formation</li>
                            <li>Immediate hypersensitivity reactions including anaphylaxis</li>
                        </ul>
                    ) : treatmentData[0].treatment === "Dermal Filler" ? (
                        <ul className='ms-3'>
                            <li>Permanent granuloma/nodule/lump formation that may require surgical correction and may be untreatable.</li>
                            <li>Necrosis of the skin</li>
                            <li>Prolonged redness</li>
                            <li>Prolonged sensitivity/pain at the treated sites</li>
                            <li>Scar formation after injection (keloid)</li>
                            <li>Infection and subsequent scar formation</li>
                            <li>Nerve damage and resulting numbness and relaxation</li>
                            <li>Immediate hypersensitivity reactions including anaphylaxis</li>
                            <li>Nasolacrimal duct obstruction, blindness (when treating around the eye area)</li>
                        </ul>
                    ) : "" : ""}
                    <span>
                        I confirm that:
                    </span>
                    <ul className='ms-3'>
                        <li>I have disclosed all medical history.</li>
                        <li>I am not pregnant nor breastfeeding or planning to be pregnant in the next 3 months.</li>
                        <li>I have no known allergies to the proposed treatment.</li>
                        <li>I have no active infection in the area being treated today.</li>
                        <li>I do  not have a neuromuscular disorder (e.g myasthenia gravis or Eaton Lambert Syndrome)</li>
                        <li>I am aware that bleeding, bruising, swelling, or infection may occur at the area of treatment.</li>
                        <li>I have been adequately informed about the procedure including the potential benefits and limitations.</li>
                        <li>I understand that results are not guaranteed and I accept the risks, side effects and possible complications inherent in undergoing anti-wrinkle treatments.</li>
                        <li>I understand that if there is a complication that requires medical intervention, there may be an additional fee for the treatment.</li>
                        <li>I understand that no refunds will be given once the treatment has been administered.</li>
                        <li>I understand that I may require further treatment, depending on the outcome to achieve the desired result at my own cost.</li>
                        <li>I consent to having my photo taken for before and after purposes for clinical review.</li>
                        <li>I confirm that I am 18 yrs old and/or above.</li>
                    </ul>
                    <div className='mt-5 d-flex'>
                        <span>Patient Signature</span>
                        <span className='sigBox ms-3'>
                            <SignaturePad penColor='black'
                                canvasProps={{ width: 300, height: 50, className: 'sigPad' }}
                                ref={(ref) => { sigPad = ref }}
                                onEnd={getPatientSignature}
                            />
                        </span>
                    </div>
                    {/* <div className='mt-3 d-flex'>
                            <span>Treatment Provider Signature</span>
                            <span className='sigBox ms-3'>
                                <SignaturePad penColor='black'
                                    canvasProps={{ width: 300, height: 50, className: 'sigPad' }}
                                    ref={(ref) => { sigPad = ref }}
                                    onEnd={getPovSignature}
                                />
                            </span>
                        </div> */}
                </div>
                <hr />
                <div>
                    <span className="float-end me-5">
                        <material.Button variant="contained" onClick={saveConsentForm}>Save</material.Button>
                    </span>
                </div>
            </material.Paper>
            <div>
                <Snackbar
                    openSnackBar={openSnackBar}
                    setOpenSnackBar={setOpenSnackBar}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state,
        clinicData: state
    };
};

export default connect(mapStateToProps)(ConsentForm);