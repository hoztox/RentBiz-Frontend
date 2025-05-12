import React, { useState } from "react";
import "./buildings.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Buildings/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Buildings/download-icon.svg";
import editicon from "../../../assets/Images/Admin Buildings/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Buildings/delete-icon.svg";
import AddBuildingModal from "./Add Building Modal/AddBuildingModal";
import downarrow from "../../../assets/Images/Admin Buildings/downarrow.svg";
import EditBuildingModal from "./EditBuildingModal/EditBuildingModal";

const Buildings = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [editbuildingModalOpen, setEditBuildingModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const openBuildingModal = () => {
    setBuildingModalOpen(true);
  };

  const openEditBuildingModal = () => {
    setEditBuildingModalOpen(true);
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

  const demoData = [
    {
      id: "B24090001",
      date: "09 Sept 2024",
      name: "Emaar Square Area",
      address: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE",
      units: "12 Shops",
      status: "Active",
    },
    {
      id: "B24090002",
      date: "10 Sept 2024",
      name: "Marina Bay",
      address: "Dubai Marina, PO Box 112233 Dubai, UAE",
      units: "8 Shops",
      status: "Active",
    },
    {
      id: "B24090003",
      date: "11 Sept 2024",
      name: "Palm Jumeirah",
      address: "Palm Jumeirah, PO Box 113344 Dubai, UAE",
      units: "15 Shops",
      status: "Active",
    },
    {
      id: "B24090004",
      date: "12 Sept 2024",
      name: "Downtown View",
      address: "Downtown Dubai, PO Box 114455 Dubai, UAE",
      units: "10 Shops",
      status: "Inactive",
    },
    {
      id: "B24090005",
      date: "13 Sept 2024",
      name: "JBR Walk",
      address: "Jumeirah Beach Residences, PO Box 115566 Dubai, UAE",
      units: "20 Shops",
      status: "Active",
    },
  ];

  const filteredData = demoData.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.units.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / 10);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

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
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 bldg-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 bldg-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
 
                // className={`absolute md:right-2 right-4 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${isSelectOpen ? "rotate-180" : "rotate-0"
                //   }`}
 
                className={`absolute md:right-2 right-[8px] top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
 
              />
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
          </thead>
          <tbody>
            {paginatedData.map((building, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left bldg-data">{building.id}</td>
                <td className="px-5 text-left bldg-data">
                  {building.date}
                </td>
                <td className="pl-5 text-left bldg-data">
                  {building.name}
                </td>
                <td className="px-5 text-left bldg-data">
                  {building.address}
                </td>
                <td className="pl-12 pr-5 text-left bldg-data">
                  {building.units}
                </td>
                <td className="px-5 text-left bldg-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${building.status === "Active"
                      ? "bg-[#e1ffea] text-[#28C76F]"
                      : "bg-[#FFE1E1] text-[#C72828]"
                      }`}
                  >
                    {building.status}
                  </span>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button
                    onClick={openEditBuildingModal}
                  >
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] bldg-action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={deletesicon}
                      alt="Deletes"
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
              <th className="px-5 text-left bldg-thead bldg-id-column">
                ID
              </th>
              <th className="px-5 text-left bldg-thead bldg-date-column">
                DATE
              </th>
              <th className="px-5 text-right bldg-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((building, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${expandedRows[building.id]
                    ? "bldg-mobile-no-border"
                    : "bldg-mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left bldg-data bldg-id-column">
                    {building.id}
                  </td>
                  <td className="px-5 text-left bldg-data bldg-date-column">
                    {building.date}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`bldg-dropdown-field ${expandedRows[building.id] ? "active" : ""
                        }`}
                      onClick={() => toggleRowExpand(building.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`bldg-dropdown-img ${expandedRows[building.id] ? "text-white" : ""
                          }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[building.id] && (
                  <tr className="bldg-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="bldg-dropdown-content">
                        <div className="bldg-grid">
                          <div className="bldg-grid-item w-[45%]">
                            <div className="bldg-dropdown-label">NAME</div>
                            <div className="bldg-dropdown-value">
                              {building.name}
                            </div>
                          </div>
                          <div className="bldg-grid-item w-[60%]">
                            <div className="bldg-dropdown-label">ADDRESS</div>
                            <div className="bldg-dropdown-value">
                              {building.address}
                            </div>
                          </div>
                        </div>
                        <div className="bldg-grid">
                          <div className="bldg-grid-item w-[33%]">
                            <div className="bldg-dropdown-label">NO. OF UNITS</div>
                            <div className="bldg-dropdown-value">
                              {building.units}
                            </div>
                          </div>
                          <div className="bldg-grid-item w-[27%]">
                            <div className="bldg-dropdown-label">STATUS</div>
                            <div className="bldg-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] w-[65px] h-[24px] rounded-[4px] bldg-status ${building.status === "Active"
                                  ? "bg-[#e1ffea] text-[#28C76F]"
                                  : "bg-[#FFE1E1] text-[#C72828]"
                                  }`}
                              >
                                {building.status}
                              </span>
                            </div>
                          </div>
                          <div className="bldg-grid-item bldg-action-column w-[20%]">
                            <div className="bldg-dropdown-label">ACTION</div>
                            <div className="bldg-dropdown-value bldg-flex bldg-items-center bldg-gap-2">
                              <button
                              >
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] bldg-action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deletesicon}
                                  alt="Deletes"
                                  className="w-[18px] h-[18px] bldg-action-btn duration-200 ml-3"
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
        <span className="bldg-pagination collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
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
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 bldg-page-no-btns ${currentPage === startPage + i
                ? "bg-[#1458A2] text-white"
                : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
                }`}
 
              // className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${
              //   currentPage === startPage + i
              //     ? "bg-[#1458A2] text-white"
              //     : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
              // }`}
 
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
      <AddBuildingModal open={buildingModalOpen} onClose={closeBuildingModal} />
      <EditBuildingModal open={editbuildingModalOpen} onClose={closeEditBuildingModal} />
    </div>
  );
};

export default Buildings;