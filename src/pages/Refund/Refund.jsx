import React, { useState, useEffect } from "react";
import "./Refund.css";
import plusicon from "../../assets/Images/Refund/plus-icon.svg";
import downloadicon from "../../assets/Images/Refund/download-icon.svg";
import editicon from "../../assets/Images/Refund/edit-icon.svg";
import printericon from "../../assets/Images/Refund/printer-icon.svg";
import downloadactionicon from "../../assets/Images/Refund/download-action-icon.svg";
import downarrow from "../../assets/Images/Refund/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const Refund = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const [selectedOption, setSelectedOption] = useState("showing");
  const [refunds, setRefunds] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dropdown options
  const dropdownOptions = [
    { label: "Showing", value: "showing" },
    { label: "All", value: "all" },
  ];

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${BASE_URL}/finance/refunds/`, {
        params: {
          page: currentPage,
          search: searchTerm,
          filter: selectedOption,
        },
      });
      setRefunds(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        total_pages: Math.ceil(response.data.count / 10), // Assuming page_size=10
      });
    } catch (err) {
      console.error("Error fetching refunds:", err);
      setError("Failed to fetch refunds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [currentPage, searchTerm, selectedOption]);

  const handleEditClick = (refund) => {
    console.log("Refund ID:", refund);
    openModal("update-refund", "Update Refund", refund);
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

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(pagination.total_pages, startPage + maxPageButtons - 1);

  return (
    <div className="border border-[#E9E9E9] rounded-md refund-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] refund-table-header">
        <h1 className="refund-head">Refund</h1>
        <div className="flex flex-col md:flex-row gap-[10px] refund-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 refund-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                placeholder="Select"
                dropdownClassName="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 refund-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] refund-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md add-refund duration-200 w-[176px]"
              onClick={() => openModal("create-refund")}
            >
              Add Refund
              <img
                src={plusicon}
                alt="plus icon"
                className="w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 download-btn w-[122px]">
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
      {error && (
        <div className="px-5 py-2 bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}
      {loading && (
        <div className="px-5 py-2 bg-blue-100 text-blue-700 text-sm">
          Loading...
        </div>
      )}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left refund-thead">ID</th>
              <th className="px-5 text-left refund-thead">DATE</th>
              <th className="pl-5 text-left refund-thead">TENANCY ID</th>
              <th className="pl-5 text-left refund-thead">TENANT NAME</th>
              <th className="px-5 text-left refund-thead">AMOUNT</th>
              <th className="px-5 text-left refund-thead">PAYMENT METHOD</th>
              <th className="px-5 text-left refund-thead w-[68px]">STATUS</th>
              <th className="px-5 pr-11 text-right refund-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left refund-data">{refund.id}</td>
                <td className="px-5 text-left refund-data">{refund.processed_date}</td>
                <td className="pl-5 text-left refund-data">{refund.tenancy_id}</td>
                <td className="pl-5 text-left refund-data">{refund.tenant_name}</td>
                <td className="px-5 text-left refund-data">{refund.amount}</td>
                <td className="px-5 text-left refund-data">{refund.refund_method}</td>
                <td className="px-5 text-left refund-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] h-[28px] ${
                      refund.status === "Paid"
                        ? "bg-[#28C76F29] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {refund.status}
                  </span>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleEditClick(refund)}>
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
                  <button>
                    <img
                      src={printericon}
                      alt="Print"
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
            <tr className="refund-table-row-head">
              <th className="px-5 pl-[12px] text-left refund-thead refund-id-column">ID</th>
              <th className="px-5 text-left refund-thead refund-date-column">DATE</th>
              <th className="px-5 text-left refund-thead refund-tenancy-id-column">TENANCY ID</th>
              <th className="text-right refund-thead"></th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[refund.id + index]
                      ? "refund-mobile-no-border"
                      : "refund-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 pl-[12px] text-left refund-data refund-id-column">{refund.id}</td>
                  <td className="px-5 text-left refund-data refund-date-column">{refund.processed_date}</td>
                  <td className="px-5 text-left refund-data refund-tenancy-id-column">{refund.tenancy_id}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`refund-dropdown-field ${
                        expandedRows[refund.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(refund.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`refund-dropdown-img ${
                          expandedRows[refund.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[refund.id + index] && (
                    <motion.tr
                      className="refund-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={4} className="pl-3">
                        <div className="refund-dropdown-content">
                          <div className="refund-dropdown-grid">
                            <div className="refund-dropdown-item refund-tenant-name-column">
                              <div className="refund-dropdown-label">TENANT NAME</div>
                              <div className="refund-dropdown-value">{refund.tenant_name}</div>
                            </div>
                            <div className="refund-dropdown-item refund-amount-column">
                              <div className="refund-dropdown-label">AMOUNT</div>
                              <div className="refund-dropdown-value">{refund.amount}</div>
                            </div>
                            <div className="refund-dropdown-item refund-payment-method-column">
                              <div className="refund-dropdown-label">PAYMENT METHOD</div>
                              <div className="refund-dropdown-value">{refund.refund_method}</div>
                            </div>
                          </div>
                          <div className="refund-dropdown-grid">
                            <div className="refund-dropdown-item refund-status-column">
                              <div className="refund-dropdown-label">STATUS</div>
                              <div className="refund-dropdown-value">
                                <span
                                  className={`refund-status ${
                                    refund.status === "Paid"
                                      ? "bg-[#28C76F29] text-[#28C76F]"
                                      : "bg-[#FFE1E1] text-[#C72828]"
                                  }`}
                                >
                                  {refund.status}
                                </span>
                              </div>
                            </div>
                            <div className="refund-dropdown-item refund-action-column">
                              <div className="refund-dropdown-label">ACTION</div>
                              <div className="refund-dropdown-value flex items-center gap-4 p-[5px]">
                                <button onClick={() => handleEditClick(refund)}>
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
                                <button>
                                  <img
                                    src={printericon}
                                    alt="Print"
                                    className="w-[18px] h-[18px] action-btn duration-200"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 refund-pagination-container">
        <span className="refund-pagination collection-list-pagination">
          Showing {Math.min((currentPage - 1) * 10 + 1, pagination.count)} to{" "}
          {Math.min(currentPage * 10, pagination.count)} of {pagination.count} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto refund-pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={!pagination.previous}
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
          {endPage < pagination.total_pages - 1 && (
            <span className="px-2 flex items-center">...</span>
          )}
          {endPage < pagination.total_pages && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(pagination.total_pages)}
            >
              {pagination.total_pages}
            </button>
          )}
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={!pagination.next}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Refund;