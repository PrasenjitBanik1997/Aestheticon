import React, { useEffect, useState } from 'react';
import { material } from '../../../library/material';
import { dateAndTimeFormat } from '../../../date-and-time-format/DateAndTimeFormat';
import { getPatientHistory } from '../../../services/PatientService';

function PatientHistory(props) {

    const { patientData, patientHistory } = props;
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getPatientHistoryByPatientId()
        console.log(patientData)
    }, []);

    const getPatientHistoryByPatientId = async () => {
        await getPatientHistory(patientData?patientData.patientId : patientHistory.patientId)
            .then((resp) => {
                setHistory(resp.data)
            })
    }

    return (
        <div className='mt-3'>
            <material.Typography variant="h5" className='mb-3'>History</material.Typography>
            {history?.map((ele, k) => (
                <span key={k}>
                    <ul className='fw-bold text-align-justify'>{ele.label} :
                        {ele.info.map((item, i) => (
                            <li key={i} className='ms-5 fw-normal'>{item.note} ({item.date})</li>
                        ))}
                    </ul>
                </span>
            ))}
            {patientHistory?.map((ele, k) => (
                <span key={k}>
                    <ul className='fw-bold text-align-justify'>{ele.label} :
                        {ele.info.map((item, i) => (
                            <li key={i} className='ms-5 fw-normal'>{item.note} ({item.date})</li>
                        ))}
                    </ul>
                </span>
            ))}
        </div>
    );
}

export default PatientHistory;