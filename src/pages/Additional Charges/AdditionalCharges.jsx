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

const AdminAdditionalCharges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const [selectedOption, setSelectedOption] = useState("showing");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const dropdownOptions = [
    { label: "Showing", value: "showing" },
    { label: "All", value: "all" },
  ];

  const fetchAdditionalCharges = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/company/additional-charges/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { search_term: searchTerm },
      });
      if (response.data.success) {
        setCharges(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch additional charges");
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching additional charges: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdditionalCharges();
  }, [searchTerm]);

  const handleDeleteClick = (charge) => {
    setItemToDelete(charge);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await axios.delete(`${BASE_URL}/company/additional-charges/${itemToDelete.id}/delete/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 204 || response.data.success) {
        setCharges(charges.filter((charge) => charge.id !== itemToDelete.id));
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError("Error deleting charge: " + err.message);
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

  const filteredData = selectedOption === "all" ? charges : charges;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md admin-add-charges-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] admin-add-charges-table-header">
        <h1 className="admin-add-charges-head">Additional Charges</h1>
        <div className="flex flex-col md:flex-row gap-[10px] admin-add-charges-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 admin-add-charges-download-btn w-[122px]">
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
              <th className="px-5 text-left admin-add-charges-thead">CHARGE ID</th>
              <th className="pl-5 text-left admin-add-charges-thead">DATE</th>
              <th className="pl-5 text-left admin-add-charges-thead">AMOUNT DUE</th>
              <th className="px-5 text-left admin-add-charges-thead">REASON</th>
              <th className="px-5 text-left admin-add-charges-thead">DUE DATE</th>
              <th className="px-5 text-left admin-add-charges-thead w-[68px]">STATUS</th>
              <th className="px-5 pr-6 text-right admin-add-charges-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((charge, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left admin-add-charges-data">{charge.id}</td>
                <td className="px-5 text-left admin-add-charges-data">{charge.charge_type?.name || "N/A"}</td>
                <td className="pl-5 text-left admin-add-charges-data">
                  {charge.created_at
                    ? new Date(charge.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="pl-5 text-left admin-add-charges-data">{charge.amount ? parseFloat(charge.amount).toFixed(2) : "0.00"}</td>
                <td className="px-5 text-left admin-add-charges-data">{charge.reason || "N/A"}</td>
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
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                      charge.status === "paid"
                        ? "bg-[#28C76F29] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
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
              <th className="px-5 w-[35%] text-left admin-add-charges-thead admin-add-charges-id-column">ID</th>
              <th className="px-[10px] w-[30%] text-left admin-add-charges-thead admin-add-charges-charge-id-column">CHARGE ID</th>
              <th className="px-[10px] w-[20%] text-left admin-add-charges-thead admin-add-charges-date-column">DATE</th>
              <th className="px-5 w-[15%] text-right admin-add-charges-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((charge, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[charge.id + index]
                      ? "admin-add-charges-mobile-no-border"
                      : "admin-add-charges-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left admin-add-charges-data admin-add-charges-id-column">{charge.id}</td>
                  <td className="px-[10px] text-left admin-add-charges-data admin-add-charges-charge-id-column">{charge.charge_type?.name || "N/A"}</td>
                  <td className="px-[10px] text-left admin-add-charges-data admin-add-charges-date-column">
                    {charge.created_at
                      ? new Date(charge.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`admin-add-charges-dropdown-field ${
                        expandedRows[charge.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(charge.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`admin-add-charges-dropdown-img ${
                          expandedRows[charge.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[charge.id + index] && (
                    <motion.tr
                      className="admin-add-charges-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={4} className="px-5">
                        <div className="admin-add-charges-dropdown-content">
                          <div className="admin-add-charges-dropdown-grid">
                            <div className="admin-add-charges-dropdown-item w-[30%]">
                              <div className="admin-add-charges-dropdown-label">AMOUNT DUE</div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.amount ? parseFloat(charge.amount).toFixed(2) : "0.00"}
                              </div>
                            </div>
                            <div className="admin-add-charges-dropdown-item label-reason w-[30%]">
                              <div className="admin-add-charges-dropdown-label">REASON</div>
                              <div className="admin-add-charges-dropdown-value">{charge.reason || "N/A"}</div>
                            </div>
                            <div className="admin-add-charges-dropdown-item label-due w-[35%]">
                              <div className="admin-add-charges-dropdown-label">DUE DATE</div>
                              <div className="admin-add-charges-dropdown-value">
                                {charge.due_date
                                  ? new Date(charge.due_date).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-grid">
                            <div className="admin-add-charges-dropdown-item w-[30%]">
                              <div className="admin-add-charges-dropdown-label">STATUS</div>
                              <div className="admin-add-charges-dropdown-value">
                                <span
                                  className={`admin-add-charges-status ${
                                    charge.status === "paid"
                                      ? "bg-[#28C76F29] text-[#28C76F]"
                                      : "bg-[#FFE1E1] text-[#C72828]"
                                  }`}
                                >
                                  {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="admin-add-charges-dropdown-item w-[67%] label-action">
                              <div className="admin-add-charges-dropdown-label">ACTION</div>
                              <div className="admin-add-charges-dropdown-value flex items-center gap-4 mt-[10px]">
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
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
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