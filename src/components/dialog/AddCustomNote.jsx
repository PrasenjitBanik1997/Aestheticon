import React from 'react';
import { material } from '../../library/material';
import { useForm } from 'react-hook-form';

function AddCustomNote(props) {

    const { openCustomNote, setOpenCustomNote, getCustomNote } = props;
    const { register, handleSubmit, resetField, formState: { errors, isValid }, setValue } = useForm({
        mode: "onTouched",
    });
    const addCustomNote = (data) => {
        resetField("key")
        resetField("value")
        getCustomNote(data)
        setOpenCustomNote(false)
    }

    return (
        <div>
             <material.Dialog fullWidth maxWidth="lg" open={openCustomNote} hideBackdrop >
                <material.DialogTitle className='d-flex flex-row' style={{ justifyContent: "space-between" }}>Add Custom Note
                </material.DialogTitle>
                <material.DialogContent>
                    <hr />
                    <div className='row'>
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-2">
                            <material.Typography>Label</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mb-2 mt-2">
                            <material.TextField
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                multiline
                                fullWidth
                                {...register("key")}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-6">
                            <material.Typography>Description</material.Typography>
                        </div>
                        <div className="col-lg-10 col-md-8 col-sm-6 mt-2">
                            <material.TextField
                                multiline
                                id="standard-error"
                                variant="standard"
                                type="text"
                                size="small"
                                fullWidth
                                {...register("value")}
                            />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpenCustomNote(false)}>
                                Cancel
                            </material.Button>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(addCustomNote)} disabled={!isValid}>
                                Save
                            </material.Button>
                        </span>
                    </div>
                </material.DialogContent>
            </material.Dialog>
        </div>
    );
}

export default AddCustomNote;