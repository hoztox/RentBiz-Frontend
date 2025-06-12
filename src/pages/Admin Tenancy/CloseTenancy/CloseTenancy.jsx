import React, { useState, useEffect } from "react";
import "./CloseTenancy.css";
import axios from "axios";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

const CloseTenancy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [selectedTenancyId, setSelectedTenancyId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const { openModal } = useModal();
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
    let companyId = null;

    if (role === "company") {
      companyId = localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      try {
        companyId = localStorage.getItem("company_id");
        companyId = companyId ? JSON.parse(companyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
      }
    }

    console.log("Company ID:", companyId); // Debug log
    return companyId;
  };

  // Fetch closed tenancies from backend
  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          console.error("No company ID found");
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/termination/${companyId}/`,
          {
            params: { status: "closed" },
          }
        );
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
        console.log("Fetched Tenancies:", response.data);
      } catch (error) {
        console.error("Error fetching tenancies:", error);
      }
    };
    fetchTenancies();
  }, []);

  // Map backend data to frontend format
  const formattedData = tenancies.map((tenancy) => {
    const formatted = {
      id: tenancy.id || "N/A",
      tenant: tenancy.tenant?.tenant_name || "N/A",
      building: tenancy.building?.building_name || "N/A",
      unit: tenancy.unit?.unit_name || "N/A",
      months: tenancy.rental_months?.toString() || "N/A",
      renew: tenancy.is_reniew ? "Click to Renew" : "N/A",
      endDate: tenancy.end_date || "N/A",
      view: viewicon,
      isClose: tenancy.is_close || false,
      tenancy_code: tenancy.tenancy_code,
    };
    console.log("Formatted Tenancy:", formatted);
    return formatted;
  });

  const filteredData = formattedData.filter(
    (tenancy) =>
      (tenancy.tenant || "N/A")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (tenancy.building || "N/A")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (tenancy.id || "N/A").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenancy.unit || "N/A")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (tenancy.renew || "N/A").toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Data:", filteredData); // Debug log

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("Paginated Data:", paginatedData); // Debug log

  useEffect(() => {
    if (filteredData.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredData, totalPages, currentPage]);

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      console.log("Expanded Rows:", newState); // Debug log
      return newState;
    });
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

  const openConfirmationModal = (id, action) => {
    setSelectedTenancyId(id);
    setConfirmationAction(action); // 'delete' or 'close'
    setShowConfirmationModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/company/tenancies/${id}/`);
      setTenancies(tenancies.filter((tenancy) => tenancy.id !== id));
      console.log("Deleted Tenancy ID:", id);
      setShowConfirmationModal(false); // Close modal
      setSelectedTenancyId(null); // Clear selected tenancy ID
      setConfirmationAction(null); // Clear action
    } catch (error) {
      console.error("Error deleting tenancy:", error);
    }
  };

  const handleViewClick = (formattedTenancy) => {
    const originalTenancy = tenancies.find(
      (t) => t.tenancy_code === formattedTenancy.tenancy_code
    );

    if (originalTenancy) {
      console.log("View Original Tenancy Data:", originalTenancy);
      openModal("tenancy-view", "View Tenancy", originalTenancy);
    } else {
      console.error(
        "Original tenancy data not found for:",
        formattedTenancy.tenancy_code
      );
      openModal("tenancy-view", "View Tenancy", formattedTenancy);
    }
  };

  // Handle close tenancy action
  const handleCloseTenancy = async (id) => {
    try {
      await axios.put(`${BASE_URL}/company/tenancies/${id}/`, {
        is_close: true,
        status: "closed",
      });
      setTenancies((prev) =>
        prev.map((tenancy) =>
          tenancy.id === id
            ? { ...tenancy, is_close: true, status: "closed" }
            : tenancy
        )
      );
      setShowConfirmationModal(false); // Close modal
      setSelectedTenancyId(null); // Clear selected tenancy ID
      setConfirmationAction(null); // Clear action
    } catch (error) {
      console.error("Error closing tenancy:", error);
    }
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Closing</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log("Search Term:", e.target.value); // Debug log
            }}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tclose-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto tclose-second-row-container">
            <div className="relative flex-1 md:flex-none w-[60%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="h-[38px] px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 tenancy-selection"
              />
            </div>
            <button className="flex items-center justify-center gap-2 md:w-[122px] h-[38px] rounded-md duration-200 tclose-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] tclose-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="tclose-desktop-only">
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
              <th className="pl-12 pr-5 text-center tenancy-thead w-[10%]">
                VIEW
              </th>
              <th className="px-5 text-center tenancy-thead w-[11%]">CLOSE</th>
              <th className="px-5 pr-6 text-right tenancy-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No tenancies found.
                </td>
              </tr>
            ) : (
              paginatedData.map((tenancy, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-5 text-left tenancy-data">
                    {tenancy.tenancy_code}
                  </td>
                  <td className="px-5 text-left tenancy-data">
                    {tenancy.tenant}
                  </td>
                  <td className="pl-5 text-left tenancy-data">
                    {tenancy.building}
                  </td>
                  <td className="pl-5 text-left tenancy-data">
                    {tenancy.unit}
                  </td>
                  <td className="px-5 tenancy-data">
                    <div className="w-[63%] flex justify-center">
                      {tenancy.months}
                    </div>
                  </td>
                  <td className="pl-5 text-left tenancy-data">
                    {tenancy.endDate}
                  </td>
                  <td className="pl-14 text-center pr-5 pt-2">
                    <button onClick={() => handleViewClick(tenancy)}>
                      <img
                        src={viewicon}
                        alt="View"
                        className="w-[30px] h-[24px] tclose-action-btn duration-200"
                      />
                    </button>
                  </td>
                  <td className="px-5 text-center">
                    <button
                      onClick={() => openConfirmationModal(tenancy.id, "close")}
                      disabled={tenancy.isClose}
                      className={`px-4 py-2 rounded-md tenancy-data ${
                        tenancy.isClose
                          ? "!text-gray-400 cursor-not-allowed"
                          : "!text-blue-600 hover:text-blue-800"
                      } duration-200`}
                    >
                      {tenancy.isClose ? "Closed" : "Click to Close"}
                    </button>
                  </td>
                  <td className="px-5 tclose-flex-gap-23 h-[57px] ml-[23px] flex !justify-center">
                    <button
                      onClick={() =>
                        openConfirmationModal(tenancy.id, "delete")
                      }
                    >
                      <img
                        src={deleteicon}
                        alt="Delete"
                        className="w-[18px] h-[18px] tclose-delete-btn duration-200"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="tenancy-table-row-head">
              <th className="px-5 w-[53%] text-left tenancy-thead tclose-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left tenancy-thead tclose-end-date-column">
                NAME
              </th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No tenancies found.
                </td>
              </tr>
            ) : (
              paginatedData.map((tenancy) => (
                <React.Fragment key={tenancy.id}>
                  <tr
                    className={`${
                      expandedRows[tenancy.id]
                        ? "tclose-mobile-no-border"
                        : "tclose-mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left tenancy-data">
                      {tenancy.tenancy_code}
                    </td>
                    <td className="px-5 text-left tenancy-data tclose-end-date-column">
                      {tenancy.tenant}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`tenancy-dropdown-field ${
                          expandedRows[tenancy.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(tenancy.id)}
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`tenancy-dropdown-img ${
                            expandedRows[tenancy.id] ? "text-white" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[tenancy.id] && (
                      <motion.tr
                        className="tclose-mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="px-5">
                          <div className="tenancy-dropdown-content">
                            <div className="tclose-grid">
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  BUILDING NAME
                                </div>
                                <div className="tclose-dropdown-value">
                                  {tenancy.building}
                                </div>
                              </div>
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  UNIT NAME
                                </div>
                                <div className="tclose-dropdown-value">
                                  {tenancy.unit}
                                </div>
                              </div>
                            </div>
                            <div className="tclose-grid">
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  RENTAL MONTHS
                                </div>
                                <div className="tclose-dropdown-value">
                                  {tenancy.months}
                                </div>
                              </div>
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  END DATE
                                </div>
                                <div className="tclose-dropdown-value">
                                  {tenancy.endDate}
                                </div>
                              </div>
                            </div>
                            <div className="tclose-grid">
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  VIEW
                                </div>
                                <div className="tclose-dropdown-value">
                                  <button
                                    onClick={() => handleViewClick(tenancy)}
                                  >
                                    <img
                                      src={tenancy.view}
                                      alt="View"
                                      className="w-[30px] h-[24px] tclose-action-btn duration-200"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  CLOSE
                                </div>
                                <div className="tclose-dropdown-value">
                                  <button
                                    onClick={() =>
                                      openConfirmationModal(tenancy.id, "close")
                                    }
                                    disabled={tenancy.isClose}
                                    className={`py-2 rounded-md font-medium ${
                                      tenancy.isClose
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-blue-600 hover:text-blue-800"
                                    } duration-200`}
                                  >
                                    {tenancy.isClose
                                      ? "Closed"
                                      : "Click to Close"}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="tclose-grid">
                              <div className="tclose-grid-item">
                                <div className="tclose-dropdown-label">
                                  ACTION
                                </div>
                                <div className="tclose-dropdown-value tclose-flex-items-center-gap-2 mt-[10px] ml-[5px]">
                                  <button
                                    onClick={() =>
                                      openConfirmationModal(
                                        tenancy.id,
                                        "delete"
                                      )
                                    }
                                  >
                                    <img
                                      src={deleteicon}
                                      alt="Delete"
                                      className="w-[18px] h-[18px] ml-[10px] tclose-delete-btn duration-200"
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
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tclose-pagination-container">
        <span className="tclose-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tclose-pagination-buttons">
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
        isOpen={showConfirmationModal}
        type={confirmationAction === "delete" ? "delete" : "close"}
        title={
          confirmationAction === "delete" ? "Delete Tenancy" : "Close Tenancy"
        }
        message={
          confirmationAction === "delete"
            ? "Are you sure you want to delete this tenancy?"
            : "Are you sure you want to close this tenancy?"
        }
        confirmButtonText={confirmationAction === "delete" ? "Delete" : "Close"}
        cancelButtonText="Cancel"
        onConfirm={() =>
          confirmationAction === "delete"
            ? handleDelete(selectedTenancyId)
            : handleCloseTenancy(selectedTenancyId)
        }
        onCancel={() => {
          setShowConfirmationModal(false);
          setSelectedTenancyId(null);
          setConfirmationAction(null);
        }}
      />
    </div>
  );
};

export default CloseTenancy;
