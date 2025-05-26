import React, { useState, useEffect } from "react";
import "./Charges.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import plusiconblue from "../../../assets/Images/Admin Masters/plus-icon-blue.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import closeicon from "../../../assets/Images/Admin Masters/close-icon.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";
import DeleteChargesModal from "./DeleteChargesModal/DeleteChargesModal";

const Charges = () => {
  const [isHeaderSelectOpen, setIsHeaderSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chargeIdToDelete, setChargeIdToDelete] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const itemsPerPage = 10;

  // Function to get company ID based on user role
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

  // Fetch charges data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID is missing or invalid");
        }

        // Fetch charges
        const chargesResponse = await axios.get(
          `${BASE_URL}/company/charges/company/${companyId}/`,
          { headers: { "Content-Type": "application/json" } }
        );
        setData(chargesResponse.data);
      } catch (err) {
        console.error(
          "Error fetching charges:",
          err.response?.data || err.message
        );
        const errorMessage =
          err.response?.data?.detail ||
          err.message ||
          "Failed to load charges";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshCounter]);

  // Handle delete initiation
  const handleDelete = (id) => {
    if (!getUserCompanyId()) {
      setError("Company ID not found. Please log in again.");
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    setChargeIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!chargeIdToDelete) return;

    try {
      setLoading(true);
      setError(null);
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }
      const response = await axios.delete(
        `${BASE_URL}/company/charges/${chargeIdToDelete}/`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete charge");
      }
      setData((prev) => prev.filter((item) => item.id !== chargeIdToDelete));
      toast.success("Charge deleted successfully");
    } catch (err) {
      console.error(
        "Error deleting charge:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete charge";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setChargeIdToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setChargeIdToDelete(null);
  };

  const filteredData = data.filter(
    (charge) =>
      charge.created_at
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      charge.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.charge_code?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openUpdateModal = (charge) => {
    openModal("update-charges-master", charge);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  return (
    <div className="border border-gray-200 rounded-md charges-table">
      <Toaster />
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] charges-table-header">
        <h1 className="charges-head">Charges Master</h1>
        <div className="flex flex-col md:flex-row gap-[10px] charges-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 charges-search"
              disabled={loading}
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 charges-selection"
                onFocus={() => setIsHeaderSelectOpen(true)}
                onBlur={() => setIsHeaderSelectOpen(false)}
                disabled={loading}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isHeaderSelectOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className={`flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md charges-add-new-master duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2892CE] hover:bg-[#2276a7]"
              }`}
              onClick={() => openModal("create-charges-master")}
              disabled={loading}
            >
              Add New Master
              <img
                src={plusicon}
                alt="plus icon"
                className="w-[15px] h-[15px]"
              />
            </button>
            <button
              className={`flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 charges-download-btn ${
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
                      <th className="px-4 py-3 text-left charges-thead">ID</th>
                      <th className="px-4 py-3 text-left charges-thead">DATE</th>
                      <th className="px-4 py-3 text-left charges-thead">NAME</th>
                      <th className="px-4 py-3 text-left charges-thead">
                        CHARGE TYPE
                      </th>
                      <th className="px-4 py-3 text-right charges-thead">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((charge, index) => {
                      const isLastItemOnPage = index === paginatedData.length - 1;
                      const shouldRemoveBorder =
                        isLastItemOnPage && paginatedData.length === itemsPerPage;

                      return (
                        <tr
                          key={charge.id}
                          className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                            shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                          }`}
                        >
                          <td className="px-5 text-left charges-data">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-5 text-left charges-data">
                            {formatDate(charge.created_at)}
                          </td>
                          <td className="pl-5 text-left charges-data">
                            {charge.name}
                          </td>
                          <td className="pl-5 text-left charges-data w-[15%]">
                            {charge.charge_code?.title || "N/A"}
                          </td>
                          <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                            <button onClick={() => openUpdateModal(charge)}>
                              <img
                                src={editicon}
                                alt="Edit"
                                className="w-[18px] h-[18px] action-btn duration-200"
                              />
                            </button>
                            <button onClick={() => handleDelete(charge.id)}>
                              <img
                                src={deleteicon}
                                alt="Delete"
                                className="w-[18px] h-[18px] action-btn duration-200"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Form Section */}
              <div className="w-[40%] border border-[#E9E9E9] rounded-md p-5">
                {/* Taxes Form */}
                <div className="w-full">
                  <h2 className="mb-[20px] tax-section-head">Taxes</h2>

                  {/* Tax List */}
                  <div className="border rounded-md mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-4 py-3 text-left tax-section-thead">
                            TAX 
                          </th>
                          <th className="px-4 py-3 text-left tax-section-thead">
                             NAME
                          </th>
                          <th className="px-4 py-3 text-left tax-section-thead">
                            CHARGE TYPE
                          </th>
                          <th className="px-4 py-3 text-left tax-section-thead">
                            PERCENTAGE
                          </th>
                          <th className="px-4 py-3 text-right tax-section-thead">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Static placeholder row */}
                        <tr className="h-[57px] hover:bg-gray-50 cursor-pointer">
                          <td className="px-5 text-left tax-section-tdata">
                            Vat
                          </td>
                          <td className="px-5 text-left tax-section-tdata">
                            Maintenance
                          </td>
                          <td className="px-5 text-left tax-section-tdata">
                            Deposit
                          </td>
                          <td className="pl-5 text-left tax-section-tdata w-[18%]">
                            20%
                          </td>
                          <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                            <button disabled>
                              <img
                                src={editicon}
                                alt="Edit"
                                className="w-[18px] h-[18px] action-btn duration-200"
                              />
                            </button>
                            <button disabled>
                              <img
                                src={deleteicon}
                                alt="Delete"
                                className="w-[18px] h-[18px] action-btn duration-200"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Add New Tax Form */}
                  <form>
                    <div className="border rounded-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[#201D1E] tax-form-head">
                          Add New Tax
                        </h3>
                        <button
                          type="button"
                          className="tax-form-close-btn"
                          disabled
                        >
                          <img
                            src={closeicon}
                            alt="close"
                            className="w-[10px] h-[10px]"
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                            Tax Type
                          </label>
                          <input
                            type="text"
                            name="tax_type"
                            placeholder="Enter Tax Type"
                            className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-400"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                            Name
                          </label>
                          <div className="relative">
                            <select
                              name="name"
                              className="w-full px-3 py-2 border rounded-md appearance-none outline-none focus:border-gray-400"
                              disabled
                            >
                              <option value="">Choose</option>
                            </select>
                            <ChevronDown
                              className="absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-[70%_20%] gap-[20px] mb-6">
                        <div>
                          <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                            Charge Code
                          </label>
                          <div className="relative">
                            <select
                              name="charge_code"
                              className="w-full px-3 py-2 border rounded-md appearance-none outline-none focus:border-gray-400 charge-code-select"
                              disabled
                            >
                              <option value="">Choose</option>
                            </select>
                            <ChevronDown
                              className="absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <div className="w-[110px]">
                          <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                            Percentage (%)
                          </label>
                          <input
                            type="text"
                            name="percentage"
                            placeholder="20%"
                            className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-400 percentage-input"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="flex flex-col gap-4 ml-[25px]">
                          <div className="flex items-center">
                            <span className="mr-3 text-[#201D1E] tax-toggle-caption">
                              Enable to Refundable
                            </span>
                            <div className="tax-toggle-switch">
                              <div className="tax-toggle-circle"></div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-[#2892CE] py-2 hover:bg-[#076094] transition-colors tax-form-save-btn ml-[25px] mb-2 cursor-not-allowed opacity-50"
                            disabled
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Add Tax Button */}
                  <button
                    className="ml-auto mt-[32px] hover:bg-blue-50 transition-colors flex items-center justify-center tax-form-add-btn"
                    disabled
                  >
                    Add Tax
                    <img src={plusiconblue} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Table */}
          <div className="block md:hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="charges-table-row-head">
                  <th className="px-5 w-[52%] text-left charges-thead charges-id-column">
                    ID
                  </th>
                  <th className="px-5 w-[47%] text-left charges-thead charges-date-column">
                    NAME
                  </th>
                  <th className="px-5 text-right charges-thead"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((charge, index) => (
                  <React.Fragment key={charge.id}>
                    <tr
                      className={`${
                        expandedRows[charge.id]
                          ? "mobile-no-border"
                          : "mobile-with-border"
                      } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 text-left charges-data">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-5 text-left charges-data charges-date-column">
                        {charge.name}
                        
                      </td>
                      <td className="py-4 flex items-center justify-end h-[57px]">
                        <div
                          className={`charges-dropdown-field ${
                            expandedRows[charge.id] ? "active" : ""
                          }`}
                          onClick={() => toggleRowExpand(charge.id)}
                        >
                          <img
                            src={downarrow}
                            alt="drop-down-arrow"
                            className={`charges-dropdown-img ${
                              expandedRows[charge.id] ? "text-white" : ""
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                    {expandedRows[charge.id] && (
                      <tr className="mobile-with-border border-b border-[#E9E9E9]">
                        <td colSpan={3} className="px-5">
                          <div className="charges-dropdown-content">
                            <div className="charges-grid">
                              <div className="charges-grid-items">
                                <div className="dropdown-label">DATE</div>
                                <div className="dropdown-value">{formatDate(charge.created_at)}</div>
                              </div>
                              <div className="charges-grid-items">
                                <div className="dropdown-label">CHARGE TYPE</div>
                                <div className="dropdown-value">
                                  {charge.charge_code?.title || "N/A"}
                                </div>
                              </div>
                              <div className="charges-grid-items">
                                <div className="dropdown-label">VAT PERCENTAGE</div>
                                <div className="dropdown-value">
                                  {charge.vat_percentage ? `${charge.vat_percentage}%` : "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="charges-grid">
                              <div className="charges-grid-items">
                                <div className="dropdown-label">ACTION</div>
                                <div className="dropdown-value flex items-center gap-4 p-1">
                                  <button onClick={() => openUpdateModal(charge)}>
                                    <img
                                      src={editicon}
                                      alt="Edit"
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                  <button onClick={() => handleDelete(charge.id)}>
                                    <img
                                      src={deleteicon}
                                      alt="Delete"
                                      className="w-[18px] h-[18px] action-btn duration-200"
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </>
      )}
      <DeleteChargesModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Charges;