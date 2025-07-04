import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../../assets/Images/Admin Buildings/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Buildings/download-icon.svg";
import editicon from "../../../assets/Images/Admin Buildings/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Buildings/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Buildings/downarrow.svg";
import { BASE_URL } from "../../../utils/config";
import { useModal } from "../../../context/ModalContext";
import GenericTable from "../../../components/ui/GenericTable";

const Buildings = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  const handleDelete = async (id, updateData) => {
    try {
      await axios.delete(`${BASE_URL}/company/buildings/${id}/`);
      toast.success("Building deleted successfully.");
      if (updateData) updateData();
      return true;
    } catch (error) {
      console.error("Error deleting building:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete building. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const handleEditClick = (building) => {
    openModal("edit-building", "Update Building", { buildingId: building.id });
  };

  const statusFilterOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const columns = {
    main: [
      {
        key: "code",
        label: "ID",
        className: "text-left bldg-data",
        render: (item) => item.code || "N/A",
      },
      {
        key: "created_at",
        label: "DATE",
        className: "text-left bldg-data w-[12%]",
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
        key: "building_name",
        label: "NAME",
        className: "text-left bldg-data w-[15%]",
        render: (item) => item.building_name || "N/A",
      },
      {
        key: "building_address",
        label: "ADDRESS",
        className: "text-left bldg-data",
        render: (item) => item.building_address || "N/A",
      },
      {
        key: "unit_count",
        label: "NO. OF UNITS",
        className: "text-left bldg-data w-[18%] pl-12",
        render: (item) => item.unit_count || "N/A",
      },
      {
        key: "status",
        label: "STATUS",
        className: "text-left bldg-data w-[12%]",
        render: (item) => (
          <span
            className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
              item.status === "active"
                ? "bg-[#e1ffea] text-[#28C76F]"
                : item.status === "inactive"
                ? "bg-[#FFE1E1] text-[#C72828]"
                : "bg-[#FFF4E1] text-[#FFA500]"
            }`}
          >
            {item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : "N/A"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "ACTION",
        className: "text-right pr-6",
        render: (item, updateData) => (
          <div className="flex gap-[23px] items-center justify-end h-[57px]">
            <button onClick={() => handleEditClick(item)}>
              <img
                src={editicon}
                alt="Edit"
                className="w-[18px] h-[18px] bldg-action-btn duration-200"
              />
            </button>
            <button onClick={() => handleDelete(item.id, updateData)}>
              <img
                src={deletesicon}
                alt="Delete"
                className="w-[18px] h-[18px] bldg-action-btn duration-200"
              />
            </button>
          </div>
        ),
      },
    ],
    mobile: [
      {
        key: "code",
        label: "ID",
        className: "text-left bldg-data bldg-id-column",
        render: (item) => item.code || "N/A",
      },
      {
        key: "building_name",
        label: "NAME",
        className: "text-left bldg-data bldg-date-column",
        render: (item) => item.building_name || "N/A",
      },
      {
        key: "dropdown",
        label: "",
        className: "text-right",
      },
    ],
  };

  const customMobileRow = (item, updateData) => (
    <div className="bldg-dropdown-content">
      <div className="bldg-grid">
        <div className="bldg-grid-item w-[45%]">
          <div className="bldg-dropdown-label">DATE</div>
          <div className="bldg-dropdown-value">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </div>
        </div>
        <div className="bldg-grid-item w-[60%]">
          <div className="bldg-dropdown-label">ADDRESS</div>
          <div className="bldg-dropdown-value">
            {item.building_address || "N/A"}
          </div>
        </div>
      </div>
      <div className="bldg-grid">
        <div className="bldg-grid-item w-[33%]">
          <div className="bldg-dropdown-label">NO. OF UNITS</div>
          <div className="bldg-dropdown-value">{item.unit_count || "N/A"}</div>
        </div>
        <div className="bldg-grid-item w-[27%]">
          <div className="bldg-dropdown-label">STATUS</div>
          <div className="bldg-dropdown-value">
            <span
              className={`px-[10px] py-[5px] w-[65px] h-[24px] rounded-[4px] bldg-status ${
                item.status === "active"
                  ? "bg-[#e1ffea] text-[#28C76F]"
                  : item.status === "inactive"
                  ? "bg-[#FFE1E1] text-[#C72828]"
                  : "bg-[#FFF4E1] text-[#FFA500]"
              }`}
            >
              {item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : "N/A"}
            </span>
          </div>
        </div>
        <div className="bldg-grid-item bldg-action-column w-[20%]">
          <div className="bldg-dropdown-label">ACTION</div>
          <div className="bldg-dropdown-value bldg-flex bldg-items-center bldg-gap-2">
            <button onClick={() => handleEditClick(item)}>
              <img
                src={editicon}
                alt="Edit"
                className="w-[18px] h-[18px] bldg-action-btn duration-200"
              />
            </button>
            <button onClick={() => handleDelete(item.id, updateData)}>
              <img
                src={deletesicon}
                alt="Delete"
                className="w-[18px] h-[18px] bldg-action-btn duration-200"
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

  const updateData = () => {
    const companyId = getUserCompanyId();
    if (!companyId) return;
    axios
      .get(`${BASE_URL}/company/buildings/company/${companyId}/`, {
        params: {
          search: searchTerm,
          status: "",
          page: 1,
          page_size: 10,
        },
      })
      .then((response) => {
        // Data refresh handled by GenericTable
      })
      .catch((error) => {
        console.error("Error refreshing data:", error);
        toast.error("Failed to refresh data.");
      });
  };

  return (
    <>
      <Toaster />
      <GenericTable
        title="Buildings"
        apiEndpoint={(companyId) => `${BASE_URL}/company/buildings/company/${companyId}/`}
        columns={columns}
        filterOptions={filterOptions}
        dataKey="id"
        getCompanyId={getUserCompanyId}
        modalConfig={{
          create: {
            label: "Add New Building",
            icon: plusicon,
            onClick: () => openModal("create-building", "Add New Building"),
          },
        }}
        customMobileRow={customMobileRow}
        downloadEndpoint={(companyId) => `${BASE_URL}/company/buildings/company/${companyId}/export/`}
        customStyles={{
          container: "bldg-table",
          header: "bldg-table-header",
          title: "bldg-head",
          searchInput: "units-search",
          dropdown: "bldg-selection",
          createButton: "bldg-add-new-building",
          downloadButton: "bldg-download-btn",
          table: "bldg-table",
          thead: "bldg-thead",
          tdata: "bldg-data",
          pagination: "bldg-pagination",
        }}
        refreshDependencies={[refreshCounter]}
        updateData={updateData}
      />
    </>
  );
};

export default Buildings;
