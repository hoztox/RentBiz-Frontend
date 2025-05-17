import React from "react";
import AdminSidebar from "../components/Admin Sidebar/AdminSidebar";
import AdminNavbar from "../components/Admin Navbar/AdminNavbar";
import { Outlet } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import AdminCreateUserModal from "../components/AdminCreateUserModal/AdminCreateUserModal";
import EditUserModal from "./Admin Users Management/EditUserModal/EditUserModal";

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
    </div>
  );
};

export default Layout;