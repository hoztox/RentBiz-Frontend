import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../assets/Images/Admin Users Management/plus-icon.svg";
import downloadicon from "../../assets/Images/Admin Users Management/download-icon.svg";
import editicon from "../../assets/Images/Admin Users Management/edit-icon.svg";
import deletesicon from "../../assets/Images/Admin Users Management/delete-icon.svg";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import GenericTable from "../../components/ui/GenericTable";

const AdminUsers = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");

  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  const handleToggle = async (id, currentStatus, updateItem) => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      toast.error("Company ID not found. Please log in again.");
      return false;
    }

    const newStatus = currentStatus === "active" ? "blocked" : "active";

    try {
      await axios.put(`${BASE_URL}/company/users/${id}/`, {
        status: newStatus,
      });
      
      // Update the specific item in the table data
      updateItem(id, { status: newStatus });
      
      toast.success(`User ${newStatus} successfully.`);
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update user status. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const handleDelete = async (id, updateData) => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      toast.error("Company ID not found. Please log in again.");
      return false;
    }

    try {
      await axios.delete(`${BASE_URL}/company/users/${id}/`);
      toast.success("User deleted successfully.");
      if (updateData) updateData();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete user. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const statusFilterOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
  ];

  const ToggleSwitch = ({ id, isActive, onChange }) => {
    return (
      <div
        className={`toggle-switch ${isActive ? "active" : ""}`}
        onClick={onChange}
      >
        <div className="toggle-circle"></div>
      </div>
    );
  };

  const columns = {
    main: [
      {
        key: "id",
        label: "ID",
        className: "text-left user-data",
        render: (item, updateItem, index) => index + 1,
      },
      {
        key: "created_at",
        label: "CREATED DATE",
        className: "text-left user-data w-[12%]",
        render: (item) =>
          item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
      },
      {
        key: "name",
        label: "NAME",
        className: "text-left user-data w-[15%]",
      },
      {
        key: "username",
        label: "USERNAME",
        className: "text-left user-data",
      },
      {
        key: "user_role",
        label: "ROLE",
        className: "text-left user-data w-[18%] pl-12",
      },
      {
        key: "status",
        label: "STATUS",
        className: "text-left user-data w-[12%]",
        render: (item) => (
          <span
            className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
              item.status === "active"
                ? "bg-[#e1ffea] text-[#28C76F]"
                : "bg-[#FFE1E1] text-[#C72828]"
            }`}
          >
            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </span>
        ),
      },
      {
        key: "block",
        label: "BLOCK",
        className: "text-left user-data w-[8%]",
        render: (item, updateItem) => (
          <ToggleSwitch
            id={item.id}
            isActive={item.status === "blocked"}
            onChange={() => handleToggle(item.id, item.status, updateItem)}
          />
        ),
      },
      {
        key: "actions",
        label: "ACTION",
        className: "text-right pr-6",
        render: (item, updateItem) => (
          <div className="flex gap-[23px] items-center justify-end h-[57px]">
            <button onClick={() => handleEditUser(item)}>
              <img
                src={editicon}
                alt="Edit"
                className="w-[18px] h-[18px] action-btn duration-200"
              />
            </button>
            <button onClick={() => handleDelete(item.id, updateItem)}>
              <img
                src={deletesicon}
                alt="Delete"
                className="w-[18px] h-[18px] action-btn duration-200"
              />
            </button>
          </div>
        ),
      },
    ],
    mobile: [
      {
        key: "id",
        label: "ID",
        className: "text-left user-data user-id-column",
        render: (item, updateItem, index) => index + 1,
      },
      {
        key: "name",
        label: "NAME",
        className: "text-left user-data",
      },
      {
        key: "dropdown",
        label: "",
        className: "text-right",
      },
    ],
  };

  const handleEditUser = (user) => {
    openModal("user-update", "Edit User", {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      user_role: user.user_role,
      profile_image: user.company_logo || null,
    });
  };

  const customMobileRow = (item, updateItem) => (
    <div className="user-dropdown-content">
      <div className="user-grid">
        <div className="user-grid-item w-[33.33%]">
          <div className="dropdown-label">CREATED DATE</div>
          <div className="dropdown-value">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </div>
        </div>
        <div className="user-grid-item w-[35.33%]">
          <div className="dropdown-label">USERNAME</div>
          <div className="dropdown-value">{item.username || "N/A"}</div>
        </div>
        <div className="user-grid-item w-[20%]">
          <div className="dropdown-label">ROLE</div>
          <div className="dropdown-value">{item.user_role || "N/A"}</div>
        </div>
      </div>
      <div className="user-grid">
        <div className="user-grid-item w-[33.33%]">
          <div className="dropdown-label !mb-[10px]">STATUS</div>
          <div className="dropdown-value">
            <span
              className={`px-[10px] py-[5px] w-[53px] h-[24px] rounded-[4px] user-status ${
                item.status === "active"
                  ? "bg-[#e1ffea] text-[#28C76F]"
                  : "bg-[#FFE1E1] text-[#C72828] !pr-[5px] !pl-[5px]"
              }`}
            >
              {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
            </span>
          </div>
        </div>
        <div className="user-grid-item w-[35.33%]">
          <div className="dropdown-label">BLOCK</div>
          <div className="dropdown-value flex items-center gap-2 mt-[10px]">
            <ToggleSwitch
              id={item.id}
              isActive={item.status === "blocked"}
              onChange={() => handleToggle(item.id, item.status, updateItem)}
            />
          </div>
        </div>
        <div className="user-grid-item w-[20%]">
          <div className="dropdown-label">ACTION</div>
          <div className="dropdown-value flex items-center gap-[15px] ml-[5px] mt-[10px]">
            <button onClick={() => handleEditUser(item)}>
              <img
                src={editicon}
                alt="Edit"
                className="w-[18px] h-[18px] action-btn duration-200"
              />
            </button>
            <button onClick={() => handleDelete(item.id, updateItem)}>
              <img
                src={deletesicon}
                alt="Delete"
                className="w-[18px] h-[18px] action-btn duration-200"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      type: "dropdown",
      options: () => statusFilterOptions,
    },
  ];

  return (
    <>
      <Toaster />
      <GenericTable
        title="Users"
        apiEndpoint={(companyId) => `${BASE_URL}/company/users/company/${companyId}/`}
        columns={columns}
        filterOptions={filterOptions}
        dataKey="id"
        getCompanyId={getUserCompanyId}
        modalConfig={{
          create: {
            label: "Create User",
            icon: plusicon,
            onClick: () => openModal("user-create", "Create User"),
          },
        }}
        customMobileRow={customMobileRow}
        downloadEndpoint={(companyId) => `${BASE_URL}/company/users/company/${companyId}/export/`}
        customStyles={{
          container: "user-table",
          header: "user-table-header",
          title: "users-head",
          searchInput: "user-search",
          dropdown: "user-selection",
          createButton: "user-create-btn",
          downloadButton: "user-download-btn",
          table: "user-table",
          thead: "user-thead",
          tdata: "user-data",
          pagination: "user-pagination",
        }}
        refreshDependencies={[refreshCounter]}
      />
    </>
  );
};

export default AdminUsers;