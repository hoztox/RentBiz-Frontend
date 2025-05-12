import React, { useState } from "react";
import "./TenantsMaster.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Tenants/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenants/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenants/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenants/delete-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenants/downarrow.svg";

const TenantsMaster = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [addtenantModalOpen, setAddTenantModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  // const openAddTenantModal = () => {
  //   setAddTenantModalOpen(true);
  // };

  // const closeAddTenantModal = () => {
  //   setAddTenantModalOpen(false);
  // };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const demoData = [
    {
      id: "#U24090012",
      date: "09 Sept 2024",
      name: "Ladies Saloon",
      contact: "968123123, oman@oman.com",
      status: "Active",
      type: "NATIONALITY ID",
    },
    {
      id: "#U24090013",
      date: "10 Sept 2024",
      name: "Ladies Saloon",
      contact: "968123123, oman@oman.com",
      status: "Active",
      type: "NATIONALITY ID",
    },
    {
      id: "#U24090014",
      date: "11 Sept 2024",
      name: "Ladies Saloon",
      contact: "968123123, oman@oman.com",
      status: "Active",
      type: "NATIONALITY ID",
    },
    {
      id: "#U24090015",
      date: "12 Sept 2024",
      name: "Ladies Saloon",
      contact: "968123123, oman@oman.com",
      status: "Inactive",
      type: "NATIONALITY ID",
    },
  ];

  const filteredData = demoData.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="border border-[#E9E9E9] rounded-md tenant-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenant-table-header">
        <h1 className="tenant-head">Tenants</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenant-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenant-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenant-selection"
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
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md add-new-tenant duration-200"
              // onClick={openTenantModal}
            >
              Add New Tenant
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 tenant-download-btn">
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
      <div className="desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenant-thead">ID</th>
              <th className="px-5 text-left tenant-thead w-[15%]">DATE</th>
              <th className="pl-5 text-left tenant-thead w-[15%]">NAME</th>
              <th className="pl-5 text-left tenant-thead w-[20%]">CONTACTS</th>
              <th className="px-5 text-left tenant-thead w-[12%]">STATUS</th>
              <th className="pl-12 pr-5 text-left tenant-thead w-[15%]">
                ID TYPE
              </th>
              <th className="px-5 pr-6 text-right tenant-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenant) => (
              <tr
                key={tenant.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenant-data">{tenant.id}</td>
                <td className="px-5 text-left tenant-data">{tenant.date}</td>
                <td className="pl-5 text-left tenant-data">{tenant.name}</td>
                <td className="pl-5 text-left tenant-data">{tenant.contact}</td>
                <td className="px-5 text-left tenant-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                      tenant.status === "Active"
                        ? "bg-[#e1ffea] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </td>
                <td className="pl-12 pr-5 text-left tenant-data">
                  {tenant.type}
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={deletesicon}
                      alt="Deletes"
                      className="w-[18px] h-[18px] action-btn duration-200"
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
            <tr className="tenant-table-row-head">
              <th className="px-5 text-left tenant-thead tenant-id-column w-[36%]">
                ID
              </th>
              <th className="px-3 text-left tenant-thead date-column w-[50%]">DATE</th>
              <th className="px-5 text-right tenant-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenant) => (
              <React.Fragment key={tenant.id}>
                <tr
                  className={`${
                    expandedRows[tenant.id]
                      ? "mobile-no-border"
                      : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenant-data">{tenant.id}</td>
                  <td className="px-3 text-left tenant-data date-column">
                    {tenant.date}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenant-dropdown-field ${
                        expandedRows[tenant.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(tenant.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenant-dropdown-img ${
                          expandedRows[tenant.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[tenant.id] && (
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenant-dropdown-content">
                        <div className="tenant-grid">
                          <div className="tenant-grid-item">
                            <div className="dropdown-label">NAME</div>
                            <div className="dropdown-value w-[95px]">
                              {tenant.name}
                            </div>
                          </div>
                          <div className="tenant-grid-item w-[61%]">
                            <div className="dropdown-label">CONTACTS</div>
                            <div className="dropdown-value w-[113px]">
                              {tenant.contact}
                            </div>
                          </div>
                        </div>
                        <div className="tenant-grid">
                          <div className="tenant-grid-item w-[36%]">
                            <div className="dropdown-label">STATUS</div>
                            <div className="dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] w-[65px] h-[24px] rounded-[4px] tenant-status ${
                                  tenant.status === "Active"
                                    ? "bg-[#e1ffea] text-[#28C76F]"
                                    : "bg-[#FFE1E1] text-[#C72828]"
                                }`}
                              >
                                {tenant.status}
                              </span>
                            </div>
                          </div>
                          <div className="tenant-grid-item w-[38%]">
                            <div className="dropdown-label">ID TYPE</div>
                            <div className="dropdown-value">{tenant.type}</div>
                          </div>
                          <div className="tenant-grid-item w-[20%]">
                            <div className="dropdown-label">ACTION</div>
                            <div className="dropdown-value flex items-center gap-2 mt-[10px]">
                              <button>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deletesicon}
                                  alt="Deletes"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:px-5 pagination-container">
        <span className="collection-list-pagination pagination-text">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto py-2 w-full md:w-auto pagination-buttons">
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
      {/* Add Tenant Modal /> */}
    </div>
  );
};

export default TenantsMaster;
