import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenancyTermination.css";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import terminateicon from "../../../assets/Images/Admin Tenancy/terminate-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import CustomDropDown from "../../../components/CustomDropDown";
import TenancyTerminateModal from "./TenancyTerminateModal/TenancyTerminateModal";
import { motion, AnimatePresence } from "framer-motion";

const TenancyTermination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

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

  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found");
        }
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/occupied/${companyId}/`
        );
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tenancies:", err);
        setError("Failed to fetch tenancies. Please try again later.");
        setLoading(false);
      }
    };
    fetchTenancies();
  }, [refreshCounter]);

  const handleEditClick = (tenancy) => {
    openModal("tenancy-update", "Update Tenancy", tenancy);
  };

  const openTerminateModal = (tenancy) => {
    if (tenancy) {
      setSelectedTenancy(tenancy);
      setTerminateModalOpen(true);
    }
  };

  const handleTerminateSuccess = (updatedTenancy) => {
    setTenancies((prev) =>
      prev.map((t) =>
        t.id === updatedTenancy.id ? { ...t, ...updatedTenancy } : t
      )
    );
    setTerminateModalOpen(false);
    setSelectedTenancy(null);
  };

  const toggleRowExpand = (tenancy_code) => {
    setExpandedRows((prev) => ({
      ...prev,
      [tenancy_code]: !prev[tenancy_code],
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

  const filteredData = tenancies.filter(
    (tenancy) =>
      tenancy.status !== "terminated" &&
      tenancy.status !== "closed" &&
      (tenancy.tenant?.tenant_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        tenancy.building?.building_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tenancy.tenancy_code
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tenancy.unit?.unit_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (tenancy.end_date &&
          tenancy.end_date.toLowerCase().includes(searchTerm.toLowerCase())))
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
    return <div className="p-5">Loading tenancies...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Termination</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tterm-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto tterm-second-row-container">
            <div className="relative flex-1 md:flex-none w-[60%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="h-[38px] px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 tenancy-selection"
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 tterm-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] tterm-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="tterm-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">
                ID
              </th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">
                NAME
              </th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">
                BUILDING NAME
              </th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap w-[20%]">
                UNIT NAME
              </th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap w-[12%]">
                END DATE
              </th>
              <th className="px-4 pr-6 text-right tenancy-thead whitespace-nowrap">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 text-left tenancy-data">
                  {tenancy.tenancy_code}
                </td>
                <td className="px-4 text-left tenancy-data">
                  {tenancy.tenant?.tenant_name || "N/A"}
                </td>
                <td className="px-4 text-left tenancy-data">
                  {tenancy.building?.building_name || "N/A"}
                </td>
                <td className="px-4 text-left tenancy-data">
                  {tenancy.unit?.unit_name || "N/A"}
                </td>
                <td className="px-4 text-left tenancy-data">
                  {tenancy.end_date}
                </td>
                <td className="px-4 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <button onClick={() => handleEditClick(tenancy)}>
                      <img
                        src={editicon}
                        alt="Edit"
                        className="w-[18px] h-[18px] tterm-action-btn duration-200"
                      />
                    </button>
                    <button onClick={() => openTerminateModal(tenancy)}>
                      <img
                        src={terminateicon}
                        alt="Terminate"
                        className="w-[32px] h-[20px] tterm-terminate-btn duration-200"
                      />
                    </button>
                  </div>
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
              <th className="px-5 w-[53%] text-left tenancy-thead tterm-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left tenancy-thead tterm-end-date-column">
                Name
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
                      ? "tterm-mobile-no-border"
                      : "tterm-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data tterm-id-column">
                    {tenancy.tenancy_code}
                  </td>
                  <td className="px-5 text-left tenancy-data tterm-end-date-column">
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
                <AnimatePresence>
                  {expandedRows[tenancy.tenancy_code] && (
                    <motion.tr
                      className="tterm-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="tenancy-dropdown-content">
                          <div className="tterm-grid">
                            <div className="tterm-grid-item">
                              <div className="tterm-dropdown-label">
                                BUILDING NAME
                              </div>
                              <div className="tterm-dropdown-value">
                                {tenancy.building?.building_name || "N/A"}
                              </div>
                            </div>
                            <div className="tterm-grid-item">
                              <div className="tterm-dropdown-label">
                                UNIT NAME
                              </div>
                              <div className="tterm-dropdown-value">
                                {tenancy.unit?.unit_name || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="tterm-grid">
                            <div className="tterm-grid-item">
                              <div className="tterm-dropdown-label">
                                END DATE
                              </div>
                              <div className="tterm-dropdown-value">
                                {tenancy.end_date || "N/A"}
                              </div>
                            </div>
                            <div className="tterm-grid-item">
                              <div className="tterm-dropdown-label">ACTION</div>
                              <div className="tterm-dropdown-value tterm-flex tterm-items-center mt-[10px] ml-[5px]">
                                <button
                                  onClick={() => handleEditClick(tenancy)}
                                >
                                  <img
                                    src={editicon}
                                    alt="Edit"
                                    className="w-[18px] h-[18px] tterm-action-btn duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => openTerminateModal(tenancy)}
                                >
                                  <img
                                    src={terminateicon}
                                    alt="Terminate"
                                    className="w-[32px] h-[20px] ml-[10px] tterm-terminate-btn duration-200"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tterm-pagination-container">
        <span className="tterm-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tterm-pagination-buttons">
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
      <TenancyTerminateModal
        isOpen={terminateModalOpen}
        onCancel={() => setTerminateModalOpen(false)}
        onTerminate={handleTerminateSuccess}
        tenancy={selectedTenancy}
      />
    </div>
  );
};

export default TenancyTermination;