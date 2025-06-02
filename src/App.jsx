import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Admin Login/AdminLogin";
import Layout from "./pages/Layout";
import AdminDashboard from "./pages/Admin Dashboard/AdminDashboard";
import "./app.css";
import AdminUsers from "./pages/Admin Users Management/AdminUsers";
import Buildings from "./pages/Admin Properties/Buildings/Buildings";
import Units from "./pages/Admin Properties/Units/Units";
import TenantsMaster from "./pages/Admin Tenants/TenantsMaster/TenantsMaster";
import TenancyMaster from "./pages/Admin Tenancy/TenancyMaster/TenancyMaster";
import TenancyConfirm from "./pages/Admin Tenancy/TenancyConfirm/TenancyConfirm";
import TenancyRenewal from "./pages/Admin Tenancy/TenancyRenewal/TenancyRenewal";
import TenancyTermination from "./pages/Admin Tenancy/TenancyTermination/TenancyTermination";
import CloseTenancy from "./pages/Admin Tenancy/CloseTenancy/CloseTenancy";
import DocumentType from "./pages/Admin Masters/DocumentType/DocumentType";
import UnitType from "./pages/Admin Masters/UnitType/UnitType";
import IdType from "./pages/Admin Masters/IdType/IdType";
import Charges from "./pages/Admin Masters/Charges/Charges";
import Translate from "./pages/Admin Masters/Translate/Translate";
import Currency from "./pages/Admin Masters/Masters Currency/Currency";
import AdditionalCharges from "./pages/Additional Charges/AdditionalCharges";
import Invoice from "./pages/Invoice/Invoice";
import MonthlyInvoice from "./pages/Monthly Invoice/MonthlyInvoice";
import Collection from "./pages/Collection/Collection";
import Expense from "./pages/Expense/Expense";
import Refund from "./pages/Refund/Refund";
import TenancyReport from "./pages/Tenancy Report/TenancyReport";
import UpcomingCollection from "./pages/UpcomingCollection/UpcomingCollection";
import ReportCollection from "./pages/ReportCollection/ReportCollection";
import IncomeExpenseReport from "./pages/IncomeExpenseReport/IncomeExpenseReport";
import ChargeCodeType from "./pages/Admin Masters/Charge Code Type/ChargeCodeType";
import { ModalProvider } from "./context/ModalContext";
import HorizontalUnitFormTimeline from "./pages/Admin Properties/Units/Add Unit Modal/HorizontalUnitFormTimeline";
import UnitBuildingInfoForm from "./pages/Admin Properties/Units/Add Unit Modal/Select Building/UnitBuildingInfoForm";
import UnitInfoFormResponsive from "./pages/Admin Properties/Units/Add Unit Modal/Create Unit/UnitInfoFormResponsive";
import UnitDocumentsFormResponsive from "./pages/Admin Properties/Units/Add Unit Modal/Upload Documents/UnitDocumentsFormResponsive";
import UnitSubmitPageResponsive from "./pages/Admin Properties/Units/Add Unit Modal/Submit/UnitSubmitPageResponsive";
import UnitsResets from "./pages/Admin Properties/Units/Add Unit Modal/UnitsResets";
import ResponsiveTenantFormTimeline from "./pages/Admin Tenants/CreateTenantModal/ResponsiveTenantFormTimeline";
import ResponsiveTenantInfoForm from "./pages/Admin Tenants/CreateTenantModal/CreateTenant/ResponsiveTenantInfoForm";
import TenantDocumentFormResponsive from "./pages/Admin Tenants/CreateTenantModal/UploadDocuments/TenantDocumentFormResponsive";
import TenantSubmitConfirmResponsive from "./pages/Admin Tenants/CreateTenantModal/Submit/TenantSubmitConfirmResponsive";
import TenantsReset from "./pages/Admin Tenants/CreateTenantModal/TenantsReset";
import UpdateUnitBuildingInfoResponsive from "./pages/Admin Properties/Units/Edit Unit Modal/Select Building/UpdateUnitBuildingInfoResponsive";
import UpdateUnitInfoFormResponsive from "./pages/Admin Properties/Units/Edit Unit Modal/Update Unit/UpdateUnitInfoFormResponsive";
import UpdateUnitDocumentFormResponsive from "./pages/Admin Properties/Units/Edit Unit Modal/Upload Documents/UpdateUnitDocumentFormResponsive";
import UpdateUnitSubmitPageResponsive from "./pages/Admin Properties/Units/Edit Unit Modal/Submit/UpdateUnitSubmitPageResponsive";
import UpdateUnitsReset from "./pages/Admin Properties/Units/Edit Unit Modal/UpdateUnitsReset";
import UpdateFormTimelineRes from "./pages/Admin Properties/Units/Edit Unit Modal/UpdateFormTimelineRes";
import EditTenantFormTimelineRes from "./pages/Admin Tenants/EditTenantModal/EditTenantFormTimelineRes";
import ResUpdateTenantInfoForm from "./pages/Admin Tenants/EditTenantModal/UpdateTenant/ResUpdateTenantInfoForm";
import EditTenantDocFormRes from "./pages/Admin Tenants/EditTenantModal/UploadDocuments/EditTenantDocFormRes";
import SubmissionConfirmationRes from "./pages/Admin Tenants/EditTenantModal/Submit/SubmissionConfirmationRes";
import EditTenantsReset from "./pages/Admin Tenants/EditTenantModal/EditTenantsReset";
import Taxes from "./pages/Admin Masters/Taxes/Taxes";

