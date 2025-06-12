import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Currency.css";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
// import CurrencyDeleteModal from "./CurrencyDeleteModal/CurrencyDeleteModal";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const Currency = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currencyIdToDelete, setCurrencyIdToDelete] = useState(null);
  const itemsPerPage = 10;

  const dropdownOption = [
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

  const companyId = getUserCompanyId();

  // Fetch currencies from backend
  const fetchCurrencies = async () => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setLoading(false);
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/company/currency/company/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const currencyData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCurrencies(currencyData);
    } catch (err) {
      console.error("Error fetching currencies:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch currencies. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    setCurrencyIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currencyIdToDelete) return;
    try {
      await axios.delete(
        `${BASE_URL}/company/currencies/${currencyIdToDelete}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCurrencies((prev) =>
        prev.filter((item) => item.id !== currencyIdToDelete)
      );
      toast.success("Currency deleted successfully.");
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting currency:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete currency. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setCurrencyIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCurrencyIdToDelete(null);
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter data based on search term
  const filteredData = currencies.filter((currency) => {
    const searchLower = searchTerm.toLowerCase();
    const createdDate = formatDate(currency.created_at);
    return (
      createdDate.toLowerCase().includes(searchLower) ||
      currency.country?.toLowerCase().includes(searchLower) ||
      currency.currency?.toLowerCase().includes(searchLower) ||
      currency.currency_code?.toLowerCase().includes(searchLower) ||
      currency.minor_unit?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  useEffect(() => {
    fetchCurrencies();
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [companyId, currentPage, searchTerm, refreshCounter]);

  const handelEditClick = (currency) => {
    console.log("Currency Id:", currency);
    openModal("update-currency-master", "Update Currency", currency);
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

  // Loading state
  if (loading) {
    return (
      <div className="border border-[#E9E9E9] rounded-md currency-table">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading currencies...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-[#E9E9E9] rounded-md currency-table">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-lg text-red-600">{error}</div>
          <button
            onClick={fetchCurrencies}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md currency-table">
      <Toaster />
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] currency-table-header">
        <h1 className="currency-head">Currency</h1>
        <div className="flex flex-col md:flex-row gap-[10px] currency-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 currency-search"
              disabled={loading}
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOption}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 currency-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 md:w-[176px] h-[38px] rounded-md add-new-currency duration-200"
              onClick={() => openModal("add-currency-master")}
              disabled={loading}
            >
              Add New Currency
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 currency-download-btn"
              disabled={loading}
            >
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

      {/* Desktop Table */}
      <div className="desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left currency-thead">ID</th>
              <th className="px-5 text-left currency-thead">COUNTRY</th>
              <th className="pl-5 text-left currency-thead">CURRENCY</th>
              <th className="pl-5 text-left currency-thead">CODE</th>
              <th className="px-5 text-center currency-thead">MINOR UNIT</th>
              <th className="px-5 pr-6 text-right currency-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No currencies found
                </td>
              </tr>
            ) : (
              paginatedData.map((currency, index) => {
                const isLastItemOnPage = index === paginatedData.length - 1;
                const shouldRemoveBorder =
                  isLastItemOnPage && paginatedData.length === itemsPerPage;
                return (
                  <tr
                    key={currency.id}
                    className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                      shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                    }`}
                  >
                    <td className="px-5 text-left currency-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-5 text-left currency-data">
                      {currency.country || "N/A"}
                    </td>
                    <td className="pl-5 text-left currency-data">
                      {currency.currency || "N/A"}
                    </td>
                    <td className="pl-5 text-left currency-data">
                      {currency.currency_code || "N/A"}
                    </td>
                    <td className="px-5 currency-data text-center">
                      {currency.minor_unit !== undefined &&
                      currency.minor_unit !== null &&
                      currency.minor_unit !== ""
                        ? `${currency.minor_unit} unit`
                        : "N/A"}
                    </td>
                    <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                      <button
                        onClick={() => handelEditClick(currency)}
                        disabled={loading}
                      >
                        <img
                          src={editicon}
                          alt="Edit"
                          className="w-[18px] h-[18px] action-btn duration-200"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(currency.id)}
                        disabled={loading}
                      >
                        <img
                          src={deleteicon}
                          alt="Delete"
                          className="w-[18px] h-[18px] action-btn duration-200"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="currency-table-row-head">
              <th className="px-5 w-[38%] text-left currency-thead currency-id-column">
                ID
              </th>
              <th className="px-5 w-[53%] text-left currency-thead country-column">
                COUNTRY
              </th>
              <th className="px-5 text-right currency-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                  No currencies found
                </td>
              </tr>
            ) : (
              paginatedData.map((currency, index) => (
                <React.Fragment key={currency.id}>
                  <tr
                    className={`${
                      expandedRows[currency.id]
                        ? "mobile-no-border"
                        : "mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left currency-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-5 text-left currency-data country-column">
                      {currency.country || "N/A"}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`currency-dropdown-field ${
                          expandedRows[currency.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(currency.id)}
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`currency-dropdown-img ${
                            expandedRows[currency.id] ? "text-white" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[currency.id] && (
                      <motion.tr
                        className="mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="px-5">
                          <div className="currency-dropdown-content">
                            <div className="currency-grid">
                              <div className="currency-grid-items w-[40%]">
                                <div className="dropdown-label">CURRENCY</div>
                                <div className="dropdown-value">
                                  {currency.currency || "N/A"}
                                </div>
                              </div>
                              <div className="currency-grid-items w-[60%]">
                                <div className="dropdown-label">CODE</div>
                                <div className="dropdown-value">
                                  {currency.currency_code || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="currency-grid">
                              <div className="currency-grid-items w-[40%]">
                                <div className="dropdown-label">MINOR UNIT</div>
                                <div className="dropdown-value">
                                  {currency.minor_unit !== undefined &&
                                  currency.minor_unit !== null &&
                                  currency.minor_unit !== ""
                                    ? `${currency.minor_unit} unit`
                                    : "N/A"}
                                </div>
                              </div>
                              <div className="currency-grid-items w-[60%]">
                                <div className="dropdown-label">ACTION</div>
                                <div className="dropdown-value flex items-center gap-2 p-[5px]">
                                  <button
                                    onClick={() => handelEditClick(currency)}
                                    disabled={loading}
                                  >
                                    <img
                                      src={editicon}
                                      alt="Edit"
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(currency.id)}
                                    disabled={loading}
                                  >
                                    <img
                                      src={deleteicon}
                                      alt="Delete"
                                      className="w-[18px] h-[18px] ml-[5px] action-btn duration-200"
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

      {/* Pagination Section */}
      {filteredData.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
          <span className="collection-list-pagination">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredData.length
            )}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>
          <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
            <button
              className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {startPage > 1 && (
              <button
                className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
                onClick={() => setCurrentPage(1)}
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                {totalPages}
              </button>
            )}
            <button
              className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        title="Delete Currency"
        message="Are you sure you want to delete this currency?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Currency;
