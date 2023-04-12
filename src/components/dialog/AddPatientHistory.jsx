import React from 'react';
import { material } from '../../library/material';
import { useForm } from 'react-hook-form';



function AddPatientHistory(props) {

    const { openHistory, setOpenHistory, getPatientHistoryData } = props;

    const { register, handleSubmit, resetField, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
    });

    const addHistory = (fromData) => {
        resetField("key");
        resetField("value");
        getPatientHistoryData(fromData);
        setOpenHistory(false);
    };

    return (
        <div>
            <material.Dialog maxWidth="500px" open={openHistory} hideBackdrop >
                <material.DialogTitle>Add Patient History</material.DialogTitle>
                <material.DialogContent>
                    <div className='row'>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Label</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mb-2 mt-2">
                            <material.TextField
                                error={errors.allergies?.type === "required"}
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                multiline
                                fullWidth
                                // inputProps={{ style: { textTransform: 'capitalize' } }}
                                {...register("key", { required: true })}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6">
                            <material.Typography>Description</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                error={errors.medication?.type === "required"}
                                multiline
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                // inputProps={{ style: { textTransform: 'capitalize' } }}
                                {...register("value", { required: true })}
                            />
                        </div>
                        <div className='col-lg-12 col-md-12 col-sm-12 mt-5'>
                            <span className='float-end'>
                                <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpenHistory(false)}>
                                    Cancel
                                </material.Button>
                                <material.Button variant="contained" size="medium" onClick={handleSubmit(addHistory)} disabled={!isValid}>
                                    Save
                                </material.Button>
                            </span>
                        </div>
                    </div>
                </material.DialogContent>
            </material.Dialog>
        </div>
    );
}

export default AddPatientHistory;