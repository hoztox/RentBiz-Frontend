import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenancyMaster.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Tenancy/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";

const TenancyMaster = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const { openModal, refreshCounter } = useModal();

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

  // Reusable function to fetch tenancies
  useEffect(() => {
    const fetchAndSortTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/company/${companyId}/`
        );
        // Sort tenancies by id in ascending order
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
        console.log("Fetched and sorted tenancies:", sortedTenancies);
      } catch (error) {
        console.error("Error fetching tenancies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortTenancies();
  }, [refreshCounter]);

  // Handle delete action
  const handleDelete = async (tenancyId) => {
    if (window.confirm("Are you sure you want to delete this tenancy?")) {
      try {
        await axios.delete(`${BASE_URL}/company/tenancies/${tenancyId}/`);
        console.log(`Deleted tenancy with ID: ${tenancyId}`);
      } catch (error) {
        console.error("Error deleting tenancy:", error);
        alert("Failed to delete tenancy. Please try again.");
      }
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-view", "View Tenancy", tenancy);
  };

  const handleEditClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-update", "Update Tenancy", tenancy);
  };

  // Filter tenancies based on search term
  const filteredData = tenancies.filter(
    (tenancy) =>
      tenancy.tenancy_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.tenant?.tenant_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.building?.building_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.unit?.unit_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenancy-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenancy-selection"
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
          <div className="flex gap-[10px] tenancy-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-[51%] md:w-[176px] h-[38px] rounded-md tenancy-add-new-tenancy duration-200"
              onClick={() => openModal("tenancy-create")}
            >
              Add New Tenancy
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] w-[16px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-[45%] md:w-[122px] h-[38px] rounded-md duration-200 tenancy-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] tenancy-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="tenancy-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenancy-thead">ID</th>
              <th className="px-5 text-left tenancy-thead w-[15%]">
                TENANT NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">
                BUILDING NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">
                UNIT NAME
              </th>
              <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">STATUS</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[8%]">
                VIEW
              </th>
              <th className="px-5 pr-6 text-right tenancy-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <tr
                key={tenancy.tenancy_code}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenancy-data">
                  {tenancy.tenancy_code}
                </td>
                <td className="px-5 text-left tenancy-data">
                  {tenancy.tenant?.tenant_name || "N/A"}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.building?.building_name || "N/A"}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.unit?.unit_name || "N/A"}
                </td>
                <td className="px-5 tenancy-data">
                  <div className="w-[50%] flex justify-center">
                    {tenancy.rental_months}
                  </div>
                </td>
                <td className="px-5 text-left tenancy-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenancy-status ${
                      tenancy.status === "active"
                        ? "bg-[#E8EFF6] text-[#1458A2]"
                        : tenancy.status === "pending"
                        ? "bg-[#FFF3E0] text-[#F57C00]"
                        : tenancy.status === "terminated"
                        ? "bg-[#FFE6E6] text-[#D32F2F]"
                        : tenancy.status === "closed"
                        ? "bg-[#E0E0E0] text-[#616161]"
                        : "bg-[#E0F7E0] text-[#388E3C]"
                    }`}
                  >
                    {tenancy.status.charAt(0).toUpperCase() +
                      tenancy.status.slice(1)}
                  </span>
                </td>
                <td className="pl-12 pr-5 pt-2 text-center">
                  <button onClick={() => handleViewClick(tenancy)}>
                    <img
                      src={viewicon}
                      alt="View"
                      className="w-[30px] h-[24px] tenancy-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleEditClick(tenancy)}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => handleDelete(tenancy.id)}>
                    <img
                      src={deletesicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] tenancy-action-btn duration-200"
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
            <tr className="tenancy-table-row-head">
              <th className="px-5 w-[50%] text-left tenancy-thead tenancy-id-column">
                ID
              </th>
              <th className="px-3 w-[50%] text-left tenancy-thead tenancy-tenant-column">
                TENANT NAME
              </th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <React.Fragment key={tenancy.tenancy_code}>
                <tr
                  className={`${
                    expandedRows[tenancy.tenancy_code]
                      ? "tenancy-mobile-no-border"
                      : "tenancy-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data tenancy-id-column">
                    {tenancy.tenancy_code}
                  </td>
                  <td className="px-3 text-left tenancy-data tenancy-tenant-column">
                    {tenancy.tenant?.tenant_name || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-dropdown-field ${
                        expandedRows[tenancy.tenancy_code] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(tenancy.tenancy_code)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenancy-dropdown-img ${
                          expandedRows[tenancy.tenancy_code] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[tenancy.tenancy_code] && (
                  <tr className="tenancy-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-dropdown-content">
                        <div className="tenancy-grid">
                          <div className="tenancy-grid-item">
                            <div className="tenancy-dropdown-label">
                              BUILDING NAME
                            </div>
                            <div className="tenancy-dropdown-value">
                              {tenancy.building?.building_name || "N/A"}
                            </div>
                          </div>
                          <div className="tenancy-grid-item">
                            <div className="tenancy-dropdown-label">
                              UNIT NAME
                            </div>
                            <div className="tenancy-dropdown-value">
                              {tenancy.unit?.unit_name || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-grid">
                          <div className="tenancy-grid-item">
                            <div className="tenancy-dropdown-label">
                              RENTAL MONTHS
                            </div>
                            <div className="tenancy-dropdown-value">
                              {tenancy.rental_months}
                            </div>
                          </div>
                          <div className="tenancy-grid-item">
                            <div className="tenancy-dropdown-label">STATUS</div>
                            <div className="tenancy-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenancy-status ${
                                  tenancy.status === "active"
                                    ? "bg-[#E8EFF6] text-[#1458A2]"
                                    : tenancy.status === "pending"
                                    ? "bg-[#FFF3E0] text-[#F57C00]"
                                    : tenancy.status === "terminated"
                                    ? "bg-[#FFE6E6] text-[#D32F2F]"
                                    : tenancy.status === "closed"
                                    ? "bg-[#E0E0E0] text-[#616161]"
                                    : "bg-[#E0F7E0] text-[#388E3C]"
                                }`}
                              >
                                {tenancy.status.charAt(0).toUpperCase() +
                                  tenancy.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-grid">
                          <div className="tenancy-grid-item">
                            <div className="tenancy-dropdown-label">VIEW</div>
                            <div className="tenancy-dropdown-value">
                              <button
                                onClick={() =>
                                  handleViewClick(tenancy)
                                }
                              >
                                <img
                                  src={viewicon}
                                  alt="View"
                                  className="w-[30px] h-[24px] tenancy-action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="tenancy-grid-item tenancy-action-column">
                            <div className="tenancy-dropdown-label">ACTION</div>
                            <div className="tenancy-dropdown-value tenancy-flex tenancy-items-center tenancy-gap-2">
                              <button
                                onClick={() =>
                                  handleEditClick( tenancy)
                                }
                              >
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                                />
                              </button>
                              <button onClick={() => handleDelete(tenancy.id)}>
                                <img
                                  src={deletesicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] tenancy-action-btn duration-200 ml-4"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tenancy-pagination-container">
        <span className="tenancy-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tenancy-pagination-buttons">
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
    </div>
  );
};

export default TenancyMaster;
