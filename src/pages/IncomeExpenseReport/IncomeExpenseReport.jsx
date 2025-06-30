import React, { useState, useRef, useEffect } from "react";
import "./IncomeExpenseReport.css";
import { ChevronDown, Filter } from "lucide-react";
import downarrow from "../../assets/Images/IncomeExpenseReport/downarrow.svg";
import downloadicon from "../../assets/Images/Admin Tenancy/download-icon.svg";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const IncomeExpenseReport = () => {
  const [openSelectKey, setOpenSelectKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    view_type: "building",
    start_date: "",
    end_date: "",
  });
  const [tempFilters, setTempFilters] = useState({
    view_type: "building",
    start_date: "",
    end_date: "",
  });
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dateRangeRef = useRef(null);

  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      let companyId = null;

      if (role === "company") {
        companyId = localStorage.getItem("company_id");
      } else if (role === "user" || role === "admin") {
        companyId = localStorage.getItem("company_id");
      }

      return companyId ? parseInt(companyId) : null;
    } catch (e) {
      console.error("Error getting user company ID:", e);
      return null;
    }
  };
  const companyId = getUserCompanyId();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openSelectKey === "date_range" &&
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenSelectKey(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectKey]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/finance/income-expenses/${companyId}/`,
          {
            params: {
              company_id: companyId,
              view_type: filters.view_type,
              start_date: filters.start_date || undefined,
              end_date: filters.end_date || undefined,
            },
          }
        );
        setData(response.data.data);
        setCompanyName(response.data.company_name);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.view_type, filters.start_date, filters.end_date, companyId]);

  const itemsPerPage = 10;

  const viewTypeOptions = [
    { value: "building", label: "By Building" },
    { value: "tenant", label: "By Tenant" },
    { value: "tenancy", label: "By Tenancy" },
    { value: "unit", label: "By Unit" },
  ];

  const clearFilters = () => {
    const cleared = {
      view_type: "building",
      start_date: "",
      end_date: "",
    };
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDownloadCSV = async () => {
    try {
      const params = {
        company_id: companyId,
        view_type: filters.view_type,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      };

      const response = await axios.get(
        `${BASE_URL}/finance/income-expenses/${companyId}/export/`,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_expense_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const toggleDateRange = () => {
    setOpenSelectKey(openSelectKey === "date_range" ? null : "date_range");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
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

  const getEntityName = (item) => {
    switch (filters.view_type) {
      case "building":
        return item.building_name;
      case "tenant":
        return item.tenant_name;
      case "tenancy":
        return item.tenancy_code;
      case "unit":
        return item.unit_name;
      default:
        return "";
    }
  };

  const getSecondaryInfo = (item) => {
    if (filters.view_type === "tenancy") {
      return `${item.tenant_name || "N/A"} - ${item.unit_name || "N/A"}`;
    } else if (filters.view_type === "unit") {
      return item.building_name || "N/A";
    }
    return "";
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md income-expense-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] income-expense-table-header">
        <h1 className="income-expense-head">
          Income-Expense Report - {companyName}
        </h1>
        <div className="flex flex-col md:flex-row gap-[10px] income-expense-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 income-expense-search"
            />
            <motion.button
              className={`hidden md:flex items-center justify-center gap-2 px-4 py-2 h-[38px] rounded-md duration-200 ${
                showFilters
                  ? "bg-[#201D1E] text-white"
                  : "bg-[#F0F0F0] text-[#201D1E] hover:bg-[#201D1E] hover:text-[#F0F0F0]"
              }`}
              onClick={toggleFilters}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              Filters
            </motion.button>
          </div>
          <div className="flex gap-[10px] income-expense-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-[45%] md:w-[122px] h-[38px] rounded-md duration-200 income-expense-download-btn"
              onClick={handleDownloadCSV}
            >
              Download
              <img
                src={downloadicon}
                alt="Download"
                className="w-[15px] h-[15px] income-expense-download-img"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="p-5 border-b border-[#E9E9E9] income-expense-desktop-only income-expense-filter-container"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={filterVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-[10px] flex-wrap">
                <div className="relative">
                  <CustomDropDown
                    options={viewTypeOptions}
                    value={tempFilters.view_type}
                    onChange={(value) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        view_type: value,
                      }))
                    }
                    className="w-[130px]"
                    dropdownClassName="px-[7px] py-[7px] border-[#201D1E20] focus:border-gray-300 income-expense-selection h-[38px]"
                  />
                </div>
                <div className="relative" ref={dateRangeRef}>
                  <div
                    className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between income-expense-selection"
                    onClick={toggleDateRange}
                  >
                    Date Range
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${
                        openSelectKey === "date_range"
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    />
                  </div>
                  {openSelectKey === "date_range" && (
                    <div className="absolute z-10 bg-white p-4 mt-1 border border-gray-300 rounded-md shadow-md w-[250px]">
                      <label className="block text-sm mb-1 filter-btn">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={tempFilters.start_date}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 mb-3 outline-none"
                      />
                      <label className="block text-sm mb-1 filter-btn">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={tempFilters.end_date}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-[10px]">
                <button
                  onClick={() => {
                    setFilters(tempFilters);
                    setCurrentPage(1);
                  }}
                  className="bg-[#201D1E] text-white w-[105px] h-[38px] rounded-md hover:bg-[#F0F0F0] hover:text-[#201D1E] duration-200 filter-btn"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-[105px] h-[38px] bg-[#F0F0F0] text-[#4D4E4D] rounded-md clear-btn hover:bg-[#201D1E] hover:text-white duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <div className="p-5 text-center">Loading...</div>}
      {error && <div className="p-5 text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="income-expense-desktop-only overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="h-[57px] border-b border-[#E9E9E9]">
                <th
                  colSpan="2"
                  className="border-b border-[#E9E9E9] income-expense-header"
                ></th>
                <th
                  colSpan="3"
                  className="px-5 text-center border-b border-[#E9E9E9] bg-[#F2FCF7] text-[#28C76F] income-expense-header"
                >
                  INCOME
                </th>
                <th
                  colSpan="3"
                  className="px-5 text-center border-b border-[#E9E9E9] bg-[#FFF7F6] text-[#FE7062] income-expense-header"
                >
                  EXPENSE
                </th>
              </tr>
              <tr className="border-b border-[#E9E9E9] h-[57px]">
                <th className="px-5 text-left income-expense-thead">ENTITY</th>
                <th className="px-5 text-left income-expense-thead">DETAILS</th>
                <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                  TOTAL INCOME
                </th>
                <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                  TOTAL REFUNDED
                </th>
                <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                  NET INCOME
                </th>
                <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                  TOTAL EXPENSE
                </th>
                <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                  GENERAL EXPENSE
                </th>
                <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                  NET BALANCE
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item[`${filters.view_type}_id`]}
                  className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer last:border-0"
                >
                  <td className="px-5 income-expense-data">
                    {getEntityName(item)}
                  </td>
                  <td className="px-5 income-expense-data">
                    {getSecondaryInfo(item)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                    {item.total_income.toFixed(2)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                    {item.total_refunded.toFixed(2)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                    {item.net_income.toFixed(2)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                    {item.total_expense.toFixed(2)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                    {item.total_general_expense.toFixed(2)}
                  </td>
                  <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                    {(item.net_income - item.total_expense).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && (
        <div className="block md:hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="income-expense-table-row-head border-b border-[#E9E9E9]">
                <th className="px-5 pl-[1rem] w-[50%] text-left income-expense-thead income-expense-date-column">
                  ENTITY
                </th>
                <th className="px-3 w-[33.33%] text-left income-expense-thead income-expense-tenant-column">
                  NET BALANCE
                </th>
                <th className="text-right income-expense-thead"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <React.Fragment key={item[`${filters.view_type}_id`]}>
                  <tr
                    className={`${
                      expandedRows[item[`${filters.view_type}_id`]]
                        ? "income-expense-mobile-no-border"
                        : "income-expense-mobile-with-border border-b border-[#E9E9E9]"
                    } h-[57px]`}
                  >
                    <td className="px-5 text-left income-expense-data income-expense-date-column w-[35%] pl-[16px]">
                      {getEntityName(item)}
                    </td>
                    <td className="px-3 text-left income-expense-data income-expense-tenant-column w-[30%]">
                      {(item.net_income - item.total_expense).toFixed(2)}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`income-expense-dropdown-field ${
                          expandedRows[item[`${filters.view_type}_id`]]
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          toggleRowExpand(item[`${filters.view_type}_id`])
                        }
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`income-expense-dropdown-img ${
                            expandedRows[item[`${filters.view_type}_id`]]
                              ? "text-white"
                              : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[item[`${filters.view_type}_id`]] && (
                      <motion.tr
                        className="income-expense-mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="p-0">
                          <div className="income-expense-grid-container">
                            <div className="income-expense-grid">
                              <div className="income-expense-grid-item">
                                <div className="income-expense-dropdown-label w-[50%]">
                                  DETAILS
                                </div>
                                <div className="income-expense-dropdown-value">
                                  {getSecondaryInfo(item)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="income-expense-table-container">
                            <table className="income-expense-dropdown-table">
                              <thead>
                                <tr className="income-expense-dropdown-table-header border-b border-[#E9E9E9]">
                                  <th
                                    colSpan="3"
                                    className="income-expense-income-header"
                                  >
                                    INCOME
                                  </th>
                                  <th
                                    colSpan="3"
                                    className="income-expense-expense-header"
                                  >
                                    EXPENSE
                                  </th>
                                </tr>
                                <tr className="income-expense-dropdown-table-subheader border-b border-[#E9E9E9]">
                                  <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                    TOTAL
                                  </th>
                                  <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                    REFUNDED
                                  </th>
                                  <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                    NET
                                  </th>
                                  <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                    TOTAL
                                  </th>
                                  <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                    GENERAL
                                  </th>
                                  <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                    NET BALANCE
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="income-expense-dropdown-table-row">
                                  <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                    {item.total_income.toFixed(2)}
                                  </td>
                                  <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                    {item.total_refunded.toFixed(2)}
                                  </td>
                                  <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                    {item.net_income.toFixed(2)}
                                  </td>
                                  <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                    {item.total_expense.toFixed(2)}
                                  </td>
                                  <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                    {item.total_general_expense.toFixed(2)}
                                  </td>
                                  <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                    {(
                                      item.net_income - item.total_expense
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 border-t border-[#E9E9E9] income-expense-pagination-container">
        <span className="income-expense-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto income-expense-pagination-buttons">
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
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
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

export default IncomeExpenseReport;
