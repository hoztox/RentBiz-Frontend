import React, { useState, useEffect, useRef } from "react";
import "./Collection.css";
import plusicon from "../../assets/Images/Collection/plus-icon.svg";
import downloadicon from "../../assets/Images/Collection/download-icon.svg";
import editicon from "../../assets/Images/Collection/edit-icon.svg";
import downloadactionicon from "../../assets/Images/Collection/download-action-icon.svg";
import downarrow from "../../assets/Images/Collection/downarrow.svg";
import { ChevronDown, Filter } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const Collection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal, refreshCounter } = useModal();
  const [collections, setCollections] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const dateRangeRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    id: "",
    tenancy_id: "",
    tenant_name: "",
    payment_method: "",
    start_date: "",
    end_date: "",
    upcoming_payments: "",
  });
  const [tempFilters, setTempFilters] = useState({
    id: "",
    tenancy_id: "",
    tenant_name: "",
    payment_method: "",
    start_date: "",
    end_date: "",
    upcoming_payments: "",
  });

  // Dropdown options for filters
  const paymentMethodOptions = [
    { value: "", label: "All Payments" },
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "cheque", label: "Cheque" },
    { value: "online_payment", label: "Online Payment" },
  ];

  const upcomingPaymentsOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Upcoming" },
  ];

  // Get unique values for dropdowns
  const getUnique = (key) => [...new Set(collections.map((item) => item[key]))];

  const tenancyIdOptions = [
    { label: "All Tenancies", value: "" },
    ...getUnique("tenancy_id").map((tid) => ({ label: tid, value: tid })),
  ];
  const tenantNameOptions = [
    { label: "All Tenants", value: "" },
    ...getUnique("tenant_name").map((name) => ({ label: name, value: name })),
  ];

  // Close date range dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setIsDateRangeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/finance/collections/`, {
          params: {
            page: currentPage,
            search: searchTerm,
            id: filters.id,
            tenancy_id: filters.tenancy_id,
            tenant_name: filters.tenant_name,
            payment_method: filters.payment_method,
            start_date: filters.start_date,
            end_date: filters.end_date,
            upcoming_payments: filters.upcoming_payments,
          },
        });
        setCollections(response.data.results);
        console.log("Collections fetched:", response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to load collections. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [currentPage, searchTerm, filters, refreshCounter]);

  // Handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/finance/collections/download/`,
        {
          params: {
            search: searchTerm,
            id: filters.id,
            tenancy_id: filters.tenancy_id,
            tenant_name: filters.tenant_name,
            payment_method: filters.payment_method,
            start_date: filters.start_date,
            end_date: filters.end_date,
            upcoming_payments: filters.upcoming_payments,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `collections_${new Date()
          .toISOString()
          .replace(/[-:T]/g, "")
          .slice(0, 15)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      setError("Failed to download CSV. Please try again.");
    }
  };

  const clearFilters = () => {
    const cleared = {
      id: "",
      tenancy_id: "",
      tenant_name: "",
      payment_method: "",
      start_date: "",
      end_date: "",
      upcoming_payments: "",
    };
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const handleEditClick = (collection) => {
    console.log("Collection ID:", collection);
    openModal("update-collection", "Update Collection", collection);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleDateRange = () => {
    setIsDateRangeOpen((prev) => !prev);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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

  return (
    <div className="border border-[#E9E9E9] rounded-md collection-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] collection-table-header">
        <h1 className="collection-head">Collection</h1>
        <div className="flex flex-col md:flex-row gap-[10px] collection-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 collection-search"
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
          <div className="flex gap-[10px] collection-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-collection duration-200"
              onClick={() => openModal("create-collection")}
            >
              Add Collection
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 w-[122px] h-[38px] rounded-md duration-200 collection-download-btn"
              onClick={handleDownloadCSV}
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

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="p-5 border-b border-[#E9E9E9] collection-desktop-only"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={filterVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-[10px] flexBars-wrap">
                {[
                  ["tenancy_id", tenancyIdOptions],
                  ["tenant_name", tenantNameOptions],
                  ["payment_method", paymentMethodOptions],
                  ["upcoming_payments", upcomingPaymentsOptions],
                ].map(([key, options]) => (
                  <div key={key} className="relative">
                    <CustomDropDown
                      options={options}
                      value={tempFilters[key]}
                      onChange={(value) =>
                        setTempFilters((prev) => ({ ...prev, [key]: value }))
                      }
                      placeholder="Select"
                      dropdownClassName="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer focus:border-gray-300 duration-200 collection-selection overflow-hidden text-ellipsis whitespace-nowrap"
                    />
                  </div>
                ))}
                <div className="relative" ref={dateRangeRef}>
                  <div
                    className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between collection-selection"
                    onClick={toggleDateRange}
                  >
                    Date Range
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${
                        isDateRangeOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  {isDateRangeOpen && (
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
                  Filter
                </button>
                <button
                  onClick={clearFilters}
                  className="w-[105px] h-[38px] bg-[#F0F0F0] text-[#4D4D4D] rounded-md clear-btn hover:bg-[#201D1E] hover:text-white duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <div className="p-5 text-center">Loading...</div>}
      {error && <div className="p-5 text-center text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="collection-desktop-only">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-5 text-left collection-thead">ID</th>
                  <th className="px-5 text-left collection-thead">DATE</th>
                  <th className="pl-5 text-left collection-thead">
                    TENANT NAME
                  </th>
                  <th className="px-5 text-left collection-thead ">AMOUNT</th>
                  <th className="px-5 text-left collection-thead ">
                    PAYMENT METHOD
                  </th>
                  <th className="px-5 text-left collection-thead">
                    INVOICE STATUS
                  </th>
                  <th className="px-5 py-3 text-right collection-thead w-[100px]">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr
                    key={collection.id}
                    className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 text-left collection-data">
                      {collection.id}
                    </td>
                    <td className="px-5 text-left collection-data">
                      {collection.collection_date}
                    </td>
                    <td className="pl-5 text-left collection-data">
                      {collection.tenant_name}
                    </td>
                    <td className="px-5 text-left collection-data">
                      {collection.amount}
                    </td>
                    <td className="px-5 text-left collection-data">
                      {collection.collection_mode
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </td>
                    <td className="px-5 text-left collection-data">
                      <span
                        className={`px-[15px] py-[5px] rounded-[4px] w-[100px] h-[28px] ${
                          collection.invoice_status === "pending"
                            ? "bg-[#FFE1E1] text-[#C72828]"
                            : collection.invoice_status === "paid"
                            ? "bg-[#28C76F29] text-[#28C76F]"
                            : "bg-[#FFF7E9] text-[#FBAD27]"
                        }`}
                      >
                        {collection.invoice_status === "pending"
                          ? "Pending"
                          : collection.invoice_status === "paid"
                          ? "Paid"
                          : "Partially Paid"}
                      </span>
                    </td>
                    <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                      <button onClick={() => handleEditClick(collection)}>
                        <img
                          src={editicon}
                          alt="Edit"
                          className="w-[18px] h-[18px] action-btn duration-200"
                        />
                      </button>
                      <button>
                        <img
                          src={downloadactionicon}
                          alt="Download"
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
                <tr className="collection-table-row-head">
                  <th className="px-5 text-left collection-thead collection-id-column">
                    ID
                  </th>
                  <th className="px-5 text-left collection-thead collection-date-column">
                    TENANT NAME
                  </th>
                  <th className="px-5 text-right collection-thead"></th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <React.Fragment key={collection.id}>
                    <tr
                      className={`${
                        expandedRows[collection.id]
                          ? "collection-mobile-no-border"
                          : "collection-mobile-with-border"
                      } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 text-left collection-data collection-id-column">
                        {collection.id}
                      </td>
                      <td className="px-5 text-left collection-data collection-date-column">
                        {collection.tenant_name}
                      </td>
                      <td className="py-4 flex items-center justify-end h-[57px]">
                        <div
                          className={`collection-dropdown-field ${
                            expandedRows[collection.id] ? "active" : ""
                          }`}
                          onClick={() => toggleRowExpand(collection.id)}
                        >
                          <img
                            src={downarrow}
                            alt="drop-down-arrow"
                            className={`collection-dropdown-img ${
                              expandedRows[collection.id] ? "text-white" : ""
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRows[collection.id] && (
                        <motion.tr
                          className="collection-mobile-with-border border-b border-[#E9E9E9]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={3} className="px-5">
                            <div className="collection-dropdown-content">
                              {/* Row 1: Tenancy ID & Date */}
                              <div className="collection-dropdown-grid">
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">TENANCY ID</div>
                                  <div className="collection-dropdown-value">{collection.tenancy_id}</div>
                                </div>
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">DATE</div>
                                  <div className="collection-dropdown-value">{collection.collection_date}</div>
                                </div>
                              </div>

                              {/* Row 2: Amount & Payment Method */}
                              <div className="collection-dropdown-grid">
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">AMOUNT</div>
                                  <div className="collection-dropdown-value">{collection.amount}</div>
                                </div>
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">PAYMENT METHOD</div>
                                  <div className="collection-dropdown-value">
                                    {collection.collection_mode
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                                  </div>
                                </div>
                              </div>

                              {/* Row 3: Invoice Status & Action */}
                              <div className="collection-dropdown-grid">
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">INVOICE STATUS</div>
                                  <div className="collection-dropdown-value">
                                    <span
                                      className={`px-[15px] py-[5px] pt-1 rounded-[4px] h-[28px] inline-block text-center ${
                                        collection.invoice_status === "pending"
                                          ? "bg-[#FFF3E0] text-[#F57C00]"
                                          : collection.invoice_status === "paid"
                                          ? "bg-[#28C76F29] text-[#28C76F]"
                                          : "bg-[#FFE1E1] text-[#C72828]"
                                      }`}
                                    >
                                      {collection.invoice_status === "pending"
                                        ? "Pending"
                                        : collection.invoice_status === "paid"
                                        ? "Paid"
                                        : "Partially Paid"}
                                    </span>
                                  </div>
                                </div>
                                <div className="collection-dropdown-item w-[50%]">
                                  <div className="collection-dropdown-label">ACTION</div>
                                  <div className="collection-dropdown-value flex items-center gap-4 mt-2">
                                    <button onClick={() => handleEditClick(collection)}>
                                      <img src={editicon} alt="Edit" className="w-[18px] h-[18px] action-btn duration-200" />
                                    </button>
                                    <button>
                                      <img src={downloadactionicon} alt="Download" className="w-[18px] h-[18px] action-btn duration-200" />
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 px-5 collection-pagination-container">
            <span className="collection-list-pagination collection-pagination-text">
              Showing {collections.length > 0 ? (currentPage - 1) * 10 + 1 : 0}{" "}
              to{" "}
              {Math.min(
                currentPage * 10,
                collections.length + (currentPage - 1) * 10
              )}{" "}
              of {totalPages * 10} entries
            </span>
            <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto collection-pagination-buttons">
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
        </>
      )}
    </div>
  );
};

export default Collection;