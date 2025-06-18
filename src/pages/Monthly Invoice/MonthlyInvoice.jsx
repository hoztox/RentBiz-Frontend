import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MonthlyInvoice.css";
import plusicon from "../../assets/Images/Monthly Invoice/plus-icon.svg";
import downloadicon from "../../assets/Images/Monthly Invoice/download-icon.svg";
import deleteicon from "../../assets/Images/Monthly Invoice/delete-icon.svg";
import viewicon from "../../assets/Images/Monthly Invoice/view-icon.svg";
import downarrow from "../../assets/Images/Monthly Invoice/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { BASE_URL } from "../../utils/config";
import { toast, Toaster } from "react-hot-toast";

const MonthlyInvoice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "", label: "All" },
    { value: "showing", label: "Showing" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchInvoices = async () => {
    if (!companyId) {
      setError("Company ID not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/invoices/auto-generated/${companyId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            search: searchTerm,
            status: statusFilter,
            page: currentPage,
            page_size: itemsPerPage,
          },
        }
      );

      setInvoices(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (err) {
      if (err.response?.status === 404 && currentPage > 1) {
        setCurrentPage(1);
      } else {
        console.error("Error fetching invoices:", err);
        setError(
          "Failed to fetch invoices: " +
            (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchInvoices();
    }
  }, [companyId, searchTerm, statusFilter, currentPage]);

  const handleDeleteClick = (invoice) => {
    setItemToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/company/invoices/${itemToDelete.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoices(invoices.filter((inv) => inv.id !== itemToDelete.id));
      toast.success("Invoice deleted successfully.");
    } catch (err) {
      console.error("Error deleting invoice:", err);
      setError(
        "Failed to delete invoice: " +
          (err.response?.data?.message || err.message)
      );
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md mi-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] mi-table-header">
        <h1 className="mi-head">Invoice List (Auto Generated)</h1>
        <div className="flex flex-col md:flex-row gap-[10px] mi-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 mi-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Select Status"
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 mi-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] mi-action-buttons-container w-full md:w-auto justify-start">

            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 mi-download-btn w-[122px]">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] mi-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mi-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left mi-thead">ID</th>
              <th className="px-5 text-left mi-thead">DATE</th>
              <th className="pl-5 text-left mi-thead">TENANCY ID</th>
              <th className="pl-5 text-left mi-thead">TENANT NAME</th>
              <th className="px-5 text-left mi-thead w-[10%]">AMOUNT DUE</th>
              <th className="pl-12 pr-5 text-center mi-thead">VIEW</th>
              <th className="px-5 pr-6 text-right mi-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left mi-data">{invoice.id}</td>
                <td className="px-5 text-left mi-data">
                  {new Date(invoice.in_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="pl-5 text-left mi-data">{invoice.tenancy?.tenancy_code || "N/A"}</td>
                <td className="pl-5 text-left mi-data">{invoice.tenancy?.tenant?.tenant_name || "N/A"}</td>
                <td className="px-5 text-left mi-data">{invoice.total_amount}</td>
                <td className="pl-14 text-center pr-5 pt-2">
                  <button onClick={() => openModal("view-monthly-invoice", null, invoice)}>
                    <img
                      src={viewicon}
                      alt="View"
                      className="w-[30px] h-[24px] mi-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleDeleteClick(invoice)}>
                    <img
                      src={deleteicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] mi-action-btn mr-[22px] duration-200"
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
            <tr className="mi-table-row-head">
              <th className="px-5 text-left mi-thead mi-id-column">ID</th>
              <th className="px-5 text-left mi-thead mi-date-column">TENANT NAME</th>
              <th className="px-5 text-right mi-thead"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[invoice.id + index]
                      ? "mi-mobile-no-border"
                      : "mi-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left mi-data mi-id-column">{invoice.id}</td>
                  <td className="px-5 text-left mi-data mi-date-column">
                    {invoice.tenancy?.tenant?.tenant_name || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`mi-dropdown-field ${
                        expandedRows[invoice.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(invoice.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`mi-dropdown-img ${
                          expandedRows[invoice.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[invoice.id + index] && (
                    <motion.tr
                      className="mi-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="mi-dropdown-content">
                          <div className="mi-dropdown-content-grid">
                            <div className="mi-dropdown-content-item w-[50%]">
                              <div className="mi-dropdown-label">TENANCY ID</div>
                              <div className="mi-dropdown-value">{invoice.tenancy?.tenancy_code || "N/A"}</div>
                            </div>
                            <div className="mi-dropdown-content-item w-[50%]">
                              <div className="mi-dropdown-label">DATE</div>
                              <div className="mi-dropdown-value">
                                {new Date(invoice.in_date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="mi-dropdown-content-grid">
                            <div className="mi-dropdown-content-item w-[50%]">
                              <div className="mi-dropdown-label">AMOUNT DUE</div>
                              <div className="mi-dropdown-value">{invoice.total_amount}</div>
                            </div>
                            <div className="mi-dropdown-content-item w-[25%]">
                              <div className="mi-dropdown-label">VIEW</div>
                              <div className="mi-dropdown-value">
                                <button onClick={() => openModal("view-monthly-invoice", null, invoice)}>
                                  <img
                                    src={viewicon}
                                    alt="View"
                                    className="w-[30px] h-[24px] mi-action-btn duration-200"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="mi-dropdown-content-item w-[25%]">
                              <div className="mi-dropdown-label">ACTION</div>
                              <div className="mi-dropdown-value flex items-center gap-4">
                                <button onClick={() => handleDeleteClick(invoice)}>
                                  <img
                                    src={deleteicon}
                                    alt="Delete"
                                    className="w-[18px] h-[18px] mi-action-btn duration-200"
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
          {totalCount} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
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
        isOpen={isDeleteModalOpen}
        type="delete"
        title="Delete Invoice"
        message={`Are you sure you want to delete the invoice with ID ${itemToDelete?.id}?`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default MonthlyInvoice;