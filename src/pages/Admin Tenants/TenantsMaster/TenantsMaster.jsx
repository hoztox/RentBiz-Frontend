import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenantsMaster.css";
import plusicon from "../../../assets/Images/Admin Tenants/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenants/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenants/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenants/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";
import { BASE_URL } from "../../../utils/config";
import { useModal } from "../../../context/ModalContext";
import CustomDropDown from "../../../components/CustomDropDown";
import { toast, Toaster } from "react-hot-toast";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

const TenantsMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const itemsPerPage = 10;

  // Dropdown options
  const dropdownOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

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

  const companyId = getUserCompanyId();

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/company/tenant/company/${companyId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            search: searchTerm,
            status: statusFilter,
            page: currentPage,
            page_size: itemsPerPage,
          },
        }
      );

      setTenants(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      if (error.response?.status === 404 && currentPage > 1) {
        // auto-reset to page 1 if not found
        setCurrentPage(1);
      } else {
        console.error("Error fetching tenants:", error);
        setError(
          "Failed to fetch tenants: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when any dependency changes
  useEffect(() => {
    if (companyId) {
      fetchTenants();
    } else {
      setError("Company ID not found.");
      setLoading(false);
    }
  }, [
    companyId,
    refreshCounter,
    searchTerm,
    statusFilter,
    currentPage,
    itemsPerPage,
  ]);

  const handleDeleteTenant = async () => {
    if (!tenantToDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/company/tenant/${tenantToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 204) {
        setTenants(tenants.filter((tenant) => tenant.id !== tenantToDelete));
        toast.success("Tenant deleted successfully.");
        console.log("Tenants: Successfully deleted tenant", tenantToDelete);
      }
      setDeleteModalOpen(false);
      setTenantToDelete(null);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      setError(
        "Failed to delete tenant: " +
          (error.response?.data?.message || error.message)
      );
      setDeleteModalOpen(false);
      setTenantToDelete(null);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredData = tenants;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedData = filteredData;

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md tenant-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenant-table-header">
        <h1 className="tenant-head">Tenants</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenant-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenant-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Select"
                dropdownClassName="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenant-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md add-new-tenant duration-200"
              onClick={() => openModal("create-tenant", "Create New Tenant")}
            >
              Add New Tenant
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 tenant-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenant-thead">ID</th>
              <th className="px-5 text-left tenant-thead w-[15%]">DATE</th>
              <th className="pl-5 text-left tenant-thead w-[15%]">NAME</th>
              <th className="pl-5 text-left tenant-thead w-[20%]">CONTACTS</th>
              <th className="px-5 text-left tenant-thead w-[12%]">STATUS</th>
              <th className="pl-12 pr-5 text-left tenant-thead w-[15%]">
                ID TYPE
              </th>
              <th className="px-5 pr-6 text-right tenant-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenant-data">{tenant.code}</td>
                <td className="px-5 text-left tenant-data">
                  {new Date(tenant.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="pl-5 text-left tenant-data">
                  {tenant.tenant_name || "N/A"}
                </td>
                <td className="pl-5 text-left tenant-data">
                  {tenant.phone && tenant.email
                    ? `${tenant.phone}, ${tenant.email}`
                    : tenant.phone || tenant.email || "N/A"}
                </td>
                <td className="px-5 text-left tenant-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenant-status ${
                      tenant.status === "Active"
                        ? "bg-[#E6F5EC] text-[#1C7D4D]"
                        : tenant.status === "Inactive"
                        ? "bg-[#FDEAEA] text-[#D1293D]"
                        : "bg-[#FFF8E1] text-[#A67C00]"
                    }`}
                  >
                    {tenant.status || "N/A"}
                  </span>
                </td>
                <td className="pl-12 pr-5 text-left tenant-data">
                  {tenant.id_type?.title || "N/A"}
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button
                    onClick={() =>
                      openModal("edit-tenant", "Update Tenant", {
                        tenantId: tenant.id,
                      })
                    }
                  >
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setTenantToDelete(tenant.id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <img
                      src={deletesicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="tenant-table-row-head">
              <th className="px-5 text-left tenant-thead tenant-id-column w-[36%]">
                ID
              </th>
              <th className="px-3 text-left tenant-thead date-column w-[50%]">
                NAME
              </th>
              <th className="px-5 text-right tenant-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenant) => (
              <React.Fragment key={tenant.id}>
                <tr
                  className={`${
                    expandedRows[tenant.code]
                      ? "mobile-no-border"
                      : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenant-data">{tenant.code}</td>
                  <td className="px-3 text-left tenant-data date-column">
                    {tenant.tenant_name || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenant-dropdown-field ${
                        expandedRows[tenant.code] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(tenant.code)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenant-dropdown-img ${
                          expandedRows[tenant.code] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[tenant.code] && (
                    <motion.tr
                      className="bldg-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="tenant-dropdown-content">
                          <div className="tenant-grid">
                            <div className="tenant-grid-item">
                              <div className="dropdown-label">DATE</div>
                              <div className="dropdown-value w-[95px]">
                                {new Date(tenant.created_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                            <div className="tenant-grid-item w-[61%]">
                              <div className="dropdown-label">CONTACTS</div>
                              <div className="dropdown-value w-[113px]">
                                {tenant.phone && tenant.email
                                  ? `${tenant.phone}, ${tenant.email}`
                                  : tenant.phone || tenant.email || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="tenant-grid">
                            <div className="tenant-grid-item w-[36%]">
                              <div className="dropdown-label">STATUS</div>
                              <div className="dropdown-value">
                                <span
                                  className={`px-[10px] py-[5px] w-[65px] h-[24px] rounded-[4px] tenant-status ${
                                    tenant.status === "Active"
                                      ? "bg-[#E6F5EC] text-[#1C7D4D]"
                                      : tenant.status === "Inactive"
                                      ? "bg-[#FDEAEA] text-[#D1293D]"
                                      : "bg-[#FFF8E1] text-[#A67C00]"
                                  }`}
                                >
                                  {tenant.status || "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="tenant-grid-item w-[38%]">
                              <div className="dropdown-label">ID TYPE</div>
                              <div className="dropdown-value">
                                {tenant.id_type?.title || "N/A"}
                              </div>
                            </div>
                            <div className="tenant-grid-item w-[20%]">
                              <div className="dropdown-label">ACTION</div>
                              <div className="dropdown-value flex items-center gap-2 mt-[10px]">
                                <button
                                  onClick={() =>
                                    openModal("edit-tenant", "Update Tenant", {
                                      tenantId: tenant.id,
                                    })
                                  }
                                >
                                  <img
                                    src={editicon}
                                    alt="Edit"
                                    className="w-[18px] h-[18px] action-btn duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setTenantToDelete(tenant.id);
                                    setDeleteModalOpen(true);
                                  }}
                                >
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
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{" "}
          to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
          entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {startPage > 1 && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2 flex items-center">...</span>}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={startPage + i}
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${
                currentPage === startPage + i
                  ? "bg-[#1458A2] text-white"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
              }`}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages - 1 && (
            <span className="px-2 flex items-center">...</span>
          )}
          {endPage < totalPages && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        type="delete"
        title="Delete Tenant"
        message="Are you sure you want to delete this tenant?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleDeleteTenant}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTenantToDelete(null);
        }}
      />
    </div>
  );
};

export default TenantsMaster;
