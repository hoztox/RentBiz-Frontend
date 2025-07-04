import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin Login/AdminLogin';
import Layout from './pages/Layout';
import AdminDashboard from './pages/Admin Dashboard/AdminDashboard';
import './app.css';
import AdminUsers from './pages/Admin Users Management/AdminUsers';
import Buildings from './pages/Admin Properties/Buildings/Buildings';
import Units from './pages/Admin Properties/Units/Units';
import TenantsMaster from './pages/Admin Tenants/TenantsMaster/TenantsMaster';
import TenancyMaster from './pages/Admin Tenancy/TenancyMaster/TenancyMaster';
import TenancyConfirm from './pages/Admin Tenancy/TenancyConfirm/TenancyConfirm';
import TenancyRenewal from './pages/Admin Tenancy/TenancyRenewal/TenancyRenewal';
import TenancyTermination from './pages/Admin Tenancy/TenancyTermination/TenancyTermination';
import CloseTenancy from './pages/Admin Tenancy/CloseTenancy/CloseTenancy';
import DocumentType from './pages/Admin Masters/DocumentType/DocumentType';
import UnitType from './pages/Admin Masters/UnitType/UnitType';
import IdType from './pages/Admin Masters/IdType/IdType';
import Charges from './pages/Admin Masters/Charges/Charges';
import Translate from './pages/Admin Masters/Translate/Translate';
import Currency from './pages/Admin Masters/Masters Currency/Currency';
import AdditionalCharges from './pages/Additional Charges/AdditionalCharges';
import Invoice from './pages/Invoice/Invoice';
import MonthlyInvoice from './pages/Monthly Invoice/MonthlyInvoice';
import Collection from './pages/Collection/Collection';
import Expense from './pages/Expense/Expense';
import Refund from './pages/Refund/Refund';
// import TenancyReport from './pages/Tenancy Report/TenancyReport';
// import UpcomingCollection from './pages/UpcomingCollection/UpcomingCollection';
// import ReportCollection from './pages/ReportCollection/ReportCollection';
import IncomeExpenseReport from './pages/IncomeExpenseReport/IncomeExpenseReport';
import ChargeCodeType from './pages/Admin Masters/Charge Code Type/ChargeCodeType';
import { ModalProvider } from './context/ModalContext';
import Taxes from './pages/Admin Masters/Taxes/Taxes';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users-manage" element={<AdminUsers />} />
              <Route path="buildings" element={<Buildings />} />
              <Route path="units" element={<Units />} />
              <Route path="tenants" element={<TenantsMaster />} />
              <Route path="tenancy-master" element={<TenancyMaster />} />
              <Route path="tenancy-confirm" element={<TenancyConfirm />} />
              <Route path="tenancy-renewal" element={<TenancyRenewal />} />
              <Route path="tenancy-termination" element={<TenancyTermination />} />
              <Route path="tenancy-close" element={<CloseTenancy />} />
              <Route path="masters-unit-type" element={<UnitType />} />
              <Route path="masters-id-type" element={<IdType />} />
              <Route path="masters-charge-code" element={<ChargeCodeType />} />
              <Route path="masters-taxes" element={<Taxes />} />
              <Route path="masters-charges" element={<Charges />} />
              <Route path="masters-document-type" element={<DocumentType />} />
              <Route path="masters-translate" element={<Translate />} />
              <Route path="masters-currency" element={<Currency />} />
              <Route path="additional-charges" element={<AdditionalCharges />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="monthly-invoice" element={<MonthlyInvoice />} />
              <Route path="collection" element={<Collection />} />
              <Route path="expense" element={<Expense />} />
              <Route path="refund" element={<Refund />} />
              {/* <Route path="tenancy-report" element={<TenancyReport />} /> */}
              {/* <Route path="upcoming-collection" element={<UpcomingCollection />} /> */}
              {/* <Route path="collection-report" element={<ReportCollection />} /> */}
              <Route path="income-expense-report" element={<IncomeExpenseReport />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;