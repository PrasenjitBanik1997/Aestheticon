import React from 'react';
import { material } from '../../library/material';
import { useForm } from 'react-hook-form';



function AddPatientNote(props) {

    const { openPatientNote, setOpenPatientNote, getPatientHistoryData } = props;

    const { register, handleSubmit, resetField, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
    });

    const addNote = (fromData) => {
        getPatientHistoryData(fromData)
        setOpenPatientNote(false);
    };

    return (
        <div>
            <material.Dialog fullWidth maxWidth="lg" open={openPatientNote} hideBackdrop >
                <material.DialogTitle>Add Patient Note</material.DialogTitle>
                <material.DialogContent>
                    <div className='row'>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Allergies</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mb-2 mt-2">
                            <material.TextField
                                // error={errors.allergies?.type === "required"}
                                label="Allergies"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                multiline
                                fullWidth
                                // inputProps={{ style: { textTransform: 'capitalize' } }}
                                {...register("allergies")}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Medication</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                // error={errors.medication?.type === "required"}
                                multiline
                                label="Medication"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                // inputProps={{ style: { textTransform: 'capitalize' } }}
                                {...register("medication")}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Diagnosis</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                // error={errors.diagnosis?.type === "required"}
                                multiline
                                label="Diagnosis"
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                // inputProps={{ style: { textTransform: 'capitalize' } }}
                                {...register("diagnosis")}
                            />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpenPatientNote(false)}>
                                Cancel
                            </material.Button>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(addNote)} disabled={!isValid}>
                                Save
                            </material.Button>
                        </span>
                    </div>
                </material.DialogContent>
            </material.Dialog>
        </div>
    );
}

export default AddPatientNote;