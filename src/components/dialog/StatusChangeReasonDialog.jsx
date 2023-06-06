import React, { useState } from 'react';
import { material } from '../../library/material';
import { useForm } from 'react-hook-form';
import { changePlanStatus } from '../../services/PrescriberService';
import Snackbar from '../toastrmessage/Snackbar';

function StatusChangeReasonDialog(props) {

    const { openStatusChangeDialog, setOpenStatusChangeDialog } = props;
    const { register, handleSubmit, resetField, formState: { errors, isValid } } = useForm({
        mode: "onTouched",
    });
    const [openSnackBar, setOpenSnackBar] = useState({
        "action": false,
        "type": "",
        "message": "",
    });

    const changeStaus = async (data) => {
        resetField("reason")
        if (openStatusChangeDialog.data.action === "delete") {
            let obj = {
                "treatmentPlanRequestId": openStatusChangeDialog.data.treatmentPlanRequestId,
                "status": "REJECTED",
                "reason": data.reason
            }
            await changePlanStatus(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Rejected successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        } else if (openStatusChangeDialog.data.action === "approve") {
            let obj = {
                "treatmentPlanRequestId": openStatusChangeDialog.data.treatmentPlanRequestId,
                "status": "APPROVED",
                "reason": data.reason
            }
            await changePlanStatus(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Approved successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        } else if (openStatusChangeDialog.data.action === "pending") {
            let obj = {
                "treatmentPlanRequestId": openStatusChangeDialog.data.treatmentPlanRequestId,
                "status": "PENDING",
                "reason": data.reason
            }
            await changePlanStatus(obj)
                .then((resp) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "success",
                        "message": "Pending successfully",
                    })
                })
                .catch((error) => {
                    setOpenSnackBar({
                        "action": true,
                        "type": "error",
                        "message": "Something went wrong",
                    })
                })
        };
    };

    return (
        <div>
            <material.Dialog fullWidth maxWidth="md" open={openStatusChangeDialog.action} hideBackdrop >
                <material.DialogTitle className='d-flex flex-row' style={{ justifyContent: "space-between" }}>Status Change Reason
                </material.DialogTitle>
                <material.DialogContent>
                    <hr />
                    <div className='row'>
                        <div className="col-lg-12 col-md-12 col-sm-12 mb-2 mt-2">
                            <material.TextField
                                id="standard-error"
                                label="Reason"
                                variant="standard"
                                type="text"
                                size="small"
                                multiline
                                fullWidth
                                {...register("reason", { required: true })}
                                error={errors.reason?.type === "required"}
                            />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <span className='float-end'>
                            <material.Button variant="contained" size="medium" className='me-2' color='error' onClick={() => setOpenStatusChangeDialog({ action: false })}>
                                Cancel
                            </material.Button>
                            <material.Button variant="contained" size="medium" onClick={handleSubmit(changeStaus)} disabled={!isValid}>
                                Submit
                            </material.Button>
                        </span>
                    </div>
                </material.DialogContent>
            </material.Dialog>
            <Snackbar
                openSnackBar={openSnackBar}
                setOpenSnackBar={setOpenSnackBar}
            />
        </div>
    );
}

export default StatusChangeReasonDialog;