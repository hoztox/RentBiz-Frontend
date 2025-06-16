import React, { useState, useEffect } from "react";
import "./Invoice.css";
import plusicon from "../../assets/Images/Invoice/plus-icon.svg";
import downloadicon from "../../assets/Images/Invoice/download-icon.svg";
import deleteicon from "../../assets/Images/Invoice/delete-icon.svg";
import viewicon from "../../assets/Images/Invoice/view-icon.svg";
import downarrow from "../../assets/Images/Invoice/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const Invoice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const [selectedOption, setSelectedOption] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Dropdown options for CustomDropDown
  const dropdownOptions = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

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

  const fetchInvoices = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("No company ID found");
        return;
      }

      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm,
        status: selectedOption === "all" ? "" : selectedOption,
        page: currentPage,
        page_size: itemsPerPage,
      };

      const response = await axios.get(`${BASE_URL}/company/invoices/company/${companyId}/`, { params });
      console.log("API Response:", response.data);

      if (response.data && response.data.results) {
        const mappedInvoices = response.data.results.map((invoice) => ({
          dbId: invoice.id,
          id: invoice.invoice_number || `INV${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`,
          date: invoice.in_date || "",
          tenantName: invoice.tenancy?.tenant?.tenant_name || "Unknown",
          amountDue: invoice.total_amount ? parseFloat(invoice.total_amount).toFixed(2) : "0.00",
          status: invoice.status || "unpaid",
          view: viewicon,
        }));
        setInvoices(mappedInvoices);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        console.log("Fetched invoices:", mappedInvoices);
      } else {
        setError(response.data?.message || "Failed to fetch invoices");
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError(error.response?.data?.message || "Error fetching invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("No company ID found");
        return;
      }

      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm,
        status: selectedOption === "all" ? "" : selectedOption,
      };

      const response = await axios.get(`${BASE_URL}/company/invoices/company/${companyId}/export-csv/`, {
        params,
        responseType: 'blob', // Important for handling binary data
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_company_${companyId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("CSV downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError(error.response?.data?.message || "Error downloading CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${BASE_URL}/company/invoice/delete/${itemToDelete.dbId}/`);
      if (response.data && response.data.success) {
        setInvoices((prev) => prev.filter((invoice) => invoice.dbId !== itemToDelete.dbId));
        alert(`Invoice ${itemToDelete.id} deleted successfully`);
        console.log("Deleted invoice:", itemToDelete.dbId);
      } else {
        throw new Error(response.data?.message || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      setError(error.response?.data?.message || error.message || "Error deleting invoice");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, selectedOption, currentPage]);

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const handleDeleteClick = (invoice) => {
    setItemToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const toggleRowExpand = (dbId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [dbId]: !prev[dbId],
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

  const handleViewClick = (invoice) => {
    console.log("Selected invoice for view:", invoice);
    openModal("view-invoice", "View Invoice", invoice);
  };

  const getStatusBadge = (status) => {
    const badgeClass = status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass} capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md inv-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] inv-table-header">
        <h1 className="inv-head">Invoice List</h1>
        <div className="flex flex-col md:flex-row gap-[10px] inv-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 inv-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 inv-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] inv-action-buttons-container w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md inv-add-invoice duration-200 w-[176px]"
              onClick={() => openModal("create-invoice", "Create New Invoice", { onSuccess: fetchInvoices })}
            >
              Add New Invoice
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 inv-download-btn w-[122px]"
              onClick={handleDownloadCSV}
            >
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] inv-download-img"
              />
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="inv-desktop-only">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-5 text-left inv-thead">ID</th>
                  <th className="px-5 text-left inv-thead">DATE</th>
                  <th className="pl-5 text-left inv-thead">TENANT NAME</th>
                  <th className="px-5 text-left inv-thead w-[10%]">AMOUNT DUE</th>
                  <th className="px-5 text-left inv-thead">STATUS</th>
                  <th className="pl-12 pr-5 text-center inv-thead">VIEW</th>
                  <th className="px-5 pr-6 text-right inv-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.dbId}
                    className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 text-left inv-data">{invoice.id}</td>
                    <td className="px-5 text-left inv-data">{invoice.date}</td>
                    <td className="pl-5 text-left inv-data">{invoice.tenantName}</td>
                    <td className="px-5 text-left inv-data">{invoice.amountDue}</td>
                    <td className="px-5 text-left inv-data">{getStatusBadge(invoice.status)}</td>
                    <td className="pl-14 text-center pr-5 pt-2">
                      <button onClick={() => handleViewClick(invoice)}>
                        <img
                          src={invoice.view}
                          alt="View"
                          className="w-[30px] h-[24px] inv-action-btn duration-200"
                        />
                      </button>
                    </td>
                    <td className="px-5 flex items-center justify-end h-[57px]">
                      <button onClick={() => handleDeleteClick(invoice)}>
                        <img
                          src={deleteicon}
                          alt="Delete"
                          className="w-[18px] h-[18px] inv-action-btn duration-200 mr-[24px]"
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
                <tr className="inv-table-row-head">
                  <th className="px-5 text-left inv-thead inv-id-column">ID</th>
                  <th className="px-5 text-left inv-thead inv-date-column">TENANT NAME</th>
                  <th className="px-5 text-right inv-thead"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <React.Fragment key={invoice.dbId}>
                    <tr
                      className={`${expandedRows[invoice.dbId]
                        ? "inv-mobile-no-border"
                        : "inv-mobile-with-border"
                        } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 text-left inv-data inv-id-column">{invoice.id}</td>
                      <td className="px-5 text-left inv-data inv-date-column">{invoice.tenantName}</td>
                      <td className="py-4 flex items-center justify-end h-[57px]">
                        <div
                          className={`inv-dropdown-field ${expandedRows[invoice.dbId] ? "active" : ""}`}
                          onClick={() => toggleRowExpand(invoice.dbId)}
                        >
                          <img
                            src={downarrow}
                            alt="drop-down-arrow"
                            className={`inv-dropdown-img ${expandedRows[invoice.dbId] ? "text-white" : ""}`}
                          />
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRows[invoice.dbId] && (
                        <motion.tr
                          className="inv-mobile-with-border border-b border-[#E9E9E9]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={3} className="px-5">
                            <div className="inv-dropdown-content">
                              <div className="inv-dropdown-content-grid">
                                <div className="inv-dropdown-content-item w-[50%]">
                                  <div className="inv-dropdown-label">DATE</div>
                                  <div className="inv-dropdown-value">{invoice.date}</div>
                                </div>
                                <div className="inv-dropdown-content-item w-[50%]">
                                  <div className="inv-dropdown-label">AMOUNT DUE</div>
                                  <div className="inv-dropdown-value">{invoice.amountDue}</div>
                                </div>
                              </div>
                              <div className="inv-dropdown-content-grid">
                                <div className="inv-dropdown-content-item w-[50%]">
                                  <div className="inv-dropdown-label">STATUS</div>
                                  <div className="inv-dropdown-value">{getStatusBadge(invoice.status)}</div>
                                </div>
                                <div className="inv-dropdown-content-item w-[50%]">
                                  <div className="inv-dropdown-label">VIEW</div>
                                  <div className="inv-dropdown-value">
                                    <button onClick={() => handleViewClick(invoice)}>
                                      <img
                                        src={viewicon}
                                        alt="View"
                                        className="w-[30px] h-[24px] tenancy-action-btn duration-200"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="inv-dropdown-content-grid">
                                <div className="inv-dropdown-content-item w-[50%]">
                                  <div className="inv-dropdown-label">ACTION</div>
                                  <div className="inv-dropdown-value flex items-center gap-4">
                                    <button onClick={() => handleDeleteClick(invoice)}>
                                      <img
                                        src={deleteicon}
                                        alt="Delete"
                                        className="w-[18px] h-[18px] inv-action-btn duration-200"
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
        </>
      )}

      {/* Pagination Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, invoices.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, invoices.length)} of {invoices.length} entries
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

      {/* Confirmation Modal */}
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

export default Invoice;