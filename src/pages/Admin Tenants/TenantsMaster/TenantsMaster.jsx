import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenantsMaster.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Tenants/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenants/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenants/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenants/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";
import DeleteTenantModal from "../DeleteTenantModal/DeleteTenantModal";
import { BASE_URL } from "../../../utils/config";
import { useModal } from "../../../context/ModalContext";

const TenantsMaster = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const itemsPerPage = 10;

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

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/tenant/company/${companyId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      console.log("Tenants: Fetched tenants:", data);
      setTenants(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setError(
        "Failed to fetch tenants: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchTenants();
    } else {
      setError("Company ID not found.");
      setLoading(false);
    }
  }, [companyId, refreshCounter]);

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

  const filteredData = tenants.filter(
    (tenant) =>
      (tenant.tenant_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (tenant.address?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (tenant.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tenant.tenant_type?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (tenant.status?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tenant.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tenant.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tenant.id_type?.title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md tenant-table">
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
              <select
                name="select"
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenant-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
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
                  {tenant.phone || "N/A"}
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
                  <button onClick={() => openModal("edit-tenant", "Tenant Details", { tenantId: tenant.id })}>
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
                {expandedRows[tenant.code] && (
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
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
                                onClick={() => openModal("edit-tenant", "Tenant Details", { tenantId: tenant.id })}
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
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
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
      <DeleteTenantModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTenantToDelete(null);
        }}
        onDelete={handleDeleteTenant}
      />
    </div>
  );
};

export default TenantsMaster;