import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from './pages/Admin Login/AdminLogin';
import Layout from './pages/Layout';
import AdminDashboard from './pages/Admin Dashboard/AdminDashboard';
import "./app.css"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/'>
          <Route index element={<AdminLogin />} />
        </Route>

        <Route path='/admin' element={<Layout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
