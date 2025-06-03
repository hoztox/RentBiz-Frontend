import React, { useState, useEffect } from "react";
import "./buildings.css";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import plusicon from "../../../assets/Images/Admin Buildings/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Buildings/download-icon.svg";
import downarrow from "../../../assets/Images/Admin Buildings/downarrow.svg";
import editicon from "../../../assets/Images/Admin Buildings/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Buildings/delete-icon.svg";
import AddBuildingModal from "./Add Building Modal/AddBuildingModal";
import { BASE_URL } from "../../../utils/config";
import DeleteBuildingModal from "./DeleteBuildingModal/DeleteBuildingModal";
import { useModal } from "../../../context/ModalContext";

const Buildings = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { openModal, refreshCounter } = useModal();
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [error, setError] = useState(null);
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

  const closeBuildingModal = () => {
    setBuildingModalOpen(false);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchBuildings = async () => {
    try {
      const companyId = getUserCompanyId();
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/buildings/company/${companyId}/`
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      console.log("Buildings: Fetched buildings:", data);
      setBuildings(data);
      setLoading(false);
    } catch (err) {
      setError(
        "Failed to fetch buildings data: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [companyId, refreshCounter]);

  const filteredData = buildings.filter(
    (building) =>
      (building.building_no?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (building.building_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (building.building_address?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (building.status?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const deleteBuilding = async () => {
    if (!buildingToDelete) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/company/buildings/${buildingToDelete}/`
      );
      if (response.status === 204) {
        setBuildings(
          buildings.filter((building) => building.id !== buildingToDelete)
        );
        console.log(
          "Buildings: Successfully deleted building",
          buildingToDelete
        );
      }
      setDeleteModalOpen(false);
      setBuildingToDelete(null);
    } catch (err) {
      console.error("Failed to delete building", err);
      setError(
        "Failed to delete building: " +
          (err.response?.data?.message || err.message)
      );
      setDeleteModalOpen(false);
      setBuildingToDelete(null);
    }
  };

  const handleEditClick = (buildingId) => {
    console.log("Buildings: Selected buildingId:", buildingId);
    openModal("edit-building", "Update Building", { buildingId }); // Fixed to pass title and data
  };

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md bldg-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] bldg-table-header">
        <h1 className="bldg-head">Buildings</h1>
        <div className="flex flex-col md:flex-row gap-[10px] bldg-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[10px] outline-none border rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 bldg-search"
            />
         <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 bldg-selection"
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
          <div className="flex gap-[10px] bldg-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[40px] rounded-md bldg-add-new-building duration-200"
              onClick={() => openModal("create-building", "Add New Building")}
            >
              Add New Building
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-[2] w-full md:w-[122px] h-[40px] rounded-md duration-200 bldg-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download icon"
                className="w-[15px] h-[15px] bldg-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="bldg-desktop-only">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E9E9E9] h-[57px]">
                <th className="px-5 text-left bldg-thead">ID</th>
                <th className="px-5 text-left bldg-thead w-[12%]">DATE</th>
                <th className="pl-5 text-left bldg-thead w-[15%]">NAME</th>
                <th className="px-5 text-left bldg-thead">ADDRESS</th>
                <th className="pl-12 pr-5 text-left bldg-thead w-[18%]">
                  NO. OF UNITS
                </th>
                <th className="px-5 text-left bldg-thead w-[12%]">STATUS</th>
                <th className="px-5 pr-6 text-right bldg-thead">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((building, index) => (
                <tr
                  key={building.id || index}
                  className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-5 text-left bldg-data">
                    {building.code || "N/A"}
                  </td>
                  <td className="px-5 text-left bldg-data">
                    {new Date(building.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="pl-5 text-left bldg-data">
                    {building.building_name || "N/A"}
                  </td>
                  <td className="px-5 text-left bldg-data">
                    {building.building_address || "N/A"}
                  </td>
                  <td className="pl-12 pr-5 text-left bldg-data">
                    {building.unit_count || "N/A"}
                  </td>
                  <td className="px-5 text-left bldg-data">
                    <span
                      className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                        building.status === "active"
                          ? "bg-[#e1ffea] text-[#28c76f]"
                          : building.status === "inactive"
                            ? "bg-[#FFE1E1] text-[#c72828]"
                            : "bg-[#FFF4E1] text-[#FFA500]"
                      }`}
                    >
                      {building.status
                        ? building.status.charAt(0).toUpperCase() +
                          building.status.slice(1)
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                    <button onClick={() => handleEditClick(building.id)}>
                      <img
                        src={editicon}
                        alt="Edit"
                        className="w-[18px] h-[18px] bldg-action-btn duration-200"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setBuildingToDelete(building.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <img
                        src={deletesicon}
                        alt="Delete"
                        className="w-[18px] h-[18px] bldg-action-btn duration-200"
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
            <tr className="bldg-table-row-head">
              <th className="px-5 text-left bldg-thead bldg-id-column">ID</th>
              <th className="px-5 text-left bldg-thead bldg-date-column">NAME</th>
              <th className="px-5 text-right bldg-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((building, index) => (
              <React.Fragment key={building.id || index}>
                <tr
                  className={`${
                    expandedRows[building.building_no]
                      ? "bldg-mobile-no-border"
                      : "bldg-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left bldg-data bldg-id-column">
                    {building.code || "N/A"}
                  </td>
                  <td className="px-5 text-left bldg-data bldg-date-column">
                    {building.building_name || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`bldg-dropdown-field ${
                        expandedRows[building.building_no] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(building.building_no)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`bldg-dropdown-img ${
                          expandedRows[building.building_no] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[building.building_no] && (
                  <tr className="bldg-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="bldg-dropdown-content">
                        <div className="bldg-grid">
                          <div className="bldg-grid-item w-[45%]">
                            <div className="bldg-dropdown-label">DATE</div>
                            <div className="bldg-dropdown-value">
                              {new Date(building.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div className="bldg-grid-item w-[60%]">
                            <div className="bldg-dropdown-label">ADDRESS</div>
                            <div className="bldg-dropdown-value">
                              {building.building_address || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="bldg-grid">
                          <div className="bldg-grid-item w-[33%]">
                            <div className="bldg-dropdown-label">
                              NO. OF UNITS
                            </div>
                            <div className="bldg-dropdown-value">{building.unit_count || "N/A"}</div>
                          </div>
                          <div className="bldg-grid-item w-[27%]">
                            <div className="bldg-dropdown-label">STATUS</div>
                            <div className="bldg-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] w-[65px] h-[5px] rounded-[24px] bldg-status ${
                                  building.status === "active"
                                    ? "bg-[#e1ffea] text-[#28c76f]"
                                    : building.status === "inactive"
                                      ? "bg-[#FFE1E1] text-[#c72828]"
                                      : "bg-[#FFF4E1] text-[#FFA500]"
                                } `}
                              >
                                {building.status
                                  ? building.status.charAt(0).toUpperCase() +
                                    building.status.slice(1)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="bldg-grid-item bldg-action-column w-[20%]">
                            <div className="bldg-dropdown-label">ACTION</div>
                            <div className="bldg-dropdown-value bldg-flex bldg-items-center bldg-gap-2">
                              <button
                                onClick={() => handleEditClick(building.id)}
                              >
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] bldg-action-btn duration-200"
                                />
                              </button>
                              <button
                                onClick={() => {
                                  setBuildingToDelete(building.id);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                <img
                                  src={deletesicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] bldg-action-btn duration-200"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 bldg-pagination-container">
        <span className="bldg-pagination bldg-collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto bldg-pagination-buttons">
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
      <AddBuildingModal open={buildingModalOpen} onClose={closeBuildingModal} />
      <DeleteBuildingModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setBuildingToDelete(null);
        }}
        onDelete={deleteBuilding}
      />
    </div>
  );
};

export default Buildings;