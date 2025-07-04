import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "./GenericTable.css";
import CustomDropDown from "../CustomDropDown";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import downloadIcon from "../../assets/Images/Admin Masters/download-icon.svg";
import downarrow from "../../assets/Images/Additional Charges/downarrow.svg";

const GenericTable = ({
  title,
  apiEndpoint,
  columns,
  filterOptions,
  dataKey,
  getCompanyId,
  modalConfig,
  customActions,
  customMobileRow,
  downloadEndpoint,
  customStyles = {},
  updateData,
  refreshDependencies = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [openSelectKey, setOpenSelectKey] = useState(null);
  const [filters, setFilters] = useState(
    filterOptions.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.key]: opt.key === "view_type" ? "building" : "",
      }),
      {}
    )
  );
  const [tempFilters, setTempFilters] = useState(
    filterOptions.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.key]: opt.key === "view_type" ? "building" : "",
      }),
      {}
    )
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dateRangeRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openSelectKey === "date_range" &&
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenSelectKey(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSelectKey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const companyId = getCompanyId ? getCompanyId() : null;
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
        search: searchTerm || undefined,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      };
      if (companyId) params.company_id = companyId;

      const response = await axios.get(apiEndpoint(companyId), { params });
      const results = response.data.results || response.data.data || [];
      setData(results);
      const count = response.data.count || results.length || 0;
      setTotalCount(count);
      const newTotalPages = Math.ceil(count / itemsPerPage);
      setTotalPages(newTotalPages);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    searchTerm,
    filters,
    apiEndpoint,
    getCompanyId,
    ...refreshDependencies,
  ]);

  const updateItemInData = (id, updatedFields) => {
    setData(prevData =>
      prevData.map(item =>
        getDataKey(item, filters) === id ? { ...item, ...updatedFields } : item
      )
    );
  };

  const handleDownloadCSV = async () => {
    const downloadToast = toast.loading("Downloading CSV...");
    try {
      const companyId = getCompanyId ? getCompanyId() : null;
      const params = {
        search: searchTerm || undefined,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      };
      if (companyId) params.company_id = companyId;

      const response = await axios.get(downloadEndpoint(companyId), {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV downloaded successfully", { id: downloadToast });
    } catch (error) {
      toast.error("Failed to download CSV. Please try again.", {
        id: downloadToast,
      });
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axios.delete(`${apiEndpoint(getCompanyId())}/${itemToDelete}/`);
        setData(data.filter(item => item.id !== itemToDelete));
        toast.success(`${title} deleted successfully`);
        if (updateData) updateData();
      } catch (error) {
        toast.error(`Failed to delete ${title.toLowerCase()}. Please try again.`);
      }
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleDateRange = () => {
    setOpenSelectKey(openSelectKey === "date_range" ? null : "date_range");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    const cleared = filterOptions.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.key]: opt.key === "view_type" ? "building" : "",
      }),
      {}
    );
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchTerm("");
    setCurrentPage(1);
    toast.success("Filters cleared successfully");
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeOut" } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const getDataKey = (item, filters) => {
    if (typeof dataKey === "function") {
      return item[dataKey(filters)] || item.id;
    }
    return item[dataKey] || item.id;
  };

  return (
    <div className={`border border-gray-200 rounded-md table-container ${customStyles.container || ""}`}>
      <Toaster />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-gray-200 table-header">
        <h1 className="table-head text-xl font-medium">{title}</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex flex-col md:flex-row gap-2 w-full items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className={`px-4 py-2 outline-none border border-gray-300 rounded-md w-full md:w-72 focus:border-gray-400 duration-200 table-search ${customStyles.searchInput || ""}`}
            />
            <motion.button
              className={`hidden md:flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-md duration-200 ${
                showFilters
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={toggleFilters}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              Filters
            </motion.button>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            {modalConfig?.create && (
              <button
                className={`flex items-center justify-center gap-2 w-1/2 md:w-44 h-10 rounded-md bg-blue-500 text-white hover:bg-blue-700 duration-200 table-add-btn ${customStyles.createButton || ""}`}
                onClick={modalConfig.create.onClick}
              >
                {modalConfig.create.label}
                <img src={modalConfig.create.icon} alt="Add" className="w-4 h-4" />
              </button>
            )}
            <button
              className={`flex items-center justify-center gap-2 w-1/2 md:w-32 h-10 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white duration-200 table-download-btn ${customStyles.downloadButton || ""}`}
              onClick={handleDownloadCSV}
            >
              Download
              <img src={downloadIcon} alt="Download" className="w-4 h-4 table-download-img" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="p-5 border-b border-gray-200 table-filter-container"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={filterVariants}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {filterOptions.map(opt => (
                  <div key={opt.key} className="relative">
                    {opt.type === "dropdown" ? (
                      <CustomDropDown
                        options={opt.options(data)}
                        value={tempFilters[opt.key]}
                        onChange={value =>
                          setTempFilters(prev => ({ ...prev, [opt.key]: value }))
                        }
                        dropdownClassName={`px-2 py-2 w-32 border border-gray-300 rounded-md focus:border-gray-400 h-10 table-selection ${customStyles.dropdown || ""}`}
                      />
                    ) : (
                      <div ref={dateRangeRef}>
                        <div
                          className="px-2 py-2 border border-gray-300 bg-transparent rounded-md w-32 h-10 cursor-pointer flex items-center justify-between table-selection"
                          onClick={toggleDateRange}
                        >
                          Date Range
                          <ChevronDown
                            className={`ml-2 transition-transform duration-300 ${
                              openSelectKey === "date_range" ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </div>
                        {openSelectKey === "date_range" && (
                          <div className="absolute z-10 bg-white p-4 mt-1 border border-gray-300 rounded-md shadow-md w-64">
                            <label className="block text-sm mb-1 filter-btn">Start Date</label>
                            <input
                              type="date"
                              value={tempFilters.start_date || ""}
                              onChange={e =>
                                setTempFilters(prev => ({
                                  ...prev,
                                  start_date: e.target.value,
                                }))
                              }
                              className="w-full border border-gray-300 rounded-md px-2 py-1 mb-3 outline-none"
                            />
                            <label className="block text-sm mb-1 filter-btn">End Date</label>
                            <input
                              type="date"
                              value={tempFilters.end_date || ""}
                              onChange={e =>
                                setTempFilters(prev => ({
                                  ...prev,
                                  end_date: e.target.value,
                                }))
                              }
                              className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setFilters(tempFilters);
                    setCurrentPage(1);
                    toast.success("Filters applied successfully");
                  }}
                  className="bg-gray-800 text-white w-full md:w-28 h-10 rounded-md hover:bg-gray-100 hover:text-gray-800 duration-200 filter-btn"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full md:w-28 h-10 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-800 hover:text-white duration-200 clear-btn"
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
      {!loading && !error && data.length === 0 && (
        <div className="p-5 text-center">No data available</div>
      )}
      {!loading && !error && data.length > 0 && (
        <>
          <div className="table-desktop-only overflow-x-auto">
            <table className={`w-full border-collapse ${customStyles.table || ""}`}>
              <thead>
                {columns.headerGroups && (
                  <tr className="border-b border-gray-200 h-14">
                    {columns.headerGroups.map((group, index) => (
                      <th
                        key={index}
                        colSpan={group.colSpan}
                        className={`px-5 text-center border-b border-gray-200 ${group.className || ""}`}
                      >
                        {group.label}
                      </th>
                    ))}
                  </tr>
                )}
                <tr className="border-b border-gray-200 h-14">
                  {columns.main.map(col => (
                    <th
                      key={col.key}
                      className={`px-5 text-${col.align || "left"} table-thead ${col.className || ""} ${customStyles.thead || ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={getDataKey(item, filters)}
                    className="border-b border-gray-200 h-14 hover:bg-gray-50 cursor-pointer"
                  >
                    {columns.main.map(col => (
                      <td
                        key={col.key}
                        className={`px-5 table-data ${col.className || ""} ${customStyles.tdata || ""}`}
                      >
                        {col.render
                          ? col.render(item, updateItemInData, index)
                          : item[col.key] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="block md:hidden">
            <table className={`w-full border-collapse ${customStyles.table || ""}`}>
              <thead>
                <tr className="table-row-head">
                  {columns.mobile.map(col => (
                    <th
                      key={col.key}
                      className={`px-5 text-${col.align || "left"} table-thead ${col.className || ""} ${customStyles.thead || ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <React.Fragment key={getDataKey(item, filters)}>
                    <tr
                      className={`${
                        expandedRows[getDataKey(item, filters)]
                          ? "table-mobile-no-border"
                          : "table-mobile-with-border border-b border-gray-200"
                      } h-14`}
                    >
                      {columns.mobile.map(col => (
                        <td
                          key={col.key}
                          className={`px-5 table-data ${col.className || ""} ${customStyles.tdata || ""}`}
                        >
                          {col.key === "dropdown" ? (
                            <div
                              className={`table-dropdown-field ${
                                expandedRows[getDataKey(item, filters)] ? "active" : ""
                              }`}
                              onClick={() => toggleRowExpand(getDataKey(item, filters))}
                            >
                              <img
                                src={downarrow}
                                alt="drop-down-arrow"
                                className={`table-dropdown-img ${
                                  expandedRows[getDataKey(item, filters)] ? "text-white" : ""
                                }`}
                              />
                            </div>
                          ) : (
                            (col.render ? col.render(item, updateItemInData, index) : item[col.key]) || "N/A"
                          )}
                        </td>
                      ))}
                    </tr>
                    <AnimatePresence>
                      {expandedRows[getDataKey(item, filters)] && (
                        <motion.tr
                          className="table-mobile-with-border border-b border-gray-200"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={columns.mobile.length} className="px-5">
                            {customMobileRow ? (
                              customMobileRow(item, updateItemInData)
                            ) : (
                              <div className="table-dropdown-content">
                                {columns.main
                                  .filter(col => !columns.mobile.some(m => m.key === col.key))
                                  .map((col, index) => (
                                    <div key={index} className="table-grid">
                                      <div className="table-grid-item w-1/2">
                                        <div className="table-dropdown-label">{col.label}</div>
                                        <div className="table-dropdown-value">
                                          {col.render
                                            ? col.render(item, updateItemInData)
                                            : item[col.key] || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center py-2 px-5 table-pagination-container ${customStyles.pagination || ""}`}>
            <span className="table-pagination collection-list-pagination">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
            </span>
            <div className="flex gap-1 overflow-x-auto md:py-2 w-full md:w-auto table-pagination-buttons">
              <button
                className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 duration-200 cursor-pointer pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 h-10 rounded-md cursor-pointer duration-200 page-no-btns ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 duration-200 cursor-pointer pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          type="delete"
          title={`Delete ${title}`}
          message={`Are you sure you want to delete this ${title.toLowerCase()}?`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default GenericTable;