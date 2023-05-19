import React, { useState } from 'react';
import { material } from '../../../library/material';
import { treatmentAreaData } from './Treatment';
import { useForm } from 'react-hook-form';

var treatmentName = [
    "Anti-Wrinkle",
    "Dermal Filler",
    "Skin Booster"
];

function AddTreatmentPlan(props) {

    const { openTreatmentPlan, setOpenTreatmentPlan, getTreatmentData } = props;
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
        setOpenTreatmentPlan(false)
        resetField("product")
        resetField("qty")
    }

    return (
        <div>
            <material.Dialog maxWidth="500px" open={openTreatmentPlan} hideBackdrop>
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
                                <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpenTreatmentPlan(false)}>
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
}

export default AddTreatmentPlan;