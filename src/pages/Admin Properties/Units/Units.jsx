import React, { useState, useEffect } from "react";
import axios from "axios";
import "./units.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Units/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Units/download-icon.svg";
import editicon from "../../../assets/Images/Admin Units/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Units/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Units/downarrow.svg";
import AddUnitModal from "./Add Unit Modal/AddUnitModal";
import EditUnitModal from "./Edit Unit Modal/EditUnitModal";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/config";

const Units = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [updateUnitModalOpen, setUpdateUnitModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Function to check if the screen width is below 480px
  const isMobileView = () => window.innerWidth < 480;

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      // When a company logs in, their own ID is stored as company_id
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      // When a user logs in, company_id is directly stored
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

  // Fetch units from the backend
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(
          `${BASE_URL}/company/units/company/${companyId}/`
        ); // Replace with your API endpoint
        setUnits(response.data);
        console.log("unitssss", response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    fetchUnits();
  }, []);

  const openUnitModal = () => {
    if (isMobileView()) {
      navigate("/admin/unit-timeline");
    } else {
      setUnitModalOpen(true);
    }
  };

  const closeUnitModal = () => {
    setUnitModalOpen(false);
  };

  const openUpdateUnitModal = (unit) => {
    if (isMobileView()) {
      navigate("/admin/update-unit-timeline", { state: { unit } });
    } else {
      setSelectedUnit(unit);
      setUpdateUnitModalOpen(true);
    }
  };

  const closeUpdateUnitModal = () => {
    setUpdateUnitModalOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = async (unitId) => {
    try {
      await axios.delete(`${BASE_URL}/company/units/${unitId}/`);
      setUnits(units.filter((unit) => unit.code !== unitId));
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter units based on search term
  const filteredData = units.filter(
    (unit) =>
      unit.unit_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unit_type?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unit_status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  return (
    <div className="border border-[#E9E9E9] rounded-md unit-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] unit-table-header">
        <h1 className="unit-head">Units</h1>
        <div className="flex flex-col md:flex-row gap-[10px] unit-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 units-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 unit-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
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
          <div className="flex gap-[10px] unit-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md unit-add-new-unit duration-200"
              onClick={openUnitModal}
            >
              Add New Unit
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 unit-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] unit-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="unit-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left unit-thead">ID</th>
              <th className="px-5 text-left unit-thead w-[12%]">DATE</th>
              <th className="pl-5 text-left unit-thead w-[10%]">NAME</th>
              <th className="pl-5 text-left unit-thead w-[15%]">BUILDING</th>
              <th className="px-5 text-left unit-thead">ADDRESS</th>
              <th className="pl-12 pr-5 text-left unit-thead w-[12%]">TYPE</th>
              <th className="px-5 text-left unit-thead w-[12%]">STATUS</th>
              <th className="px-5 pr-6 text-right unit-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((unit, index) => (
              <tr
                key={unit.code}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left unit-data">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-5 text-left unit-data">
                  {new Date(unit.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="pl-5 text-left unit-data">{unit.unit_name}</td>
                <td className="pl-5 text-left unit-data">
                  {unit.building?.name || "N/A"}
                </td>
                <td className="px-5 text-left unit-data">{unit.address}</td>
                <td className="pl-12 pr-5 text-left unit-data">
                  {unit.unit_type?.title || "N/A"}
                </td>
                <td className="px-5 text-left unit-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] unit-status ${
                      unit.unit_status === "active"
                        ? "bg-[#E6F5EC] text-[#1C7D4D]"
                        : unit.unit_status === "inactive"
                        ? "bg-[#FDEAEA] text-[#D1293D]"
                        : "bg-[#FFF8E1] text-[#A67C00]"
                    }`}
                  >
                    {unit.unit_status}
                  </span>
                </td>

                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => openUpdateUnitModal(unit)}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] unit-action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => handleDeleteUnit(unit.id)}>
                    <img
                      src={deletesicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] unit-action-btn duration-200"
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
            <tr className="unit-table-row-head">
              <th className="px-5 text-left unit-thead unit-id-column">ID</th>
              <th className="px-5 text-left unit-thead unit-date-column">
                NAME
              </th>
              <th className="px-5 text-right unit-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((unit) => (
              <React.Fragment key={unit.code}>
                <tr
                  className={`${
                    expandedRows[unit.code]
                      ? "unit-mobile-no-border"
                      : "unit-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left unit-data unit-id-column">
                    {unit.code}
                  </td>
                  <td className="px-5 text-left unit-data unit-date-column">
                    {unit.unit_name}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`unit-dropdown-field ${
                        expandedRows[unit.code] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(unit.code)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`unit-dropdown-img ${
                          expandedRows[unit.code] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[unit.code] && (
                  <tr className="unit-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="unit-dropdown-content">
                        <div className="unit-grid">
                          <div className="unit-grid-item">
                            <div className="unit-dropdown-label">DATE</div>
                            <div className="unit-dropdown-value">
                              {new Date(unit.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div className="unit-grid-item">
                            <div className="unit-dropdown-label">BUILDING</div>
                            <div className="unit-dropdown-value">
                              {unit.building?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="unit-grid">
                          <div className="unit-grid-item">
                            <div className="unit-dropdown-label">ADDRESS</div>
                            <div className="unit-dropdown-value">
                              {unit.address}
                            </div>
                          </div>
                          <div className="unit-grid-item">
                            <div className="unit-dropdown-label">TYPE</div>
                            <div className="unit-dropdown-value">
                              {unit.unit_type?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="unit-grid">
                          <div className="unit-grid-item">
                            <div className="unit-dropdown-label">STATUS</div>
                            <div className="unit-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] h-[24px] rounded-[4px] unit-status ${
                                  unit.unit_status === "inactive"
                                    ? "bg-[#E6F5EC] text-[#1C7D4D] !w-[60px]"
                                    : unit.unit_status === "pending"
                                    ? "bg-[#FFF3E0] text-[#F57C00] !w-[75px]"
                                    : "bg-[#E8EFF6] text-[#1458A2] !w-[75px]"
                                }`}
                              >
                                {unit.unit_status}
                              </span>
                            </div>
                          </div>
                          <div className="unit-grid-item unit-action-column">
                            <div className="unit-dropdown-label">ACTION</div>
                            <div className="unit-dropdown-value unit-flex unit-items-center unit-gap-2">
                              <button onClick={() => openUpdateUnitModal(unit)}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] unit-action-btn duration-200"
                                />
                              </button>
                              <button onClick={() => handleDeleteUnit(unit.id)}>
                                <img
                                  src={deletesicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] unit-action-btn duration-200 ml-3"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 unit-pagination-container">
        <span className="unit-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto unit-pagination-buttons">
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
      {/* Add & Update Modals */}
      <AddUnitModal open={unitModalOpen} onClose={closeUnitModal} />
      <EditUnitModal
        open={updateUnitModalOpen}
        onClose={closeUpdateUnitModal}
        unit={selectedUnit}
      />
    </div>
  );
};

export default Units;
