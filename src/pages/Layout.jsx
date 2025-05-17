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
    </div>
  );
};

export default Layout;