const App = () => {
  return (
    <ModalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<AdminLogin />} />
        </Route>

        <Route path="/admin" element={<Layout />}>
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
          <Route path="tenancy-report" element={<TenancyReport />} />
          <Route path="upcoming-collection" element={<UpcomingCollection />} />
          <Route path="collection-report" element={<ReportCollection />} />
          <Route
            path="income-expense-report"
            element={<IncomeExpenseReport />}
          />


          <Route path="unit-timeline" element={<HorizontalUnitFormTimeline />} />
          <Route path="unit-select-building-form" element={<UnitBuildingInfoForm />} />
          <Route path="unit-create-unit-form" element={<UnitInfoFormResponsive />} />
          <Route path="unit-upload-documents" element={<UnitDocumentsFormResponsive />} />
          <Route path="unit-submitted" element={<UnitSubmitPageResponsive />} />
          <Route path="unit-reset" element={<UnitsResets />} />

          <Route path="update-unit-timeline" element={<UpdateFormTimelineRes />} />
          <Route path="update-select-building-form" element={<UpdateUnitBuildingInfoResponsive />} />
          <Route path="update-unit" element={<UpdateUnitInfoFormResponsive />} />
          <Route path="update-unit-upload-documents" element={<UpdateUnitDocumentFormResponsive />} />
          <Route path="update-unit-submitted" element={<UpdateUnitSubmitPageResponsive />} />
          <Route path="update-unit-reset" element={<UpdateUnitsReset />} />

          <Route path="tenant-timeline" element={<ResponsiveTenantFormTimeline />} />
          <Route path="create-tenant" element={<ResponsiveTenantInfoForm />} />
          <Route path="tenant-upload-documents" element={<TenantDocumentFormResponsive />} />
          <Route path="tenant-submitted" element={<TenantSubmitConfirmResponsive />} />
          <Route path="tenant-reset" element={<TenantsReset />} />

          <Route path="edit-tenant-timeline" element={<EditTenantFormTimelineRes />} />
          <Route path="edit-create-tenant" element={<ResUpdateTenantInfoForm />} />
          <Route path="edit-tenant-upload-docs" element={<EditTenantDocFormRes />} />
          <Route path="edit-tenant-submitted" element={<SubmissionConfirmationRes />} />
          <Route path="edit-tenant-reset" element={<EditTenantsReset />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ModalProvider>
  );
};

export default App;
