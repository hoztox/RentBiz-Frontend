import React, { useState, useEffect } from "react";
import "./UnitType.css";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import unitimg from "../../../assets/Images/Admin Masters/units-img.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { unitTypesApi } from "../MastersApi";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const UnitType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [apartmentCount, setApartmentCount] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [unitTypes, setUnitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 10;
  const [unitTypeIdToDelete, setUnitTypeIdToDelete] = useState(null);
  

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
   
   
  ];

  const [selectedOption, setSelectedOption] = useState("showing");

  // Fetch unit types from backend
 const fetchData = async () => {
  try {
    setError(null);

    const filters = {
      search: searchTerm,
      page: currentPage,
      page_size: itemsPerPage,
    };

    if (["shop", "apartment"].includes(selectedOption)) {
    filters.title_filter = selectedOption;
   }

    const response = await unitTypesApi.fetch(filters);
    const results = response.results || [];
    console.log("RESULT SAMPLE:", results[0]);

    setUnitTypes(results);
    setTotalCount(response.count || 0);
    // 👉 Count apartments & shops on the current page
   const apartmentOnPage = results.filter(
   item => item.title?.toLowerCase() === "apartment"
   ).length;

  const shopOnPage = results.filter(
  item => item.title?.toLowerCase() === "shop"
  ).length;

    // 👉 Reset counters on page 1, accumulate on next pages
    if (currentPage === 1) {
      setApartmentCount(apartmentOnPage);
      setShopCount(shopOnPage);
    } else {
      setApartmentCount(prev => prev + apartmentOnPage);
      setShopCount(prev => prev + shopOnPage);
    }

  } catch (err) {
    const isPageResetCase = currentPage > totalPages && totalPages > 0;

    if (err?.message?.toLowerCase()?.includes("invalid page")) {
      setCurrentPage(1);
      return;
    }

    console.error("Error fetching unit types:", err);
    const errorMessage = err.message || "Failed to fetch unit types. Please try again.";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // Handle delete confirmation
  const handleDelete = (id) => {
    setUnitTypeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!unitTypeIdToDelete) return;

    try {
      await unitTypesApi.delete(unitTypeIdToDelete); // Updated API call
      setUnitTypes((prev) => prev.filter((u) => u.id !== unitTypeIdToDelete));
      toast.success("Unit Type deleted successfully.");
    } catch (error) {
      console.error("Error deleting unit type:", error);
      const errorMessage =
        error.message || "Failed to delete unit type. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setUnitTypeIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUnitTypeIdToDelete(null);
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

  // Get unit type statistics
  const getUnitTypeStats = () => {
    const stats = unitTypes.reduce(
      (acc, unit) => {
        const unitName = unit.title?.toLowerCase();
        if (unitName?.includes("apartment")) {
          acc.apartments += 1;
        } else if (unitName?.includes("shop")) {
          acc.shops += 1;
        }
        acc.total += 1;
        return acc;
      },
      { total: 0, apartments: 0, shops: 0 }
    );

    return stats;
  };

  // Filter data based on search term
  
  

const totalPages = Math.ceil(totalCount / itemsPerPage);
const paginatedData = unitTypes;

const maxPageButtons = 5;
const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

const stats = getUnitTypeStats();

useEffect(() => {
  setApartmentCount(0);
  setShopCount(0);
  setCurrentPage(1); // Reset to page 1 when filters change
}, [searchTerm, selectedOption]);

useEffect(() => {
  fetchData();
}, [refreshCounter, searchTerm, selectedOption, currentPage, itemsPerPage]);

  const handleEditClick = (unit) => {
    openModal("update-unit-type-master", "Update Unit Type Master", unit);
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
      <div className="border border-gray-200 rounded-md unit-table">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading unit types...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-gray-200 rounded-md unit-table">
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
    <div className="border border-gray-200 rounded-md unit-table">
      <Toaster />
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] unit-table-header">
        <h1 className="unit-head">Unit Type Masters</h1>
        <div className="flex flex-col md:flex-row gap-[10px] unit-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 unit-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 unit-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] utype-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md utype-add-new-master duration-200"
              onClick={() => openModal("create-unit-type-master")}
            >
              Add New Master
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 utype-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] utype-download-img"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="utype-desktop-only">
        <div className="flex gap-4 p-5">
          <div className="w-[60%] border border-gray-200 rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-4 py-3 text-left unit-thead">ID</th>
                  <th className="px-4 py-3 text-left unit-thead">ENTRY DATE</th>
                  <th className="px-4 py-3 text-left unit-thead">NAME</th>
                  <th className="px-4 py-3 text-right unit-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {unitTypes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No unit types found
                    </td>
                  </tr>
                ) : (
                  unitTypes.map((unit, index) => {
                    const isLastItemOnPage = index === unitTypes.length - 1;
                    const shouldRemoveBorder =
                      isLastItemOnPage && unitTypes.length === itemsPerPage;

                    return (
                      <tr
                        key={unit.id}
                        className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                          shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                        }`}
                      >
                        <td className="px-5 text-left unit-data">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-5 text-left unit-data">
                          {formatDate(unit.created_at)}
                        </td>
                        <td className="pl-5 text-left unit-data w-[22%]">
                          {unit.title || "N/A"}
                        </td>
                        <td className="px-5 utype-flex-gap-23 h-[57px]">
                          <button onClick={() => handleEditClick(unit)}>
                            <img
                              src={editicon}
                              alt="Edit"
                              className="w-[18px] h-[18px] utype-action-btn duration-200"
                            />
                          </button>
                          <button onClick={() => handleDelete(unit.id)}>
                            <img
                              src={deleteicon}
                              alt="Delete"
                              className="w-[18px] h-[18px] utype-delete-btn duration-200"
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
          <div className="w-[40%] border border-[#E9E9E9] rounded-md p-5">
            <div className="bg-[#F0F8FF] p-6 rounded-md flex flex-col items-center justify-center">
              <div className="mb-6">
                <img src={unitimg} alt="" className="mb-4" />
              </div>
              <div className="text-center">
                <p className="text-[#201D1E] unit-card-text">Total Units</p>
                <p className="text-[#1458A2] unit-card-num">{totalCount}</p>
              </div>
            </div>
            <div className="bg-[#F0F8FF] p-5 mt-4 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <p className="text-[#201D1E] unit-card-text">
                    Total Apartment
                  </p>
                  <p className="text-[#1458A2] apartment-card-num mt-2">
                    {apartmentCount}
                  </p>
                </div>
                <div className="w-1/3">
                  <div className="bg-[#F0F8FF] border border-gray-300 p-4 rounded-md">
                    <p className="text-[#201D1E] unit-card-text-2">Occupied</p>
                    <p className="text-[#64A2E7] unit-card-num-2 mt-2">-</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="bg-[#F0F8FF] border border-gray-300 p-3 rounded-md">
                    <p className="text-[#201D1E] unit-card-text-2">Vacant</p>
                    <p className="text-[#68C68D] unit-card-num-2 mt-2">-</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F0F8FF] p-5 mt-4 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <p className="text-[#201D1E] unit-card-text">Total Shop</p>
                  <p className="text-[#1458A2] shop-card-num mt-2">
                    {shopCount}
                  </p>
                </div>
                <div className="w-1/3">
                  <div className="bg-[#F0F8FF] border border-gray-300 rounded-md p-4">
                    <p className="text-[#201D1E] unit-card-text-2">Occupied</p>
                    <p className="text-[#64A2E7] unit-card-num-2 mt-2">-</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="bg-[#F0F8FF] border border-gray-300 p-3 rounded-md">
                    <p className="text-[#201D1E] unit-card-text-2">Vacant</p>
                    <p className="text-[#68C68D] unit-card-num-2 mt-2">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Table */}
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="unit-table-row-head">
              <th className="px-5 w-[52%] text-left unit-thead utype-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left unit-thead utype-entry-date-column">
                NAME
              </th>
              <th className="px-5 text-right unit-thead"></th>
            </tr>
          </thead>
          <tbody>
            {unitTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                  No unit types found
                </td>
              </tr>
            ) : (
              unitTypes.map((unit, index) => (
                <React.Fragment key={unit.id}>
                  <tr
                    className={`${
                      expandedRows[unit.id]
                        ? "utype-mobile-no-border"
                        : "utype-mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left unit-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-5 text-left unit-data utype-entry-date-column">
                      {unit.title || "N/A"}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`unit-dropdown-field ${
                          expandedRows[unit.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(unit.id)}
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`unit-dropdown-img ${
                            expandedRows[unit.id] ? "text-white" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[unit.id] && (
                      <motion.tr
                        className="utype-mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="px-5">
                          <div className="unit-dropdown-content">
                            <div className="utype-grid">
                              <div className="utype-grid-items">
                                <div className="utype-dropdown-label">
                                  ENTRY DATE
                                </div>
                                <div className="utype-dropdown-value">
                                  {formatDate(unit.created_at)}
                                </div>
                              </div>
                              <div className="utype-grid-items">
                                <div className="utype-dropdown-label">
                                  ACTION
                                </div>
                                <div className="utype-dropdown-value utype-flex-items-center-gap-2 p-1 ml-[5px]">
                                  <button onClick={() => handleEditClick(unit)}>
                                    <img
                                      src={editicon}
                                      alt="Edit"
                                      className="w-[18px] h-[18px] utype-action-btn duration-200"
                                    />
                                  </button>
                                  <button onClick={() => handleDelete(unit.id)}>
                                    <img
                                      src={deleteicon}
                                      alt="Delete"
                                      className="w-[18px] h-[18px] ml-[5px] utype-delete-btn duration-200"
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
      {totalCount > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 utype-pagination-container">
          <span className="utype-collection-list-pagination">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              totalCount
            )}{" "}
            to {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
            {totalCount} entries
          </span>
          <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto utype-pagination-buttons">
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
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        title="Delete Unit Type"
        message="Are you sure you want to delete this unit type?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default UnitType;
