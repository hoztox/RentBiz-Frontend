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
import HorizontalFormTimeline from "./pages/Admin Properties/Buildings/Add Building Modal/HorizontalFormTimeline";
import ResponsiveBuildingInfoForm from "./pages/Admin Properties/Buildings/Add Building Modal/Create Building/ResponsiveBuildingInfoForm";
import ResponsiveDocumentForm from "./pages/Admin Properties/Buildings/Add Building Modal/Upload Documents/ResponsiveDocumentForm";
import SubmissionConfirmationResponsive from "./pages/Admin Properties/Buildings/Add Building Modal/Submit/SubmissionConfirmationResponsive";
import BuildingsReset from "./pages/Admin Properties/Buildings/Add Building Modal/BuildingsReset";
import UpdateHorizontalFormTimeline from "./pages/Admin Properties/Buildings/EditBuildingModal/UpdateHorizontalFormTimeline";
import ResponsiveUpdateBuildingInfoForm from "./pages/Admin Properties/Buildings/EditBuildingModal/UpdateBuilding/ResponsiveUpdateBuildingInfoForm";
import ResponsiveUpdateDocumentForm from "./pages/Admin Properties/Buildings/EditBuildingModal/Upload Documents/ResponsiveUpdateDocumentForm";
import UpdateSubmissionConfirmResponsive from "./pages/Admin Properties/Buildings/EditBuildingModal/Submit/UpdateSubmissionConfirmResponsive";
import HorizontalUnitFormTimeline from "./pages/Admin Properties/Units/Add Unit Modal/HorizontalUnitFormTimeline";
import UnitBuildingInfoForm from "./pages/Admin Properties/Units/Add Unit Modal/Select Building/UnitBuildingInfoForm";
import UnitInfoFormResponsive from "./pages/Admin Properties/Units/Add Unit Modal/Create Unit/UnitInfoFormResponsive";
import UnitDocumentsFormResponsive from "./pages/Admin Properties/Units/Add Unit Modal/Upload Documents/UnitDocumentsFormResponsive";
import UpdateBuildingsReset from "./pages/Admin Properties/Buildings/EditBuildingModal/UpdateBuildingsReset";
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
import UpdateFormtimelineResponsive from "./pages/Admin Properties/Units/Edit Unit Modal/UpdateFormtimelineResponsive";

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
          <Route path="masters-charge-code-type" element={<ChargeCodeType />} />
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
          <Route path="building-timeline" element={<HorizontalFormTimeline />} />
          <Route path="create-building" element={<ResponsiveBuildingInfoForm />} />
          <Route path="upload-documents" element={<ResponsiveDocumentForm />} />
          <Route path="submitted" element={<SubmissionConfirmationResponsive />} />
          <Route path="buildings-reset" element={<BuildingsReset />} />

          <Route path="update-building-timeline" element={<UpdateHorizontalFormTimeline />} />
          <Route path="update-building" element={<ResponsiveUpdateBuildingInfoForm />} />
          <Route path="update-building-upload-documents" element={<ResponsiveUpdateDocumentForm />} />
          <Route path="update-building-submitted" element={<UpdateSubmissionConfirmResponsive />} />
          <Route path="update-building-reset" element={<UpdateBuildingsReset />} />

          <Route path="unit-timeline" element={<HorizontalUnitFormTimeline />} />
          <Route path="unit-select-building-form" element={<UnitBuildingInfoForm />} />
          <Route path="unit-create-unit-form" element={<UnitInfoFormResponsive />} />
          <Route path="unit-upload-documents" element={<UnitDocumentsFormResponsive />} />
          <Route path="unit-submitted" element={<UnitSubmitPageResponsive />} />
          <Route path="unit-reset" element={<UnitsResets />} />

          <Route path="update-unit-timeline" element={<UpdateFormtimelineResponsive />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
    </ModalProvider>
  );
};

export default App;
