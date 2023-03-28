import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Addorganisation from '../components/add_organisation/Addorganisation'
import AddorgByInvite from '../components/add_org_by_invite/AddorgByInvite'
import Admin from '../components/admin/Admin'
import Clinic from '../components/clinic/Clinic'
import Login from '../components/login/Login'
import Usermanagement from '../components/usermanagement/Usermanagement'

export default function Routing() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Navigate to="/login"/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/organisation' element={<Admin/>}/>
                <Route path='/organisation/add_organisation' element={<Addorganisation/>}/>
                <Route path='/clinic' element={<Clinic/>}/>
                <Route path='/user_management' element={<Usermanagement/>}/>
                <Route path='/registerorganisation' element={<AddorgByInvite/>}/>
            </Routes>
        </div>
    )
}
