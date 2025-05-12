import React, { useState } from "react";
import "./TenancyTermination.css";
import { ChevronDown } from "lucide-react";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import terminateicon from "../../../assets/Images/Admin Tenancy/terminate-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import TenancyTerminateModal from "./TenancyTerminateModal/TenancyTerminateModal";
import UpdateTenancyModal from "../UpdateTenancyModal/UpdateTenancyModal";

const TenancyTermination = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const openTerminateModal = (tenancy) => {
    setSelectedTenancy(tenancy);
    setTerminateModalOpen(true);
  };

  const handleTerminateAction = () => {
    console.log("Confirmed action for tenancy:", selectedTenancy);
    setTerminateModalOpen(false);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const demoData = [
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      endDate: "09 Sept 2024",
    },
    {
      id: "#TC0018-2",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      endDate: "09 Sept 2024",
    },
    {
      id: "#TC0018-3",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      endDate: "09 Sept 2024",
    },
    {
      id: "#TC0018-4",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      endDate: "09 Sept 2024",
    },
    {
      id: "#TC0018-5",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      endDate: "09 Sept 2024",
    },
  ];

  const filteredData = demoData.filter(
    (tenancy) =>
      tenancy.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenancy.endDate && tenancy.endDate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Termination</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenancy-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto tterm-second-row-container">
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
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 tterm-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] tterm-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="tterm-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">ID</th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">NAME</th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap">BUILDING NAME</th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap w-[20%]">UNIT NAME</th>
              <th className="px-4 text-left tenancy-thead whitespace-nowrap w-[12%]">END DATE</th>
              <th className="px-4 pr-6 text-right tenancy-thead whitespace-nowrap">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 text-left tenancy-data">{tenancy.id}</td>
                <td className="px-4 text-left tenancy-data">{tenancy.tenant}</td>
                <td className="px-4 text-left tenancy-data">{tenancy.building}</td>
                <td className="px-4 text-left tenancy-data">{tenancy.unit}</td>
                <td className="px-4 text-left tenancy-data">{tenancy.endDate}</td>
                <td className="px-4 text-right">
                  <div className="flex gap-3 justify-end items-center">
                    <button onClick={openUpdateModal}>
                      <img
                        src={editicon}
                        alt="Edit"
                        className="w-[18px] h-[18px] tterm-action-btn duration-200"
                      />
                    </button>
                    <button onClick={() => openTerminateModal(tenancy)}>
                      <img
                        src={terminateicon}
                        alt="Terminate"
                        className="w-[32px] h-[20px] tterm-terminate-btn duration-200"
                      />
                    </button>
                  </div>
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
              <th className="px-5 w-[53%] text-left tenancy-thead tterm-id-column">ID</th>
              <th className="px-5 w-[47%] text-left tenancy-thead tterm-end-date-column">NAME</th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <React.Fragment key={tenancy.id}>
                <tr
                  className={`${
                    expandedRows[tenancy.id] ? "tterm-mobile-no-border" : "tterm-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data tterm-id-column">{tenancy.id}</td>
                  <td className="px-5 text-left tenancy-data tterm-end-date-column">{tenancy.tenant}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-dropdown-field ${expandedRows[tenancy.id] ? "active" : ""}`}
                      onClick={() => toggleRowExpand(tenancy.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenancy-dropdown-img ${
                          expandedRows[tenancy.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[tenancy.id] && (
                  <tr className="tterm-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-dropdown-content">
                        <div className="tterm-grid">
                          <div className="tterm-grid-item">
                            <div className="tterm-dropdown-label">BUILDING NAME</div>
                            <div className="tterm-dropdown-value">{tenancy.building}</div>
                          </div>
                          <div className="tterm-grid-item">
                            <div className="tterm-dropdown-label">UNIT NAME</div>
                            <div className="tterm-dropdown-value">{tenancy.unit}</div>
                          </div>
                        </div>
                        <div className="tterm-grid">
                          <div className="tterm-grid-item">
                            <div className="tterm-dropdown-label">END DATE</div>
                            <div className="tterm-dropdown-value">{tenancy.endDate}</div>
                          </div>
                          <div className="tterm-grid-item">
                            <div className="tterm-dropdown-label">ACTION</div>
                            <div className="tterm-dropdown-value tterm-flex tterm-items-center mt-[10px] ml-[5px]">
                              <button onClick={openUpdateModal}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] tterm-action-btn duration-200"
                                />
                              </button>
                              <button onClick={() => openTerminateModal(tenancy)}>
                                <img
                                  src={terminateicon}
                                  alt="Terminate"
                                  className="w-[32px] h-[20px] ml-[10px] tterm-terminate-btn duration-200"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tterm-pagination-container">
        <span className="tterm-pagination collection-list-pagination">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tterm-pagination-buttons">
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
      <UpdateTenancyModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} />
      <TenancyTerminateModal
        isOpen={terminateModalOpen}
        onCancel={() => setTerminateModalOpen(false)}
        onTerminate={handleTerminateAction}
      />
    </div>
  );
};

export default TenancyTermination;