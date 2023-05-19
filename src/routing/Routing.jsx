import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Addorganisation from '../components/add_organisation/Addorganisation';
import AddorgByInvite from '../components/add_org_by_invite/AddorgByInvite';
import Admin from '../components/admin/Admin';
import Clinic from '../components/clinic/Clinic';
import Login from '../components/login/Login';
import Usermanagement from '../components/usermanagement/Usermanagement';
import ProtectRoute from '../protect-route/ProtectRoute';
import Dashboard from '../components/dashboard/Dashboard';
import PatientManagement from '../components/dashboard/patient-management/PatientManagement';
import AddPatient from '../components/dashboard/add-patient/AddPatient';
import PatientHistory from '../components/dashboard/patient-history/PatientHistory';
import InjectorList from '../components/dashboard/injector-management/InjectorList';
import TreatmentPlan from '../components/dashboard/treatment-plan/TreatmentPlan';
import ApprovalWating from '../components/dashboard/approval-wating/ApprovalWating';
import ApprovalRequests from '../components/dashboard/approval-requests/ApprovalRequests';
import EditUserMangement from '../components/usermanagement/EditUserManagement';
import TreatmentPlanDetails from '../components/dashboard/treatment-plan-details/TreatmentPlanDetails';
import WatingRoom from '../components/dashboard/wating-room/WatingRoom';

export default function Routing() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/organisation' element={<ProtectRoute Component={Admin} />} />
                <Route path='/clinic/add_clinic' element={<ProtectRoute Component={Addorganisation} />} />
                <Route path='/organisation/add_organisation' element={<ProtectRoute Component={Addorganisation} />} />
                <Route path='/clinic' element={<ProtectRoute Component={Clinic} />} />
                <Route path='/user_management' element={<ProtectRoute Component={Usermanagement} />} />
                <Route path='/user_management/edit-user_management' element={<ProtectRoute Component={EditUserMangement} />} />
                <Route path='/registerorganisation' element={<AddorgByInvite />} />
                <Route path='/dashboard' element={<ProtectRoute Component={Dashboard} />} />
                <Route path='/dashboard/patient-list' element={<ProtectRoute Component={PatientManagement} />} />
                <Route path='/dashboard/patient-list/add-patient' element={<ProtectRoute Component={AddPatient} />} />
                <Route path='/dashboard/patient-list/edit-patient/treatment-plan' element={<ProtectRoute Component={TreatmentPlan} />} />
                <Route path='/dashboard/patient-list/edit-patient' element={<ProtectRoute Component={AddPatient} />} />
                <Route path='/dashboard/patient-list/edit-patient/patient-history' element={<ProtectRoute Component={PatientHistory} />} />
                <Route path='/dashboard/injector-list' element={<ProtectRoute Component={InjectorList} />} />
                <Route path='/dashboard/approval-waiting-quere' element={<ProtectRoute Component={ApprovalWating} />} />
                <Route path='/dashboard/approval-requests' element={<ProtectRoute Component={ApprovalRequests} />} />
                <Route path='/dashboard/waiting-room' element={<ProtectRoute Component={WatingRoom} />} />
                <Route path='/dashboard/waiting-room/treatment-plan-details' element={<ProtectRoute Component={TreatmentPlanDetails} />} />
            </Routes>
        </div>
    )
}
