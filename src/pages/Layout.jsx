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
import AddMonthlyInvoiceModal from "./Monthly Invoice/AddMonthlyInvoiceModal/AddMonthlyInvoiceModal";
import ViewMonthlyInvoiceModal from "./Monthly Invoice/ViewMonthlyInvoiceModal/ViewMonthlyInvoiceModal";
import AddCollectionModal from "./Collection/AddCollectionModal/AddCollectionModal";
import UpdateCollectionModal from "./Collection/UpdateCollectionModal/UpdateCollectionModal";
import AddExpenseModal from "./Expense/AddExpenseModal/AddExpenseModal";
import UpdateExpenseModal from "./Expense/UpdateExpenseModal/UpdateExpenseModal";
import AddRefundModal from "./Refund/AddRefundModal/AddRefundModal";
import UpdateRefundModal from "./Refund/UpdateRefundModal/UpdateRefundModal";
import CreateTaxModal from "./Admin Masters/Taxes/CreateTaxModal/CreateTaxModal";
import UpdateTaxModal from "./Admin Masters/Taxes/UpdateTaxModal/UpdateTaxModal";
import CreateTenantModal from "./Admin Tenants/CreateTenantModal/CreateTenantModal";
import AddBuildingModal from "./Admin Properties/Buildings/Add Building Modal/AddBuildingModal";
import EditBuildingModal from "./Admin Properties/Buildings/EditBuildingModal/EditBuildingModal";
import AddUnitModal from "./Admin Properties/Units/Add Unit Modal/AddUnitModal";
import EditUnitModal from "./Admin Properties/Units/Edit Unit Modal/EditUnitModal";
import EditTenantModal from "./Admin Tenants/EditTenantModal/EditTenantModal";
import InvoiceConfig from "./Admin Tenancy/UpdateTenancyModal/InvoiceConfig";

const Layout = () => {
  const { modalState, closeModal } = useModal();

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col sm:max-w-[calc(100vw-272px)]">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto bg-[white] p-5">
          <Outlet />
        </div>
      </div>
      {/* Conditionally render modals */}
      {modalState.isOpen && modalState.type === "user-create" && <AdminCreateUserModal />}
      {modalState.isOpen && modalState.type === "user-update" && <EditUserModal />}
      {modalState.isOpen && modalState.type === "create-building" && (
        <AddBuildingModal open={modalState.isOpen} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "edit-building" && (
        <EditBuildingModal
          open={modalState.isOpen}
          onClose={closeModal}
          buildingId={modalState.data?.buildingId}
        />
      )}
      {modalState.isOpen && modalState.type === "create-unit" && (
        <AddUnitModal open={modalState.isOpen} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "edit-unit" && (
        <EditUnitModal
          open={modalState.isOpen}
          onClose={closeModal}
          unitId={modalState.data?.unitId}
        />
      )}
      {modalState.isOpen && modalState.type === "create-tenant" && (
        <CreateTenantModal open={modalState.isOpen} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "edit-tenant" && (
        <EditTenantModal
          open={modalState.isOpen}
          onClose={closeModal}
          tenantId={modalState.data?.tenantId}
        />
      )}
      {modalState.isOpen && modalState.type === "tenancy-create" && <CreateTenancyModal />}
      {modalState.isOpen && modalState.type === "tenancy-update" && <UpdateTenancyModal />}
      {modalState.isOpen && modalState.type === "tenancy-view" && <TenancyViewModal />}
      {modalState.isOpen && modalState.type === "create-unit-type-master" && <CreateUnitTypeModal />}
      {modalState.isOpen && modalState.type === "update-unit-type-master" && <UpdateUnitTypeModal />}
      {modalState.isOpen && modalState.type === "create-id-type-master" && <CreateIdModal />}
      {modalState.isOpen && modalState.type === "update-id-type-master" && <UpdateIdModal />}
      {modalState.isOpen && modalState.type === "create-charge-code-type" && <CreateChargeCodeModal />}
      {modalState.isOpen && modalState.type === "update-charge-code-type" && <UpdateChargeCode />}
      {modalState.isOpen && modalState.type === "create-tax-master" && <CreateTaxModal />}
      {modalState.isOpen && modalState.type === "update-tax-master" && <UpdateTaxModal />}
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
      {modalState.isOpen && modalState.type === "create-monthly-invoice" && <AddMonthlyInvoiceModal />}
      {modalState.isOpen && modalState.type === "view-monthly-invoice" && <ViewMonthlyInvoiceModal />}
      {modalState.isOpen && modalState.type === "create-collection" && <AddCollectionModal />}
      {modalState.isOpen && modalState.type === "update-collection" && <UpdateCollectionModal />}
      {modalState.isOpen && modalState.type === "create-expense" && <AddExpenseModal />}
      {modalState.isOpen && modalState.type === "update-expense" && <UpdateExpenseModal />}
      {modalState.isOpen && modalState.type === "create-refund" && <AddRefundModal />}
      {modalState.isOpen && modalState.type === "update-refund" && <UpdateRefundModal />}
      {modalState.isOpen && modalState.type === "invoice-config" && <InvoiceConfig />}
    </div>
  );
};

export default Layout;