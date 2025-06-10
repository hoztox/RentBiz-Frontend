import React, { useState, useEffect } from "react";
import "./chargecodetype.css";
import plusIcon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadIcon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editIcon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteIcon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import buildingImg from "../../../assets/Images/Admin Masters/building2.jpg";
import downArrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import ChargeCodeDeleteModal from "./ChargeCodeDeleteModal/ChargeCodeDeleteModal";
import { chargeCodesApi } from "../MastersApi";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const ChargeCodeType = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chargeCodeIdToDelete, setChargeCodeIdToDelete] = useState(null);
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

  const [selectedOption, setSelectedOption] = useState("showing");

  // Fetch charge code data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const chargeCodes = await chargeCodesApi.fetch();
      setData(chargeCodes);
    } catch (err) {
      console.error("Error fetching charge codes:", err.message);
      const errorMessage = err.message || "Failed to load charge codes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshCounter]);

  // Handle delete initiation
  const handleDelete = (id) => {
    setChargeCodeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!chargeCodeIdToDelete) return;

    try {
      setLoading(true);
      setError(null);
      await chargeCodesApi.delete(chargeCodeIdToDelete);
      setData((prev) =>
        prev.filter((item) => item.id !== chargeCodeIdToDelete)
      );
      toast.success("Charge code deleted successfully");
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error deleting charge code:", err.message);
      const errorMessage = err.message || "Failed to delete charge code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setChargeCodeIdToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setChargeCodeIdToDelete(null);
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
  const filteredData = data.filter((chargeCode) => {
    const searchLower = searchTerm.toLowerCase();
    const createdDate = formatDate(chargeCode.created_at);
    return (
      createdDate.toLowerCase().includes(searchLower) ||
      chargeCode.title?.toLowerCase().includes(searchLower) ||
      chargeCode.id.toString().toLowerCase().includes(searchLower)
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

  const handleEditClick = (chargeCode) => {
    console.log("Charge Code: Selected Charge Code:", chargeCode);
    openModal(
      "update-charge-code-type",
      "Update Charge Code Master",
      chargeCode
    );
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

  return (
    <div className="border border-gray-200 rounded-md idtype-table">
      <Toaster />
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] idtype-table-header">
        <h1 className="idtype-head">Charge Code Masters</h1>
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
              className={`flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md idtype-add-new-master duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2892CE] hover:bg-[#2276a7]"
              }`}
              onClick={() => openModal("create-charge-code-type")}
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
              className={`flex items-center justify-center gap-2 w-full md:w-[150px] h-[38px] rounded-md duration-200 idtype-download-btn ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6]"
              }`}
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
      {loading ? (
        <div className="p-5 text-center">Loading...</div>
      ) : error ? (
        <div className="p-5 text-center text-red-500">{error}</div>
      ) : (
        <>
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
                      <th className="px-4 py-3 text-left idtype-thead">
                        TITLE
                      </th>
                      <th className="px-4 py-3 text-right idtype-thead">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-8 text-center text-gray-500"
                        >
                          No Charge Code Types found
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((chargeCode, index) => {
                        const isLastItemOnPage =
                          index === paginatedData.length - 1;
                        const shouldRemoveBorder =
                          isLastItemOnPage &&
                          paginatedData.length === itemsPerPage;

                        return (
                          <tr
                            key={chargeCode.id}
                            className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                              shouldRemoveBorder
                                ? ""
                                : "border-b border-[#E9E9E9]"
                            }`}
                          >
                            <td className="px-5 text-left idtype-data">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-5 text-left idtype-data">
                              {formatDate(chargeCode.created_at)}
                            </td>
                            <td className="pl-5 text-left idtype-data w-[22%]">
                              {chargeCode.title}
                            </td>
                            <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                              <button
                                onClick={() => handleEditClick(chargeCode)}
                                disabled={loading}
                              >
                                <img
                                  src={editIcon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(chargeCode.id)}
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
                    <td
                      colSpan={3}
                      className="px-5 py-4 text-center idtype-data text-gray-500"
                    >
                      No Charge Code Types found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((chargeCode, index) => (
                    <React.Fragment key={chargeCode.id}>
                      <tr
                        className={`${
                          expandedRows[chargeCode.id]
                            ? "mobile-no-border"
                            : "mobile-with-border"
                        } border-b border-[#E9E9E9] h-[57px]`}
                      >
                        <td className="px-5 text-left idtype-data">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-3 text-left idtype-data idtype-entry-date-column">
                          {chargeCode.title}
                        </td>
                        <td className="py-4 flex items-center justify-end h-[57px]">
                          <div
                            className={`idtype-dropdown-field ${
                              expandedRows[chargeCode.id] ? "active" : ""
                            }`}
                            onClick={() => toggleRowExpand(chargeCode.id)}
                          >
                            <img
                              src={downArrow}
                              alt="drop-down-arrow"
                              className={`idtype-dropdown-img ${
                                expandedRows[chargeCode.id] ? "text-white" : ""
                              }`}
                            />
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedRows[chargeCode.id] && (
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
                                    <div className="dropdown-label">
                                      ENTRY DATE
                                    </div>
                                    <div className="dropdown-value">
                                      {formatDate(chargeCode.created_at)}
                                    </div>
                                  </div>
                                  <div className="idtype-grid-items">
                                    <div className="dropdown-label">ACTION</div>
                                    <div className="dropdown-value flex items-center gap-2 p-1 ml-[5px]">
                                      <button
                                        onClick={() =>
                                          handleEditClick(chargeCode)
                                        }
                                        disabled={loading}
                                      >
                                        <img
                                          src={editIcon}
                                          alt="Edit"
                                          className="w-[18px] h-[18px] action-btn duration-200"
                                        />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete(chargeCode.id)
                                        }
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
                to {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                of {filteredData.length} entries
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
        </>
      )}
      <ChargeCodeDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ChargeCodeType;
