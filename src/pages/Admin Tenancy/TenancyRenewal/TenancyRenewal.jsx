import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenancyRenewal.css";
import { ChevronDown } from "lucide-react";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";
import { BASE_URL } from "../../../utils/config";
import { useModal } from "../../../context/ModalContext";
import TenancyRenewalModal from "./TenancyRenewalModal/TenancyRenewalModal";


const TenancyRenewal = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal } = useModal();
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

  // Fetch tenancy data using Axios

  const fetchTenancies = async () => {
    try {
      const companyId = getUserCompanyId();
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/company/tenancies/company/${companyId}/`);
      setTenancies(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tenancy data:", err);
      setError("Failed to fetch tenancy data");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTenancies();
  }, []);

  const handleDelete = async (tenancyId) => {
    if (window.confirm("Are you sure you want to delete this tenancy?")) {
      try {
        await axios.delete(`${BASE_URL}/company/tenancies/${tenancyId}/`);
        // Refetch tenancies after deletion
        await fetchTenancies();
        console.log(`Deleted tenancy with ID: ${tenancyId}`);
      } catch (error) {
        console.error("Error deleting tenancy:", error);
        alert("Failed to delete tenancy. Please try again.");
      }
    }
  };

  // Filter tenancies based on search term
  const filteredData = tenancies.filter(
    (tenancy) =>
      (tenancy.tenancy_code?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (tenancy.tenant?.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (tenancy.building?.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (tenancy.unit?.unit_name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (tenancy.status?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (tenancy.end_date?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );

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

  // Function to handle opening the renewal modal
  const handleRenewClick = (tenancyId) => {
    openModal("tenancy-renew", { tenancyId });
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Renewal</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 trenew-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto trenew-second-row-container">
            <div className="relative flex-1 md:flex-none w-[60%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none h-[38px] px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenancy-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${isSelectOpen ? "rotate-180" : "rotate-0"}`}
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 trenew-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] trenew-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="trenew-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenancy-thead">Tenancy Code</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">Tenant</th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">Building Name</th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">Unit Name</th>
              <th className="px-5 text-left tenancy-thead">Rental Months</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">End Date</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">Status</th>
              <th className="px-5 text-center tenancy-thead w-[10%]">Renew</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[10%]">View</th>
              <th className="px-5 pr-6 text-right tenancy-thead">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <tr
                key={tenancy.tenancy_code}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenancy-data">{tenancy.tenancy_code}</td>
                <td className="px-5 text-left tenancy-data">{tenancy.tenant?.tenant_name}</td>
                <td className="pl-5 text-left tenancy-data">{tenancy.building?.building_name}</td>
                <td className="pl-5 text-left tenancy-data">{tenancy.unit?.unit_name}</td>
                <td className="px-5 tenancy-data">
                  <div className="w-[63%] flex justify-center">{tenancy.rental_months}</div>
                </td>
                <td className="pl-5 text-left tenancy-data">{tenancy.end_date}</td>
                <td className="px-5 text-left tenancy-data">{tenancy.status}</td>
                <td className="px-5 text-center !text-[#1458a2] tenancy-data">
                  <button
                    onClick={() => handleRenewClick(tenancy.id)}
                    className="trenew-renew-btn"
                  >
                    Click to Renew
                  </button>
                </td>
                <td className="pl-14 text-center pr-5 pt-2">
                  <button onClick={() => openModal("tenancy-view", tenancy)}>
                    <img
                      src={viewicon}
                      alt="View"
                      className="w-[30px] h-[24px] trenew-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="pr-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => openModal("tenancy-update")}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] trenew-action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => handleDelete(tenancy.id)}>
                    <img
                      src={deletesicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] trenew-delete-btn duration-200"
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
            <tr className="tenancy-table-row-head">
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-id-column">Tenancy Code</th>
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-end-date-column">Tenant</th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <React.Fragment key={tenancy.tenancy_code}>
                <tr
                  className={`${expandedRows[tenancy.tenancy_code]
                    ? "trenew-mobile-no-border"
                    : "trenew-mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data trenew-id-column">{tenancy.tenancy_code}</td>
                  <td className="px-3 text-left tenancy-data trenew-end-date-column">{tenancy.tenant?.tenant_name}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-dropdown-field ${expandedRows[tenancy.tenancy_code] ? "active" : ""}`}
                      onClick={() => toggleRowExpand(tenancy.tenancy_code)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenancy-dropdown-img ${expandedRows[tenancy.tenancy_code] ? "text-white" : ""}`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[tenancy.tenancy_code] && (
                  <tr className="trenew-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-dropdown-content">
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">BUILDING NAME</div>
                            <div className="trenew-dropdown-value">{tenancy.building?.building_name}</div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">UNIT NAME</div>
                            <div className="trenew-dropdown-value">{tenancy.unit?.unit_name}</div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">RENTAL MONTHS</div>
                            <div className="trenew-dropdown-value">{tenancy.rental_months}</div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">END DATE</div>
                            <div className="trenew-dropdown-value">{tenancy.end_date}</div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">STATUS</div>
                            <div className="trenew-dropdown-value">{tenancy.status}</div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">DEPOSIT</div>
                            <div className="trenew-dropdown-value">{tenancy.deposit || "N/A"}</div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">COMMISION</div>
                            <div className="trenew-dropdown-value">{tenancy.commision || "N/A"}</div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">REMARKS</div>
                            <div className="trenew-dropdown-value">{tenancy.remarks || "N/A"}</div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-full">
                            <div className="trenew-dropdown-label">ADDITIONAL CHARGES</div>
                            <div className="trenew-dropdown-value">
                              {tenancy.additional_charges?.length > 0 ? (
                                <ul>
                                  {tenancy.additional_charges.map((charge, index) => (
                                    <li key={index}>
                                      {charge.reason}: {charge.amount} (Due: {charge.due_date})
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "None"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">RENEW</div>
                            <div className="trenew-dropdown-value !text-[#1458a2]">
                              <button
                                onClick={() => handleRenewClick(tenancy.id)}
                                className="trenew-renew-btn"
                              >
                                Click to Renew
                              </button>
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[26%]">
                            <div className="trenew-dropdown-label">VIEW</div>
                            <div className="trenew-dropdown-value">
                              <button onClick={() => openModal("tenancy-view", tenancy)}>
                                <img
                                  src={viewicon}
                                  alt="View"
                                  className="w-[30px] h-[24px] trenew-action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[20%]">
                            <div className="trenew-dropdown-label">ACTION</div>
                            <div className="trenew-dropdown-value trenew-flex trenew-items-center mt-[10px] ml-[7px]">
                              <button onClick={() => openModal("tenancy-update")}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] trenew-action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deletesicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] trenew-delete-btn duration-200 ml-3"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 trenew-pagination-container">
        <span className="trenew-pagination collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto trenew-pagination-buttons">
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
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${currentPage === startPage + i
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
      <TenancyRenewalModal />
    </div>
  );
};

export default TenancyRenewal;