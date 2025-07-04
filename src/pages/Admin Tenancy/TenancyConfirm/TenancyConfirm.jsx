import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenancyConfirm.css";
import plusicon from "../../../assets/Images/Admin Tenancy/plus-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import confirmicon from "../../../assets/Images/Admin Tenancy/confirm-icon.svg";
import cancelicon from "../../../assets/Images/Admin Tenancy/terminate-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import TenancyConfirmModal from "./TenancyConfirmModal/TenancyConfirmModal";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import TenancyCancelModal from "./TenancyCancelModal/TenancyCancelModal";

const TenancyConfirm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal, refreshCounter } = useModal();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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

  const handleViewClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-view", "View Tenancy", tenancy);
  };

  const handleEditClick = (tenancy) => {
    console.log("Tenancy ID: Selected Tenancy:", tenancy);
    openModal("tenancy-update", "Update Tenancy", tenancy);
  };

  // Fetch tenancies from backend
  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/pending/${companyId}/`,
          {
            params: { status: "pending" },
          }
        );
        // Sort tenancies by id in ascending order
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
        console.log("Fetched and sorted Pending Tenancies:", sortedTenancies);
      } catch (error) {
        console.error("Error fetching tenancies:", error);
        toast.error("Failed to fetch tenancies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenancies();
  }, [refreshCounter, refreshTrigger]);

  const openConfirmModal = (tenancy) => {
    setSelectedTenancy(tenancy);
    setConfirmModalOpen(true);
  };

  const cancelModalOpen = (tenancy) => {
    setSelectedTenancy(tenancy)
    setOpenCancelModal(true);
  }

  const handleConfirmAction = async () => {
    try {
      // Extract only the IDs for the nested objects
      const tenancyData = {
        tenancy_code: selectedTenancy.tenancy_code,
        rental_months: selectedTenancy.rental_months,
        start_date: selectedTenancy.start_date,
        end_date: selectedTenancy.end_date,
        tenant: selectedTenancy.tenant?.id,
        building: selectedTenancy.building?.id,
        unit: selectedTenancy.unit?.id,
        status: "active",
      };

      await axios.post(
        `${BASE_URL}/company/tenancy/${selectedTenancy.id}/confirm/`,
        tenancyData
      );

      console.log("Confirmed Tenancy:", tenancyData);
      toast.success("Tenancy confirmed successfully");
      setConfirmModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error confirming tenancy:", error);
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        toast.error(`Failed to confirm tenancy: ${error.response.data.errors.join(", ")}`);
      } else {
        toast.error("Failed to confirm tenancy. Please try again.");
      }
    }
  };

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

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Confirm</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tconfirm-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="h-[38px] px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 tenancy-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] tconfirm-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md tconfirm-add-new-tenancy duration-200"
              onClick={() => openModal("tenancy-create")}
            >
              Add New Tenancy
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] w-[15px] h-[15px]"
              />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="p-5 text-center">Loading...</div>
      ) : (
        <>
          <div className="tconfirm-desktop-only">
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
                  <th className="px-5 text-left tenancy-thead">
                    RENTAL MONTHS
                  </th>
                  <th className="px-5 text-left tenancy-thead w-[12%]">
                    STATUS
                  </th>
                  <th className="pl-12 pr-5 text-center tenancy-thead w-[8%]">
                    VIEW
                  </th>
                  <th className="px-5 pr-11 text-right tenancy-thead">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((tenancy) => (
                  <tr
                    key={tenancy.id}
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
                          className="w-[30px] h-[24px] tconfirm-action-btn duration-200"
                        />
                      </button>
                    </td>
                    <td className="px-5 flex gap-[15px] items-center justify-end h-[57px]">
                      <button onClick={() => handleEditClick(tenancy)}>
                        <img
                          src={editicon}
                          alt="Edit"
                          className="w-[18px] h-[18px] tconfirm-action-btn duration-200"
                        />
                      </button>
                      <button onClick={() => openConfirmModal(tenancy)}>
                        <img
                          src={confirmicon}
                          alt="Confirm"
                          className="w-[26px] h-[26px] tconfirm-confirm-btn duration-200"
                        />
                      </button>
                      <button onClick={() => cancelModalOpen(tenancy)}>
                        <img
                          src={cancelicon}
                          alt="Cancel"
                          className="w-[26px] h-[26px] tconfirm-cancel-btn duration-200"
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
                  <th className="px-5 w-[57%] text-left tenancy-thead tconfirm-id-column">
                    ID
                  </th>
                  <th className="px-5 w-[43%] text-left tenancy-thead tconfirm-tenant-column">
                    TENANT NAME
                  </th>
                  <th className="px-5 text-right tenancy-thead"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((tenancy) => (
                  <React.Fragment key={tenancy.id}>
                    <tr
                      className={`${
                        expandedRows[tenancy.id]
                          ? "tconfirm-mobile-no-border"
                          : "tconfirm-mobile-with-border"
                      } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 text-left tenancy-data tconfirm-id-column">
                        {tenancy.tenancy_code}
                      </td>
                      <td className="px-3 text-left tenancy-data tconfirm-tenant-column">
                        {tenancy.tenant?.tenant_name || "N/A"}
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
                          className="tconfirm-mobile-with-border border-b border-[#E9E9E9]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={3} className="px-5">
                            <div className="tenancy-dropdown-content">
                              <div className="tconfirm-grid">
                                <div className="tconfirm-grid-item">
                                  <div className="tconfirm-dropdown-label">
                                    BUILDING NAME
                                  </div>
                                  <div className="tconfirm-dropdown-value">
                                    {tenancy.building?.building_name || "N/A"}
                                  </div>
                                </div>
                                <div className="tconfirm-grid-item">
                                  <div className="tconfirm-dropdown-label">
                                    UNIT NAME
                                  </div>
                                  <div className="tconfirm-dropdown-value">
                                    {tenancy.unit?.unit_name || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="tconfirm-grid">
                                <div className="tconfirm-grid-item">
                                  <div className="tconfirm-dropdown-label">
                                    RENTAL MONTHS
                                  </div>
                                  <div className="tconfirm-dropdown-value">
                                    {tenancy.rental_months}
                                  </div>
                                </div>
                                <div className="tconfirm-grid-item">
                                  <div className="tconfirm-dropdown-label">
                                    STATUS
                                  </div>
                                  <div className="tconfirm-dropdown-value">
                                    <span
                                      className={`px-[10px] py-[5px] h-[24px] rounded-[4px] tenancy-status ${
                                        tenancy.status === "pending"
                                          ? "bg-[#FFF3E0] text-[#F57C00]"
                                          : tenancy.status === "active"
                                          ? "bg-[#E6F3E6] text-[#28A745]"
                                          : "bg-[#FFE6E6] text-[#DC3545]"
                                      }`}
                                    >
                                      {tenancy.status.charAt(0).toUpperCase() +
                                        tenancy.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="tconfirm-grid">
                                <div className="tconfirm-grid-item">
                                  <div className="tconfirm-dropdown-label">
                                    VIEW
                                  </div>
                                  <div className="tconfirm-dropdown-value">
                                    <button
                                      onClick={() => handleViewClick(tenancy)}
                                    >
                                      <img
                                        src={viewicon}
                                        alt="View"
                                        className="w-[30px] h-[24px] tconfirm-action-btn duration-200"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <div className="tconfirm-grid-item tconfirm-action-column">
                                  <div className="tconfirm-dropdown-label">
                                    ACTION
                                  </div>
                                  <div className="tconfirm-dropdown-value tconfirm-flex tconfirm-items-center p-[5px]">
                                    <button
                                      onClick={() => handleEditClick(tenancy)}
                                    >
                                      <img
                                        src={editicon}
                                        alt="Edit"
                                        className="w-[18px] h-[18px] tconfirm-action-btn duration-200"
                                      />
                                    </button>
                                    <button
                                      onClick={() => openConfirmModal(tenancy)}
                                    >
                                      <img
                                        src={confirmicon}
                                        alt="Confirm"
                                        className="w-[24px] h-[20px] tconfirm-confirm-btn duration-200 ml-2"
                                      />
                                    </button>
                                    <button
                                      onClick={() => cancelModalOpen(tenancy)}
                                    >
                                      <img
                                        src={cancelicon}
                                        alt="Cancel"
                                        className="w-[24px] h-[20px] tconfirm-cancel-btn duration-200 ml-2"
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

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tconfirm-pagination-container">
            <span className="tconfirm-collection-list-pagination">
              Showing{" "}
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredData.length
              )}{" "}
              to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </span>
            <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tconfirm-pagination-buttons">
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
              {startPage > 2 && (
                <span className="px-2 flex items-center">...</span>
              )}
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
          <TenancyConfirmModal
            isOpen={confirmModalOpen}
            onCancel={() => setConfirmModalOpen(false)}
            onConfirm={handleConfirmAction}
            tenancy={selectedTenancy}
          />
          <TenancyCancelModal
            isOpen={openCancelModal}
            onCancel={() => setOpenCancelModal(false)}
            tenancy={selectedTenancy}
          />
        </>
      )}
    </div>
  );
};

export default TenancyConfirm;