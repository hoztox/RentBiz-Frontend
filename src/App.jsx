import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from './pages/Admin Login/AdminLogin';
import Layout from './pages/Layout';
import AdminDashboard from './pages/Admin Dashboard/AdminDashboard';
import "./app.css"
import AdminUsers from './pages/Admin Users Management/AdminUsers';
import Buildings from './pages/Admin Properties/Buildings/Buildings';
import Units from './pages/Admin Properties/Units/Units';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/'>
          <Route index element={<AdminLogin />} />
        </Route>

        <Route path='/admin' element={<Layout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='users-manage' element={<AdminUsers />} />
          <Route path='buildings' element={<Buildings />} />
          <Route path='units' element={<Units />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
