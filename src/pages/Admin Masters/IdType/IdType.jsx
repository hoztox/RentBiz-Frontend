import React, { useState, useEffect } from "react";
import "./IdType.css";
import { toast, Toaster } from "react-hot-toast";
import plusIcon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadIcon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editIcon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteIcon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import buildingImg from "../../../assets/Images/Admin Masters/building-img2.svg";
import downArrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { idTypesApi } from "../MastersApi"; // Updated import
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const IdType = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [idTypes, setIdTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idTypeIdToDelete, setIdTypeIdToDelete] = useState(null);
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

  const [selectedOption, setSelectedOption] = useState("showing");

  // Fetch ID types from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const idData = await idTypesApi.fetch();
      setIdTypes(idData);
    } catch (err) {
      console.error("Error fetching ID types:", err);
      const errorMessage =
        err.message || "Failed to fetch ID types. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIdTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    setIdTypeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idTypeIdToDelete) return;
    try {
      await idTypesApi.delete(idTypeIdToDelete);
      setIdTypes((prev) => prev.filter((item) => item.id !== idTypeIdToDelete));
      toast.success("ID Type deleted successfully.");
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting ID type:", error);
      const errorMessage =
        error.message || "Failed to delete ID type. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setIdTypeIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIdTypeIdToDelete(null);
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
  const filteredData = idTypes.filter((idType) => {
    const searchLower = searchTerm.toLowerCase();
    const createdDate = formatDate(idType.created_at);
    return (
      createdDate.toLowerCase().includes(searchLower) ||
      idType.title?.toLowerCase().includes(searchLower)
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
    fetchData();
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, searchTerm, refreshCounter]);

  const handleEditClick = (idType) => {
    console.log("ID Types: Selected IdType:", idType);
    openModal("update-id-type-master", "Update ID Type Master", idType);
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
      <div className="border border-gray-200 rounded-md idtype-table">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading ID types...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-gray-200 rounded-md idtype-table">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-lg text-red-600">{error}</div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md idtype-table">
      <Toaster />

      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] idtype-table-header">
        <h1 className="idtype-head">ID Type Masters</h1>
        <div className="flex flex-col md:flex-row gap-[10px] idtype-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md md:w-[302px] focus:border-gray-300 duration-200 idtype-search"
              disabled={loading}
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 idtype-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md idtype-add-new-master duration-200"
              onClick={() =>
                openModal("create-id-type-master", "Create New ID Type Master")
              }
              disabled={loading}
            >
              Add New Master
              <img
                src={plusIcon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 idtype-download-btn"
              disabled={loading}
            >
              Download
              <img
                src={downloadIcon}
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
                  <th className="px-4 py-3 text-left idtype-thead">ID</th>
                  <th className="px-4 py-3 text-left idtype-thead">
                    ENTRY DATE
                  </th>
                  <th className="px-4 py-3 text-left idtype-thead">TITLE</th>
                  <th className="px-4 py-3 text-right idtype-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No ID types found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((idType, index) => {
                    const isLastItemOnPage = index === paginatedData.length - 1;
                    const shouldRemoveBorder =
                      isLastItemOnPage && paginatedData.length === itemsPerPage;
                    return (
                      <tr
                        key={idType.id}
                        className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                          shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                        }`}
                      >
                        <td className="px-5 text-left idtype-data">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-5 text-left idtype-data">
                          {formatDate(idType.created_at)}
                        </td>
                        <td className="pl-5 text-left idtype-data w-[22%]">
                          {idType.title || "N/A"}
                        </td>
                        <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                          <button
                            onClick={() => handleEditClick(idType)}
                            disabled={loading}
                          >
                            <img
                              src={editIcon}
                              alt="Edit"
                              className="w-[18px] h-[18px] action-btn duration-200"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(idType.id)}
                            disabled={loading}
                          >
                            <img
                              src={deleteIcon}
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
              src={buildingImg}
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
            <tr className="idtype-table-row-head">
              <th className="px-5 w-[52%] text-left idtype-thead idtype-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left idtype-thead idtype-entry-date-column">
                TITLE
              </th>
              <th className="px-5 text-right idtype-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                  No ID types found
                </td>
              </tr>
            ) : (
              paginatedData.map((idType, index) => (
                <React.Fragment key={idType.id}>
                  <tr
                    className={`${
                      expandedRows[idType.id]
                        ? "mobile-no-border"
                        : "mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left idtype-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-3 text-left idtype-data idtype-entry-date-column">
                      {idType.title || "N/A"}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`idtype-dropdown-field ${
                          expandedRows[idType.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(idType.id)}
                      >
                        <img
                          src={downArrow}
                          alt="drop-down-arrow"
                          className={`idtype-dropdown-img ${
                            expandedRows[idType.id] ? "text-white" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[idType.id] && (
                      <motion.tr
                        className="mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="px-5">
                          <div className="idtype-dropdown-content">
                            <div className="idtype-grid">
                              <div className="idtype-grid-items">
                                <div className="dropdown-label">ENTRY DATE</div>
                                <div className="dropdown-value">
                                  {formatDate(idType.created_at)}
                                </div>
                              </div>
                              <div className="idtype-grid-items">
                                <div className="dropdown-label">ACTION</div>
                                <div className="dropdown-value flex items-center gap-2 p-1 ml-[5px]">
                                  <button
                                    onClick={() => handleEditClick(idType)}
                                    disabled={loading}
                                  >
                                    <img
                                      src={editIcon}
                                      alt="Edit"
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(idType.id)}
                                    disabled={loading}
                                  >
                                    <img
                                      src={deleteIcon}
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

      {/* Pagination */}
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
        title="Delete ID Type"
        message="Are you sure you want to delete this ID type?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default IdType;
