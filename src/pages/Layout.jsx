import AdminSidebar from "../components/Admin Sidebar/AdminSidebar";
import AdminNavbar from "../components/Admin Navbar/AdminNavbar";
import { Outlet } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import AdminCreateUserModal from "../components/AdminCreateUserModal/AdminCreateUserModal";
import EditUserModal from "./Admin Users Management/EditUserModal/EditUserModal";
import TenancyViewModal from "./Admin Tenancy/TenancyViewModal/TenancyViewModal";
import UpdateTenancyModal from "./Admin Tenancy/UpdateTenancyModal/UpdateTenancyModal";
import CreateTenancyModal from "./Admin Tenancy/CreateTenancy/CreateTenancyModal";
import CreateUnitTypeModal from "./Admin Masters/UnitType/CreateUnitTypeModal/CreateUnitTypeModal";
import UpdateUnitTypeModal from "./Admin Masters/UnitType/UpdateUnitTypeModal/UpdateUnitTypeModal";
import CreateIdModal from "./Admin Masters/IdType/CreateIdModal/CreateIdModal";
import UpdateIdModal from "./Admin Masters/IdType/UpdateIdModal/UpdateIdModal";
import CreateChargeCodeModal from "./Admin Masters/Charge Code Type/CreateChargeCodeModal/CreateChargeCodeModal";
import UpdateChargeCode from "./Admin Masters/Charge Code Type/UpdateChargeCodeModal/UpdateChargeCode";
import CreateChargesModal from "./Admin Masters/Charges/CreateChargesModal/CreateChargesModal";
import UpdateChargesModal from "./Admin Masters/Charges/UpdateChargesModal/UpdateChargesModal";
import AddDocumentModal from "./Admin Masters/DocumentType/AddDocumentModal/AddDocumentModal";
import UpdateDocumentModal from "./Admin Masters/DocumentType/UpdateDocumentModal/UpdateDocumentModal";
import AddCurrencyModal from "./Admin Masters/Masters Currency/AddCurrencyModal/AddCurrencyModal";
import UpdateCurrencyModal from "./Admin Masters/Masters Currency/UpdateCurrencyModal/UpdateCurrencyModal";
import AddChargesModal from "./Additional Charges/AddChargesModal/AddChargesModal";
import UpdateAdditionalCharges from "./Additional Charges/UpdateChargesModal/UpdateAdditionalCharges";
import AddInvoiceModal from "./Invoice/AddInvoiceModal/AddInvoiceModal";
import ViewInvoiceModal from "./Invoice/ViewInvoiceModal/ViewInvoiceModal";

const Layout = () => {
  const { modalState } = useModal();

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto bg-[white] p-5">
          <Outlet />
        </div>
      </div>
      {/* Conditionally render modals */}
      {modalState.isOpen && modalState.type === "user-create" && <AdminCreateUserModal />}
      {modalState.isOpen && modalState.type === "user-update" && <EditUserModal />}
      {modalState.isOpen && modalState.type === "tenancy-create" && <CreateTenancyModal />}
      {modalState.isOpen && modalState.type === "tenancy-update" && <UpdateTenancyModal />}
      {modalState.isOpen && modalState.type === "tenancy-view" && <TenancyViewModal />}
      {modalState.isOpen && modalState.type === "create-unit-type-master" && <CreateUnitTypeModal />}
      {modalState.isOpen && modalState.type === "update-unit-type-master" && <UpdateUnitTypeModal />}
      {modalState.isOpen && modalState.type === "create-id-type-master" && <CreateIdModal />}
      {modalState.isOpen && modalState.type === "update-id-type-master" && <UpdateIdModal />}
      {modalState.isOpen && modalState.type === "create-charge-code-type" && <CreateChargeCodeModal />}
      {modalState.isOpen && modalState.type === "update-charge-code-type" && <UpdateChargeCode />}
      {modalState.isOpen && modalState.type === "create-charges-master" && <CreateChargesModal />}
      {modalState.isOpen && modalState.type === "update-charges-master" && <UpdateChargesModal />}
      {modalState.isOpen && modalState.type === "create-document-type-master" && <AddDocumentModal />}
      {modalState.isOpen && modalState.type === "update-document-type-master" && <UpdateDocumentModal />}
      {modalState.isOpen && modalState.type === "add-currency-master" && <AddCurrencyModal />}
      {modalState.isOpen && modalState.type === "update-currency-master" && <UpdateCurrencyModal />}
      {modalState.isOpen && modalState.type === "create-additional-charges" && <AddChargesModal />}
      {modalState.isOpen && modalState.type === "update-additional-charges" && <UpdateAdditionalCharges />}
      {modalState.isOpen && modalState.type === "create-invoice" && <AddInvoiceModal />}
      {modalState.isOpen && modalState.type === "view-invoice" && <ViewInvoiceModal />}
    </div>
  );
};

export default Layout;