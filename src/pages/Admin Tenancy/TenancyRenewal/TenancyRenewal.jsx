import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./TenancyRenewal.css";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";
import { BASE_URL } from "../../../utils/config";
import { useModal } from "../../../context/ModalContext";
import TenancyRenewalModal from "./TenancyRenewalModal/TenancyRenewalModal";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const TenancyRenewal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const itemsPerPage = 10;

  // Dropdown options for CustomDropDown
  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

  // State for selected dropdown value
  const [selectedOption, setSelectedOption] = useState("showing");

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

  const handleViewClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-view", "View Tenancy", tenancy);
  };

  const handleEditClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-update", "Update Tenancy", tenancy);
  };

  const handleRenewClick = (tenancy) => {
    openModal("tenancy-renew", "Renew Tenancy", {
      tenancyId: tenancy.id,
      tenant: tenancy.tenant || {
        id: tenancy.tenant?.id,
        tenant_name: tenancy.tenant?.tenant_name,
      },
      building: tenancy.building || {
        id: tenancy.building?.id,
        building_name: tenancy.building?.building_name,
      },
      unit: tenancy.unit || {
        id: tenancy.unit?.id,
        unit_name: tenancy.unit?.unit_name,
      },
    });
  };

  // Fetch tenancy data using Axios
  const fetchTenancies = async () => {
    try {
      const companyId = getUserCompanyId();
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/occupied/${companyId}/`
      );
      setTenancies(response.data);
      console.log("tenancies renewal:", response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tenancy data:", err);
      setError("Failed to fetch tenancy data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenancies();
  }, [refreshCounter]);

  const handleDelete = async (tenancyId) => {
    if (window.confirm("Are you sure you want to delete this tenancy?")) {
      try {
        await axios.delete(`${BASE_URL}/company/tenancies/${tenancyId}/`);
        await fetchTenancies();
        console.log(`Deleted tenancy with ID: ${tenancyId}`);
      } catch (error) {
        console.error("Error deleting tenancy:", error);
        alert("Failed to delete tenancy. Please try again.");
      }
    }
  };

  // Filter and sort tenancies based on search term and end date
  const filteredData = useMemo(() => {
    const filtered = tenancies.filter(
      (tenancy) =>
        tenancy.tenancy_code
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        "" ||
        tenancy.tenant?.tenant_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        "" ||
        tenancy.building?.building_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        "" ||
        tenancy.unit?.unit_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        "" ||
        tenancy.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        tenancy.end_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
    );

    // Sort by closest end date first (ascending order)
    return filtered.sort((a, b) => {
      const dateA = a.end_date ? new Date(a.end_date) : new Date("9999-12-31");
      const dateB = b.end_date ? new Date(b.end_date) : new Date("9999-12-31");
      return dateA - dateB;
    });
  }, [tenancies, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  if (loading) return <div className="p-5"></div>;
  if (error) return <div className="p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Renewal</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 trenew-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto trenew-second-row-container">
            <div className="relative flex-1 md:flex-none w-[60%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="h-[38px] px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 tenancy-selection"
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 trenew-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] trenew-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="trenew-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenancy-thead">ID</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">NAME</th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">
                BUILDING NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">
                UNIT NAME
              </th>
              <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">END DATE</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">STATUS</th>
              <th className="px-5 text-center tenancy-thead w-[10%]">RENEW</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[10%]">
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
                  {tenancy.tenant?.tenant_name}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.building?.building_name}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.unit?.unit_name}
                </td>
                <td className="px-5 tenancy-data">
                  <div className="flex justify-center">
                    {tenancy.rental_months}
                  </div>
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.end_date}
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
                <td className="px-5 text-center !text-[#1458a2] tenancy-data">
                  <button
                    onClick={() => handleRenewClick(tenancy)}
                    className="trenew-renew-btn"
                  >
                    Click to Renew
                  </button>
                </td>
                <td className="pl-14 text-center pr-5 pt-2">
                  <button onClick={() => handleViewClick(tenancy)}>
                    <img
                      src={viewicon}
                      alt="View"
                      className="w-[30px] h-[24px] trenew-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="pr-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleEditClick(tenancy)}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] trenew-action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => handleDelete(tenancy.id)}>
                    <img
                      src={deletesicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] trenew-delete-btn duration-200"
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
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-id-column">
                ID
              </th>
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-end-date-column">
                NAME
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
                      ? "trenew-mobile-no-border"
                      : "trenew-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data trenew-id-column">
                    {tenancy.tenancy_code}
                  </td>
                  <td className="px-3 text-left tenancy-data trenew-end-date-column">
                    {tenancy.tenant?.tenant_name}
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
                <AnimatePresence>
                  {expandedRows[tenancy.tenancy_code] && (
                    <motion.tr
                      className="trenew-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="tenancy-dropdown-content">
                          <div className="trenew-grid">
                            <div className="trenew-grid-item w-[40%]">
                              <div className="trenew-dropdown-label">
                                BUILDING NAME
                              </div>
                              <div className="trenew-dropdown-value">
                                {tenancy.building?.building_name}
                              </div>
                            </div>
                            <div className="trenew-grid-item w-[53%]">
                              <div className="trenew-dropdown-label">
                                UNIT NAME
                              </div>
                              <div className="trenew-dropdown-value">
                                {tenancy.unit?.unit_name}
                              </div>
                            </div>
                          </div>
                          <div className="trenew-grid">
                            <div className="trenew-grid-item w-[40%]">
                              <div className="trenew-dropdown-label">
                                RENTAL MONTHS
                              </div>
                              <div className="trenew-dropdown-value">
                                {tenancy.rental_months}
                              </div>
                            </div>
                            <div className="trenew-grid-item w-[53%]">
                              <div className="trenew-dropdown-label">
                                END DATE
                              </div>
                              <div className="trenew-dropdown-value">
                                {tenancy.end_date}
                              </div>
                            </div>
                          </div>
                          <div className="trenew-grid">
                            <div className="trenew-grid-item w-[40%]">
                              <div className="trenew-dropdown-label">RENEW</div>
                              <div className="trenew-dropdown-value !text-[#1458a2]">
                                <button
                                  onClick={() => handleRenewClick(tenancy)}
                                  className="trenew-renew-btn"
                                >
                                  Click to Renew
                                </button>
                              </div>
                            </div>
                            <div className="trenew-grid-item w-[26%]">
                              <div className="trenew-dropdown-label">VIEW</div>
                              <div className="trenew-dropdown-value">
                                <button
                                  onClick={() => handleViewClick(tenancy)}
                                >
                                  <img
                                    src={viewicon}
                                    alt="View"
                                    className="w-[30px] h-[24px] trenew-action-btn duration-200"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="trenew-grid-item w-[20%]">
                              <div className="trenew-dropdown-label flex justify-center">
                                ACTION
                              </div>
                              <div className="trenew-dropdown-value trenew-flex trenew-items-center mt-[10px] ml-[7px]">
                                <button
                                  onClick={() => handleEditClick(tenancy)}
                                >
                                  <img
                                    src={editicon}
                                    alt="Edit"
                                    className="w-[18px] h-[18px] trenew-action-btn duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => handleDelete(tenancy.id)}
                                >
                                  <img
                                    src={deletesicon}
                                    alt="Delete"
                                    className="w-[18px] h-[18px] trenew-delete-btn duration-200 ml-3"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 trenew-pagination-container">
        <span className="trenew-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto trenew-pagination-buttons">
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
      <TenancyRenewalModal />
    </div>
  );
};

export default TenancyRenewal;
