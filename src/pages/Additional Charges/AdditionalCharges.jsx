import React, { useState, useEffect } from "react";
import "./AdditionalCharges.css";
import plusicon from "../../assets/Images/Additional Charges/plus-icon.svg";
import downloadicon from "../../assets/Images/Additional Charges/download-icon.svg";
import editicon from "../../assets/Images/Additional Charges/edit-icon.svg";
import deleteicon from "../../assets/Images/Additional Charges/delete-icon.svg";
import downarrow from "../../assets/Images/Additional Charges/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { toast, Toaster } from "react-hot-toast";

const AdminAdditionalCharges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal, refreshCounter } = useModal();
  const [selectedOption, setSelectedOption] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const dropdownOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Invoiced", value: "invoiced" }, // Updated from "invoice" to "invoiced"
  ];

  const fetchAdditionalCharges = async (page = 1, search = "", status = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/company/additional-charges/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: {
            page: page,
            search: search,
            status: status === "all" ? "" : status,
            page_size: itemsPerPage,
          },
        }
      );

      if (response.data.results.success && response.data.results.data) {
        // Normalize status from "invoice" to "invoiced"
        const normalizedCharges = response.data.results.data.map((charge) => ({
          ...charge,
          status: charge.status === "invoice" ? "invoiced" : charge.status,
        }));
        setCharges(normalizedCharges);
        setTotalItems(response.data.count || 0);
        console.log(response, "Response from fetchAdditionalCharges");
      } else {
        const errorMessage =
          response.data.results.message || "Failed to fetch additional charges";
        setError(errorMessage);
        toast.error(errorMessage);
        setCharges([]);
        setTotalItems(0);
      }
    } catch (err) {
      const errorMessage =
        "Error fetching additional charges: " +
        (err.response?.data?.results?.message || err.message);
      setError(errorMessage);
      toast.error(errorMessage);
      setCharges([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company/additional-charges/export-csv/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: {
            search: searchTerm,
            status: selectedOption === "all" ? "" : selectedOption,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "additional_charges.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded successfully");
    } catch (err) {
      const errorMessage =
        "Error downloading CSV: " +
        (err.response?.data?.message || err.message);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAdditionalCharges(currentPage, searchTerm, selectedOption);
  }, [currentPage, searchTerm, selectedOption, refreshCounter]);

  const handleDeleteClick = (charge) => {
    setItemToDelete(charge);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/company/additional-charges/${itemToDelete.id}/delete/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 204 || response.data.success) {
        toast.success("Charge deleted successfully");
        fetchAdditionalCharges(currentPage, searchTerm, selectedOption);
      }
    } catch (err) {
      const errorMessage =
        "Error deleting charge: " +
        (err.response?.data?.message || err.message);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleEditClick = (charge) => {
    openModal("update-additional-charges", "Update Additional Charges", charge);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const getStatusStyles = (status) => {
    if (status === "paid") {
      return "bg-[#28C76F29] text-[#28C76F]";
    } else if (status === "invoiced") {
      return "bg-[#E8EFF6] text-[#1458A2]";
    } else if (status === "partially_paid") {
      return "bg-[#FFF7E9] text-[#FBAD27]";
    } else {
      return "bg-[#FFE1E1] text-[#C72828]";
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (error)
    return (
      <div className="border border-[#E9E9E9] rounded-md p-5">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() =>
              fetchAdditionalCharges(currentPage, searchTerm, selectedOption)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="border border-[#E9E9E9] rounded-md admin-add-charges-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] admin-add-charges-table-header">
        <h1 className="admin-add-charges-head">Additional Charges</h1>
        <div className="flex flex-col md:flex-row gap-[10px] admin-add-charges-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md md:w-[302px] focus:border-gray-300 duration-200 admin-add-charges-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                placeholder="Select"
                dropdownClassName="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 admin-add-charges-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] admin-add-charges-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md admin-add-charges-btn duration-200 md:w-[169px]"
              onClick={() => openModal("create-additional-charges")}
            >
              Add Charges
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 admin-add-charges-download-btn w-[122px]"
              onClick={handleDownloadCSV}
            >
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] admin-add-charges-download-img"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="admin-add-charges-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left admin-add-charges-thead">ID</th>
              <th className="px-5 text-left admin-add-charges-thead">
                CHARGE ID
              </th>
              <th className="pl-5 text-left admin-add-charges-thead">
                AMOUNT DUE
              </th>
              <th className="px-5 text-left admin-add-charges-thead">REASON</th>
              <th className="px-5 text-left admin-add-charges-thead">
                IN DATE
              </th>
              <th className="px-5 text-left admin-add-charges-thead">
                DUE DATE
              </th>
              <th className="px-5 text-left admin-add-charges-thead w-[68px]">
                STATUS
              </th>
              <th className="px-5 pr-6 text-right admin-add-charges-thead">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => (
              <tr
                key={charge.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left admin-add-charges-data">
                  {charge.id}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charge.charge_type || "N/A"}
                </td>
                <td className="pl-5 text-left admin-add-charges-data">
                  {charge.amount
                    ? parseFloat(charge.amount).toFixed(2)
                    : "0.00"}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charge.reason || "N/A"}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charge.in_date
                    ? new Date(charge.in_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charge.due_date
                    ? new Date(charge.due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${getStatusStyles(
                      charge.status
                    )}`}
                  >
                    {charge.status.charAt(0).toUpperCase() +
                      charge.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleEditClick(charge)}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => handleDeleteClick(charge)}>
                    <img
                      src={deleteicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
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
            <tr className="admin-add-charges-table-row-head">
              <th className="px-5 w-[46%] text-left admin-add-charges-thead admin-add-charges-id-column">
                ID
              </th>
              <th className="px-[10px] w-[34%] text-left admin-add-charges-thead admin-add-charges-charge-id-column">
                CHARGE ID
              </th>
              <th className="px-5 text-right admin-add-charges-thead"></th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => (
              <React.Fragment key={charge.id}>
                <tr
                  className={`${
                    expandedRows[charge.id]
                      ? "admin-add-charges-mobile-no-border"
                      : "admin-add-charges-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left admin-add-charges-data admin-add-charges-id-column">
                    {charge.id}
                  </td>
                  <td className="px-[10px] text-left admin-add-charges-data admin-add-charges-charge-id-column">
                    {charge.charge_type || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`admin-add-charges-dropdown-field ${
                        expandedRows[charge.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(charge.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`admin-add-charges-dropdown-img ${
                          expandedRows[charge.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[charge.id] && (
                    <motion.tr
                      className="admin-add-charges-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="admin-add-charges-dropdown-content">
                          <div className="admin-add-charges-dropdown-grid">
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                AMOUNT DUE
                              </div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.amount
                                  ? parseFloat(charge.amount).toFixed(2)
                                  : "0.00"}
                              </div>
                            </div>
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                REASON
                              </div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.reason || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-grid">
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                IN DATE
                              </div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.in_date
                                  ? new Date(charge.in_date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "N/A"}
                              </div>
                            </div>
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                DUE DATE
                              </div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.due_date
                                  ? new Date(
                                      charge.due_date
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-grid">
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                STATUS
                              </div>
                              <div className="admin-add-charges-dropdown-value">
                                <span
                                  className={`admin-add-charges-status ${getStatusStyles(
                                    charge.status
                                  )}`}
                                >
                                  {charge.status.charAt(0).toUpperCase() +
                                    charge.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="admin-add-charges-dropdown-item w-[50%]">
                              <div className="admin-add-charges-dropdown-label">
                                ACTION
                              </div>
                              <div className="admin-add-charges-dropdown-value flex items-center gap-4 mt-[10px]">
                                <button onClick={() => handleEditClick(charge)}>
                                  <img
                                    src={editicon}
                                    alt="Edit"
                                    className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(charge)}
                                >
                                  <img
                                    src={deleteicon}
                                    alt="Delete"
                                    className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
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
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {startPage > 1 && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => handlePageChange(1)}
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
              onClick={() => handlePageChange(startPage + i)}
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
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        title="Delete Charge"
        message={`Are you sure you want to delete the charge with ID ${itemToDelete?.id}?`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AdminAdditionalCharges;
