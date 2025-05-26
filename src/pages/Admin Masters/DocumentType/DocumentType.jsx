import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DocumentType.css";
import { ChevronDown } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import buildingimg from "../../../assets/Images/Admin Masters/building-img.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import DeleteDocumentTypeModal from "./DeleteDocumentTypeModal/DeleteDocumentTypeModal";

const DocumentType = () => {
  const { openModal, refreshCounter } = useModal();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docTypeIdToDelete, setDocTypeIdToDelete] = useState(null);
  const itemsPerPage = 10;

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

  // Fetch document types from backend
  const fetchDocTypes = async () => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setLoading(false);
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/company/doc_type/company/${companyId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const docData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setDocTypes(docData);
    } catch (err) {
      console.error("Error fetching document types:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch document types. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setDocTypes([]);
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
    setDocTypeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!docTypeIdToDelete) return;
    try {
      await axios.delete(`${BASE_URL}/company/doc_type/${docTypeIdToDelete}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setDocTypes((prev) => prev.filter((item) => item.id !== docTypeIdToDelete));
      toast.success("Document Type deleted successfully.");
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting document type:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete document type. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setDocTypeIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDocTypeIdToDelete(null);
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
  const filteredData = docTypes.filter((docType) => {
    const searchLower = searchTerm.toLowerCase();
    const createdDate = formatDate(docType.created_at);
    return (
      createdDate.toLowerCase().includes(searchLower) ||
      docType.title?.toLowerCase().includes(searchLower)
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
    fetchDocTypes();
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [companyId, currentPage, searchTerm, refreshCounter]);

  const openUpdateModal = (docType) => {
    openModal("update-document-type-master", docType);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="border border-gray-200 rounded-md doctype-table">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading document types...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-gray-200 rounded-md doctype-table">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-lg text-red-600">{error}</div>
          <button
            onClick={fetchDocTypes}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md doctype-table">
      <Toaster />

      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] doctype-table-header">
        <h1 className="doctype-head">Document Type Masters</h1>
        <div className="flex flex-col md:flex-row gap-[10px] doctype-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md md:w-[302px] focus:border-gray-300 duration-200 doctype-search"
              disabled={loading}
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 doctype-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
                disabled={loading}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md doctype-add-new-master duration-200"
              onClick={() => openModal("create-document-type-master")}
              disabled={loading}
            >
              Add New Master
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 doctype-download-btn"
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

      {/* Content Section */}
      <div className="desktop-only">
        <div className="flex gap-4 p-5">
          {/* Table Section */}
          <div className="w-[60%] border border-gray-200 rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-4 py-3 text-left doctype-thead">ID</th>
                  <th className="px-4 py-3 text-left doctype-thead">ENTRY DATE</th>
                  <th className="px-4 py-3 text-left doctype-thead">TITLE</th>
                  <th className="px-4 py-3 text-right doctype-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No document types found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((docType, index) => {
                    const isLastItemOnPage = index === paginatedData.length - 1;
                    const shouldRemoveBorder =
                      isLastItemOnPage && paginatedData.length === itemsPerPage;
                    return (
                      <tr
                        key={docType.id}
                        className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                          shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                        }`}
                      >
                        <td className="px-5 text-left doctype-data">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-5 text-left doctype-data">
                          {formatDate(docType.created_at)}
                        </td>
                        <td className="pl-5 text-left doctype-data w-[22%]">
                          {docType.title || "N/A"}
                        </td>
                        <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                          <button
                            onClick={() => openUpdateModal(docType)}
                            disabled={loading}
                          >
                            <img
                              src={editicon}
                              alt="Edit"
                              className="w-[18px] h-[18px] action-btn duration-200"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(docType.id)}
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
          {/* Image Section */}
          <div className="w-[40%] border border-[#E9E9E9] rounded-md p-5">
            <img
              src={buildingimg}
              alt="Building exterior"
              className="h-[587px] w-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Mobile Table */}
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="doctype-table-row-head">
              <th className="px-5 w-[52%] text-left doctype-thead doctype-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left doctype-thead doctype-entry-date-column">
                TITLE
              </th>
              <th className="px-5 text-right doctype-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                  No document types found
                </td>
              </tr>
            ) : (
              paginatedData.map((docType, index) => (
                <React.Fragment key={docType.id}>
                  <tr
                    className={`${
                      expandedRows[docType.id]
                        ? "mobile-no-border"
                        : "mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left doctype-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-3 text-left doctype-data doctype-entry-date-column">
                     {docType.title || "N/A"}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`doctype-dropdown-field ${
                          expandedRows[docType.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(docType.id)}
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`doctype-dropdown-img ${
                            expandedRows[docType.id] ? "text-white" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  {expandedRows[docType.id] && (
                    <tr className="mobile-with-border border-b border-[#E9E9E9]">
                      <td colSpan={3} className="px-5">
                        <div className="doctype-dropdown-content">
                          <div className="doctype-grid">
                            <div className="doctype-grid-items">
                              <div className="dropdown-label">ENTRY DATE</div>
                              <div className="dropdown-value">
                                 {formatDate(docType.created_at)}
                                
                              </div>
                            </div>
                            <div className="doctype-grid-items">
                              <div className="dropdown-label">ACTION</div>
                              <div className="dropdown-value flex items-center gap-2 p-1 ml-[5px]">
                                <button
                                  onClick={() => openUpdateModal(docType)}
                                  disabled={loading}
                                >
                                  <img
                                    src={editicon}
                                    alt="Edit"
                                    className="w-[18px] h-[18px] action-btn duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => handleDelete(docType.id)}
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
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
          <span className="collection-list-pagination">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
            entries
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

      <DeleteDocumentTypeModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default DocumentType;