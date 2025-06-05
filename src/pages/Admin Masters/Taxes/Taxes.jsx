import React, { useState, useEffect } from "react";
import "./Taxes.css";
import axios from "axios";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../utils/config";
import DeleteTaxModal from "./DeleteTaxModal/DeleteTaxModal";
import CustomDropDown from "../../../components/CustomDropDown";

const Taxes = () => {
  const { openModal, refreshCounter } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxIdToDelete, setTaxIdToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("active_only");
  const [effectiveDate, setEffectiveDate] = useState("");
  const itemsPerPage = 10;

  const viewModeOptions = [
    { value: "active_only", label: "Active Taxes" },
    { value: "history", label: "Full History" },
    { value: "effective_date", label: "Effective on Date" },
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

  useEffect(() => {
    const fetchTaxes = async () => {
      setLoading(true);
      setError(null);
      const companyId = getUserCompanyId();
      
      if (!companyId) {
        setError("Company ID is missing or invalid. Please log in again.");
        toast.error("Company ID is missing or invalid. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const params = {};
        if (viewMode === "history") {
          params.history = true;
        } else if (viewMode === "effective_date" && effectiveDate) {
          params.effective_date = effectiveDate;
        } else {
          params.active_only = true;
        }

        const response = await axios.get(`${BASE_URL}/company/taxes/${companyId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          params,
        });
        const taxes = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched taxes:", taxes);
        setData(taxes);
      } catch (err) {
        console.error("Error fetching taxes:", err);
        const errorMessage =
          err.response?.data?.detail || "Failed to load taxes";
        setError(errorMessage);
        toast.error(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxes();
  }, [refreshCounter, viewMode, effectiveDate]);

  const handleDelete = (id) => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    setTaxIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taxIdToDelete) return;

    try {
      setLoading(true);
      setError(null);
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }
      await axios.delete(`${BASE_URL}/company/taxes/${taxIdToDelete}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setData((prev) => prev.filter((item) => item.id !== taxIdToDelete));
      toast.success("Tax deleted successfully");
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error deleting tax:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to delete tax";
      setError(errorMessage);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setTaxIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaxIdToDelete(null);
  };

  const handleAddTax = async (newTax) => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      toast.error("Company ID is missing or invalid. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/taxes/${companyId}/`,
        newTax,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setData((prev) => [...prev, response.data]);
      toast.success("Tax added successfully");
    } catch (err) {
      console.error("Error adding tax:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to add tax";
      toast.error(errorMessage);
    }
  };

  const openUpdateModal = (tax) => {
    openModal("update-tax-master", "Update Tax Master", tax);
  };

  const filteredData = Array.isArray(data)
    ? data.filter(
        (tax) =>
          (tax.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax?.country_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.tax_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.tax_percentage
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            tax.applicable_from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.applicable_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax?.state_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tax.is_active ? "active" : "inactive").toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
    if (value !== "effective_date") {
      setEffectiveDate("");
    }
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md tax-table">
      <Toaster />
      <div className="flex flex-col gap-4 p-5 border-b border-[#E9E9E9] tax-table-header">
        <div className="flex justify-between items-center w-full">
          <h1 className="tax-head">Tax List</h1>
          <div className="flex gap-[10px] tax-action-buttons-container">
            <button
              className={`flex items-center justify-center gap-2 h-[38px] rounded-md tax-add-tax duration-200 w-[176px] ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2892CE] hover:bg-[#2276a7]"
              }`}
              onClick={() => openModal("create-tax-master", "Create New Tax Master")}
              disabled={loading}
            >
              Add New Tax
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button
              className={`flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 tax-download-btn w-[122px] ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6]"
              }`}
              disabled={loading}
            >
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] tax-download-img"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-[10px] w-full">
          <input
            type="text"
            placeholder="Search by ID, country, tax type, percentage, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full focus:border-gray-300 duration-200 tax-search"
            disabled={loading}
          />
          <div className="flex flex-col md:flex-row gap-[10px] w-full md:w-auto">
            <CustomDropDown
              options={viewModeOptions}
              value={viewMode}
              onChange={handleViewModeChange}
              placeholder="Active Taxes"
              className="w-full md:w-[200px]"
              dropdownClassName="tax-selection px-3 py-[7px] border-[#E9E9E9] h-[38px] focus:border-[#E9E9E9]"
              enableFilter={false}
            />
            {viewMode === "effective_date" && (
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[200px] focus:border-gray-300 duration-200 tax-date-picker"
                disabled={loading}
              />
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="p-5 text-center">Loading...</div>
      ) : error ? (
        <div className="p-5 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="tax-desktop-only">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-5 text-left tax-thead">ID</th>
                  <th className="px-5 text-left tax-thead">COUNTRY</th>
                  <th className="px-5 text-left tax-thead">STATE</th>
                  <th className="px-5 text-left tax-thead">TAX TYPE</th>
                  <th className="px-5 text-left tax-thead">PERCENTAGE</th>
                  <th className="px-5 text-left tax-thead">APPLICABLE FROM</th>
                  <th className="px-5 text-left tax-thead">APPLICABLE TO</th>
                  <th className="px-5 text-left tax-thead">STATUS</th>
                  <th className="px-5 pr-6 text-right tax-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No taxes found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((tax) => (
                    <tr
                      key={tax.id}
                      className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-5 text-left tax-data">{tax.id}</td>
                      <td className="px-5 text-left tax-data">
                        {tax?.country_name || "N/A"}
                      </td>
                      <td className="px-5 text-left tax-data">
                        {tax?.state_name || "N/A"}
                      </td>
                      <td className="px-5 text-left tax-data">{tax.tax_type}</td>
                      <td className="px-5 text-left tax-data">{`${tax.tax_percentage}%`}</td>
                      <td className="px-5 text-left tax-data">
                        {tax.applicable_from || "N/A"}
                      </td>
                      <td className="px-5 text-left tax-data">
                        {tax.applicable_to || "Ongoing"}
                      </td>
                      <td className="px-5 text-left tax-data">
                        {tax.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                        <button onClick={() => openUpdateModal(tax)}>
                          <img
                            src={editicon}
                            alt="Edit"
                            className="w-[18px] h-[18px] tax-action-btn duration-200"
                          />
                        </button>
                        <button onClick={() => handleDelete(tax.id)}>
                          <img
                            src={deleteicon}
                            alt="Delete"
                            className="w-[18px] h-[18px] tax-action-btn duration-200"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="block md:hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="tax-table-row-head">
                  <th className="px-5 w-[50%] text-left tax-thead tax-id-column">
                    COUNTRY
                  </th>
                  <th className="px-5 w-[50%] text-left tax-thead tax-country-column">
                    TAX TYPE
                  </th>
                  <th className="px-5 text-right tax-thead"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No taxes found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((tax) => (
                    <React.Fragment key={tax.id}>
                      <tr
                        className={`${
                          expandedRows[tax.id]
                            ? "tax-mobile-no-border"
                            : "tax-mobile-with-border"
                        } border-b border-[#E9E9E9] h-[57px]`}
                      >
                        <td className="px-5 text-left tax-data tax-id-column">
                          {tax?.country_name || "N/A"}
                        </td>
                        <td className="px-5 text-left tax-data tax-country-column">
                          {tax.tax_type}
                        </td>
                        <td className="py-4 flex items-center justify-end h-[57px]">
                          <div
                            className={`tax-dropdown-field ${
                              expandedRows[tax.id] ? "active" : ""
                            }`}
                            onClick={() => toggleRowExpand(tax.id)}
                          >
                            <img
                              src={downarrow}
                              alt="drop-down-arrow"
                              className={`tax-dropdown-img ${
                                expandedRows[tax.id] ? "text-white" : ""
                              }`}
                            />
                          </div>
                        </td>
                      </tr>
                      {expandedRows[tax.id] && (
                        <tr className="tax-mobile-with-border border-b border-[#E9E9E9]">
                          <td colSpan={3} className="px-5">
                            <div className="tax-dropdown-content">
                              <div className="tax-dropdown-content-grid">
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    TAX ID
                                  </div>
                                  <div className="tax-dropdown-value">
                                    {tax.id}
                                  </div>
                                </div>
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    STATE
                                  </div>
                                  <div className="tax-dropdown-value">
                                    {tax?.state_name || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="tax-dropdown-content-grid">
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    PERCENTAGE
                                  </div>
                                  <div className="tax-dropdown-value">{`${tax.tax_percentage}%`}</div>
                                </div>
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    APPLICABLE FROM
                                  </div>
                                  <div className="tax-dropdown-value">
                                    {tax.applicable_from || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="tax-dropdown-content-grid">
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    APPLICABLE TO
                                  </div>
                                  <div className="tax-dropdown-value">
                                    {tax.applicable_to || "Ongoing"}
                                  </div>
                                </div>
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    STATUS
                                  </div>
                                  <div className="tax-dropdown-value">
                                    {tax.is_active ? "Active" : "Inactive"}
                                  </div>
                                </div>
                              </div>
                              <div className="tax-dropdown-content-grid">
                                <div className="tax-dropdown-content-item w-[50%]">
                                  <div className="tax-dropdown-label">
                                    ACTION
                                  </div>
                                  <div className="tax-dropdown-value flex items-center gap-4">
                                    <button
                                      onClick={() => openUpdateModal(tax)}
                                    >
                                      <img
                                        src={editicon}
                                        alt="Edit"
                                        className="w-[18px] h-[18px] tax-action-btn duration-200"
                                      />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(tax.id)}
                                    >
                                      <img
                                        src={deleteicon}
                                        alt="Delete"
                                        className="w-[18px] h-[18px] tax-action-btn duration-200"
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
      <DeleteTaxModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Taxes;