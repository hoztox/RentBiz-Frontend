import React, { useState } from "react";
import "./TenancyRenewal.css";
import { ChevronDown } from "lucide-react";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";
import { useModal } from "../../../context/ModalContext";

const TenancyRenewal = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      renew: "Click to Renew",
      endDate: "09 Sept 2024",
      view: viewicon,
    },
    {
      id: "#TC0018-2",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      renew: "Click to Renew",
      endDate: "09 Sept 2024",
      view: viewicon,
    },
    {
      id: "#TC0018-3",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      renew: "Click to Renew",
      endDate: "09 Sept 2024",
      view: viewicon,
    },
    {
      id: "#TC0018-4",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      renew: "Click to Renew",
      endDate: "09 Sept 2024",
      view: viewicon,
    },
    {
      id: "#TC0018-5",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      renew: "Click to Renew",
      endDate: "09 Sept 2024",
      view: viewicon,
    },
  ];

  const filteredData = demoData.filter(
    (tenancy) =>
      tenancy.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.renew.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.endDate.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleRenewClick = (tenancy) => {
    console.log("Renew clicked for tenancy:", tenancy);
    // Add renewal logic here
  };

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
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
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
              <th className="px-5 text-left tenancy-thead">ID</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">NAME</th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">
                BUILDING NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">
                UNIT NAME
              </th>
              <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">END DATE</th>
              <th className="px-5 text-center tenancy-thead w-[10%]">RENEW</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[10%]">
                VIEW
              </th>
              <th className="px-5 pr-6 text-right tenancy-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <tr
                key={tenancy.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenancy-data">{tenancy.id}</td>
                <td className="px-5 text-left tenancy-data">
                  {tenancy.tenant}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.building}
                </td>
                <td className="pl-5 text-left tenancy-data">{tenancy.unit}</td>
                <td className="px-5 tenancy-data">
                  <div className="w-[63%] flex justify-center">
                    {tenancy.months}
                  </div>
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.endDate}
                </td>
                <td className="px-5 text-center !text-[#1458a2] tenancy-data">
                  <button
                    onClick={() => handleRenewClick(tenancy)}
                    className="trenew-renew-btn"
                  >
                    {tenancy.renew}
                  </button>
                </td>
                <td className="pl-14 text-center pr-5 pt-2">
                  <button onClick={() => openModal("tenancy-view")}>
                    <img
                      src={tenancy.view}
                      alt="View"
                      className="w-[30px] h-[24px] trenew-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
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
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-id-column">
                ID
              </th>
              <th className="px-5 w-[50%] text-left tenancy-thead trenew-end-date-column">
                NAME
              </th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <React.Fragment key={tenancy.id}>
                <tr
                  className={`${
                    expandedRows[tenancy.id]
                      ? "trenew-mobile-no-border"
                      : "trenew-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data trenew-id-column">
                    {tenancy.id}
                  </td>
                  <td className="px-3 text-left tenancy-data trenew-end-date-column">
                    {tenancy.tenant}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-dropdown-field ${
                        expandedRows[tenancy.id] ? "active" : ""
                      }`}
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
                  <tr className="trenew-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-dropdown-content">
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">
                              BUILDING NAME
                            </div>
                            <div className="trenew-dropdown-value">
                              {tenancy.building}
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">
                              UNIT NAME
                            </div>
                            <div className="trenew-dropdown-value">
                              {tenancy.unit}
                            </div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">
                              RENTAL MONTHS
                            </div>
                            <div className="trenew-dropdown-value">
                              {tenancy.months}
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[53%]">
                            <div className="trenew-dropdown-label">
                              END DATE
                            </div>
                            <div className="trenew-dropdown-value">
                              {tenancy.endDate}
                            </div>
                          </div>
                        </div>
                        <div className="trenew-grid">
                          <div className="trenew-grid-item w-[40%]">
                            <div className="trenew-dropdown-label">RENEW</div>
                            <div className="trenew-dropdown-value !text-[#1458a2]">
                              <button
                                onClick={() => handleRenewClick(tenancy)}
                                className="trenew-renew-btn"
                              >
                                {tenancy.renew}
                              </button>
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[26%]">
                            <div className="trenew-dropdown-label">VIEW</div>
                            <div className="trenew-dropdown-value">
                              <button onClick={() => openModal("tenancy-view")}>
                                <img
                                  src={tenancy.view}
                                  alt="View"
                                  className="w-[30px] h-[24px] trenew-action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="trenew-grid-item w-[20%]">
                            <div className="trenew-dropdown-label">ACTION</div>
                            <div className="trenew-dropdown-value trenew-flex trenew-items-center mt-[10px] ml-[7px]">
                              <button
                                onClick={() => openModal("tenancy-update")}
                              >
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
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
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
    </div>
  );
};

export default TenancyRenewal;
