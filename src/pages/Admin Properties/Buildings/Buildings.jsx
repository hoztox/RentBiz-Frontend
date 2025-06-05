import React, { useState, useEffect } from "react";
import "./buildings.css";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import plusicon from "../../../assets/Images/Admin Buildings/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Buildings/download-icon.svg";
import downarrow from "../../../assets/Images/Admin Buildings/downarrow.svg";
import editicon from "../../../assets/Images/Admin Buildings/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Buildings/delete-icon.svg";
import AddBuildingModal from "./Add Building Modal/AddBuildingModal";
import EditBuildingModal from "./EditBuildingModal/EditBuildingModal";
import { BASE_URL } from "../../../utils/config";

const Buildings = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [editbuildingModalOpen, setEditBuildingModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

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

  const isMobileView = () => window.innerWidth < 480;

  const openBuildingModal = () => {
    if (isMobileView()) {
      navigate("/admin/building-timeline");
    } else {
      setBuildingModalOpen(true);
    }
  };

  const openEditBuildingModal = () => {
    if (isMobileView()) {
      navigate("/admin/update-building-timeline");
    } else {
      setEditBuildingModalOpen(true);
    }
  };

  const closeBuildingModal = () => {
    setBuildingModalOpen(false);
  };

  const closeEditBuildingModal = () => {
    setEditBuildingModalOpen(false);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to fetch buildings
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

  // Refresh function to be called after building creation
  const refreshBuildings = () => {
    console.log("Buildings: Refreshing building list");
    fetchBuildings();
  };

 

  // Filter buildings based on search term

   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);


  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/company/buildings/company/${companyId}`, {
          params: { search: searchTerm,status:statusFilter, page:currentPage, page_size: itemsPerPage}
        });
        setBuildings(response.data.results);
        setTotalCount(response.data.count); 
      
         
      
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    if (companyId) {
      fetchBuildings();
      
    }
  }, [searchTerm, companyId,statusFilter,currentPage,itemsPerPage]);

  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedData = buildings;
 
   

  const deleteBuilding = async (buildingId) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/company/buildings/${buildingId}/`
        );
        if (response.status === 204) {
          setBuildings(
            buildings.filter((building) => building.id !== buildingId)
          );
          console.log("Buildings: Successfully deleted building", buildingId);
        }
      } catch (err) {
        console.error("Failed to delete building", err);
        setError(
          "Failed to delete building: " +
          (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const handleEditClick = (buildingId) => {
    console.log("Buildings: Selected buildingId:", buildingId);
    setSelectedBuildingId(buildingId);
    setTimeout(() => {
      console.log("Buildings: Opening edit modal with buildingId:", buildingId);
      openEditBuildingModal();
    }, 0);
  };

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="border border-[#E9E9E9] rounded-md bldg-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] bldg-table-header">
        <h1 className="bldg-head">Buildings</h1>
        <div className="flex flex-col md:flex-row gap-[10px] bldg-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full ">

            <div className="">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 units-search "
              />

            </div>

            <div className="relative w-[40%] md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded-md "
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
            </div>
          </div>
          <div className="flex gap-[10px] bldg-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md bldg-add-new-building duration-200"
              onClick={openBuildingModal}
            >
              Add New Building
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 bldg-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
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
          </thead><tbody>
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
                <td className="pl-12 pr-5 text-left bldg-data">{building.unit_count}</td>
                <td className="px-5 text-left bldg-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${building.status === "active"
                      ? "bg-[#e1ffea] text-[#28C76F]"
                      : building.status === "inactive"
                        ? "bg-[#FFE1E1] text-[#C72828]"
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
                  <button onClick={() => deleteBuilding(building.id)}>
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
              <th className="px-5 text-left bldg-thead bldg-date-column">
                NAME
              </th>
              <th className="px-5 text-right bldg-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((building, index) => (
              <React.Fragment key={building.id || index}>
                <tr
                  className={`${expandedRows[building.building_no]
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
                      className={`bldg-dropdown-field ${expandedRows[building.building_no] ? "active" : ""
                        }`}
                      onClick={() => toggleRowExpand(building.building_no)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`bldg-dropdown-img ${expandedRows[building.building_no] ? "text-white" : ""
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
                            <div className="bldg-dropdown-value">N/A</div>
                          </div>
                          <div className="bldg-grid-item w-[27%]">
                            <div className="bldg-dropdown-label">STATUS</div>
                            <div className="bldg-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] w-[65px] h-[24px] rounded-[4px] bldg-status ${building.status === "active"
                                  ? "bg-[#e1ffea] text-[#28C76F]"
                                  : building.status === "inactive"
                                    ? "bg-[#FFE1E1] text-[#C72828]"
                                    : "bg-[#FFF4E1] text-[#FFA500]"
                                  }`}
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
                                onClick={() => deleteBuilding(building.id)}
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
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{" "}
          to {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
          {totalCount} entries
        </span>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2">Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <AddBuildingModal
        open={buildingModalOpen}
        onClose={closeBuildingModal}
        onBuildingCreated={refreshBuildings}
      />
      <EditBuildingModal
        open={editbuildingModalOpen}
        onClose={closeEditBuildingModal}
        buildingId={selectedBuildingId}
        onBuildingCreated={refreshBuildings}
      />
    </div>
  );
};

export default Buildings;
