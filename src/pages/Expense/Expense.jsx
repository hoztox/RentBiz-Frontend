import React, { useState, useEffect } from "react";
import "./Expense.css";
import plusicon from "../../assets/Images/Expense/plus-icon.svg";
import downloadicon from "../../assets/Images/Expense/download-icon.svg";
import editicon from "../../assets/Images/Expense/edit-icon.svg";
import printericon from "../../assets/Images/Expense/printer-icon.svg";
import downloadactionicon from "../../assets/Images/Expense/download-action-icon.svg";
import downarrow from "../../assets/Images/Expense/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { BASE_URL } from "../../utils/config";

const Expense = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { openModal } = useModal();
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "all", label: "All" },
    { value: "general", label: "General" },
    { value: "tenancy", label: "Tenancy" },
  ];

  const [selectedOption, setSelectedOption] = useState("all");

  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      let companyId = null;

      if (role === "company" || role === "user" || role === "admin") {
        companyId = localStorage.getItem("company_id");
      }

      return companyId ? parseInt(companyId) : null;
    } catch (e) {
      console.error("Error getting user company ID:", e);
      return null;
    }
  };

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        console.log("Company ID:", companyId);


        const response = await axios.get(`${BASE_URL}/finance/expenses/company/${companyId}/`, {

          params: {
            search: searchTerm,
            expense_type: selectedOption === "all" ? "" : selectedOption,
          },
        });
        console.log("API Response:", response.data);
        // Set expenses directly from response (flat array)
        setExpenses(response.data);
        // Calculate total pages for client-side pagination
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError("Failed to fetch expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [searchTerm, selectedOption]);

  // Client-side pagination
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const handleEditClick = (expense) => {
    openModal("update-expense", "Update Expense", expense);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md expense-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] expense-table-header">
        <h1 className="expense-head">Expenses</h1>
        <div className="flex flex-col md:flex-row gap-[10px] expense-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 expense-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 expense-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] expense-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md add-expense duration-200 w-[176px]"
              onClick={() => openModal("create-expense")}
            >
              Add New Expense
              <img src={plusicon} alt="plus icon" className="relative right-[5px] md:right-0 w-[15px] h-[15px]" />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 expense-download-btn w-[122px]">
              Download
              <img src={downloadicon} alt="Download Icon" className="w-[15px] h-[15px] download-img" />
            </button>
          </div>
        </div>
      </div>
      {loading && <div className="p-5">Loading...</div>}
      {error && <div className="p-5 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-5 text-left expense-thead">ID</th>
                  <th className="px-5 text-left expense-thead">DATE</th>
                  <th className="pl-5 text-left expense-thead">EXPENSE TYPE</th>
                  <th className="pl-5 text-left expense-thead">AMOUNT</th>
                  <th className="px-5 text-left expense-thead">TAX</th>
                  <th className="px-5 text-left expense-thead">TOTAL AMOUNT</th>
                  <th className="px-5 text-left expense-thead w-[68px]">STATUS</th>
                  <th className="px-5 pr-11 text-right expense-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, index) => (
                  <tr key={index} className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer">
                    <td className="px-5 text-left expense-data">{expense.id}</td>
                    <td className="px-5 text-left expense-data">{expense.date}</td>
                    <td className="pl-5 text-left expense-data">{expense.expense_type}</td>
                    <td className="pl-5 text-left expense-data">{expense.amount}</td>
                    <td className="px-5 text-left expense-data">{expense.tax}</td>
                    <td className="px-5 text-left expense-data">{expense.total_amount}</td>
                    <td className="px-5 text-left expense-data">
                      <span
                        className={`px-[10px] py-[5px] rounded-[4px] w-[69px] h-[28px] ${expense.status === "Paid" ? "bg-[#28C76F29] text-[#28C76F]" : "bg-[#FFE1E1] text-[#C72828]"
                          }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                      <button onClick={() => handleEditClick(expense)}>
                        <img src={editicon} alt="Edit" className="w-[18px] h-[18px] action-btn duration-200" />
                      </button>
                      <button>
                        <img src={downloadactionicon} alt="Download" className="w-[18px] h-[18px] action-btn duration-200" />
                      </button>
                      <button>
                        <img src={printericon} alt="Print" className="w-[18px] h-[18px] action-btn duration-200" />
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
                <tr className="expense-table-row-head">
                  <th className="px-5 pl-[12px] text-left expense-thead expense-id-column">ID</th>
                  <th className="px-5 text-left expense-thead expense-date-column">DATE</th>
                  <th className="px-5 text-left expense-thead expense-expense-column">EXPENSE TYPE</th>
                  <th className="px-5 text-right expense-thead"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={`${expandedRows[expense.id + index] ? "expense-mobile-no-border" : "expense-mobile-with-border"
                        } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 pl-[12px] text-left expense-data expense-id-column">{expense.id}</td>
                      <td className="px-5 text-left expense-data expense-date-column">{expense.date}</td>
                      <td className="px-5 text-left expense-data expense-expense-column">{expense.expense_type}</td>
                      <td className="py-4 flex items-center justify-end h-[57px]">
                        <div
                          className={`expense-dropdown-field ${expandedRows[expense.id + index] ? "active" : ""}`}
                          onClick={() => toggleRowExpand(expense.id + index)}
                        >
                          <img
                            src={downarrow}
                            alt="drop-down-arrow"
                            className={`expense-dropdown-img ${expandedRows[expense.id + index] ? "text-white" : ""}`}
                          />
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRows[expense.id + index] && (
                        <motion.tr
                          className="expense-mobile-with-border border-b border-[#E9E9E9]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={4} className="pl-3">
                            <div className="expense-dropdown-content">
                              <div className="expense-dropdown-grid">
                                <div className="expense-dropdown-item expense-amount-column">
                                  <div className="expense-dropdown-label">AMOUNT</div>
                                  <div className="expense-dropdown-value">{expense.amount}</div>
                                </div>
                                <div className="expense-dropdown-item expense-vat-amount-column">
                                  <div className="expense-dropdown-label">TAX</div>
                                  <div className="expense-dropdown-value">{expense.tax}</div>
                                </div>
                                <div className="expense-dropdown-item expense-total-amount-column">
                                  <div className="expense-dropdown-label">TOTAL AMOUNT</div>
                                  <div className="expense-dropdown-value">{expense.total_amount}</div>
                                </div>
                              </div>
                              <div className="expense-dropdown-grid">
                                <div className="expense-dropdown-item expense-description-column">
                                  <div className="expense-dropdown-label">DESCRIPTION</div>
                                  <div className="expense-dropdown-value">{expense.description || "N/A"}</div>
                                </div>
                                <div className="expense-dropdown-item expense-status-column">
                                  <div className="expense-dropdown-label">STATUS</div>
                                  <div className="expense-dropdown-value">
                                    <span
                                      className={`expense-status ${expense.status === "Paid"
                                        ? "bg-[#28C76F29] text-[#28C76F]"
                                        : "bg-[#FFE1E1] text-[#C72828]"
                                        }`}
                                    >
                                      {expense.status || "Pending"}
                                    </span>
                                  </div>
                                </div>
                                <div className="expense-dropdown-item expense-action-column">
                                  <div className="expense-dropdown-label">ACTION</div>
                                  <div className="expense-dropdown-value flex items-center gap-4 p-[5px]">
                                    <button id={`edit-expense-${expense.id}`} onClick={() => handleEditClick(expense)}>
                                      <img src={editicon} alt="Edit" className="w-[18px] h-[18px] action-btn duration-200" />
                                    </button>
                                    <button>
                                      <img src={downloadactionicon} alt="Download" className="w-[18px] h-[18px] action-btn duration-200" />
                                    </button>
                                    <button>
                                      <img src={printericon} alt="Print" className="w-[18px] h-[18px] action-btn duration-200" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}F
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 expense-pagination-container">
            <span className="expense-pagination collection-list-pagination">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, expenses.length)} to{" "}
              {Math.min(currentPage * itemsPerPage, expenses.length)} of {expenses.length} entries
            </span>
            <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto expense-pagination-buttons">
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
                  className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${currentPage === startPage + i
                    ? "bg-[#1458A2] text-white"
                    : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
                    }`}
                  onClick={() => setCurrentPage(startPage + i)}
                >
                  {startPage + i}
                </button>
              ))}
              {endPage < totalPages - 1 && <span className="px-2 flex items-center">...</span>}
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
        </>
      )}
    </div>
  );
};

export default Expense;