import React, { useState } from "react";
import "./TenancyConfirm.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Tenancy/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import confirmicon from "../../../assets/Images/Admin Tenancy/confirm-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import TenancyConfirmModal from "./TenancyConfirmModal/TenancyConfirmModal";
import CreateTenancyModal from "../CreateTenancy/CreateTenancyModal";
import UpdateTenancyModal from "../UpdateTenancyModal/UpdateTenancyModal";
import TenancyViewModal from "../TenancyViewModal/TenancyViewModal";

const TenancyConfirm = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  // State for the Create Tenancy Modal
  const [createTenancyModal, setCreateTenancyModal] = useState(false);

  // State for tenancy Update Modal
  const [updateTenancyModal, setUpdateTenancyModal] = useState(false);

  // State for tenancy View Modal
  const [tenancyViewModal, setTenencyViewModal] = useState(false);

  const openCreateTenancyModal = () => {
    setCreateTenancyModal(true);
  };

  const closeCreateTenancyModal = () => {
    setCreateTenancyModal(false);
  };

  const openUpdateTenancyModal = () => {
    setUpdateTenancyModal(true);
  };

  const closeUpdateTenancyModal = () => {
    setUpdateTenancyModal(false);
  };

  const openTenancyViewModal = () => {
    setTenencyViewModal(true);
  };

  const closeViewTenancyModal = () => {
    setTenencyViewModal(false);
  };

  // State for the confirm modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState(null);

  // Function to open confirm modal
  const openConfirmModal = (tenancy) => {
    setSelectedTenancy(tenancy);
    setConfirmModalOpen(true);
  };

  // Function to handle confirmation action
  const handleConfirmAction = () => {
    // Implement your confirmation logic here
    console.log("Confirmed action for tenancy:", selectedTenancy);
    // Close the modal after confirming
    setConfirmModalOpen(false);
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
      months: "66",
      view: viewicon,
      status: "Pending",
    },
    {
      id: "#TC0018-2",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Pending",
    },
    {
      id: "#TC0018-3",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Pending",
    },
    {
      id: "#TC0018-4",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Pending",
    },
    {
      id: "#TC0018-5",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Pending",
    },
  ];

  const filteredData = demoData.filter(
    (tenancy) =>
      tenancy.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy Confirm</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenancy-search"
            />
            <div className="relative w-full md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenancy-selection"
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
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md add-new-tenancy duration-200"
              onClick={openCreateTenancyModal}
            >
              Add New Tenancy
              <img
                src={plusicon}
                alt="plus icon"
                className="w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 download-btn">
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
              <th className="px-5 text-left tenancy-thead">ID</th>
              <th className="px-5 text-left tenancy-thead w-[15%]">
                TENANT NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">
                BUILDING NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">
                UNIT NAME
              </th>
              <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">STATUS</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[8%]">
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
                  <div className="w-[50%] flex justify-center">
                    {tenancy.months}
                  </div>
                </td>
                <td className="px-5 text-left tenancy-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                      tenancy.status === "Pending"
                        ? "bg-[#E8EFF6] text-[#1458A2]"
                        : "bg-[#E8EFF6] text-[#1458A2]"
                    }`}
                  >
                    {tenancy.status}
                  </span>
                </td>
                <td className="pl-12 pr-5 pt-2 text-center">
                  <button onClick={openTenancyViewModal}>
                    <img
                      src={tenancy.view}
                      alt="View"
                      className="w-[30px] h-[24px] action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={openUpdateTenancyModal}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button onClick={() => openConfirmModal(tenancy)}>
                    <img
                      src={confirmicon}
                      alt="Confirm"
                      className="w-[24px] h-[20px] confirm-btn duration-200"
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
              <th className="px-5 w-[74px] text-left tenancy-thead tenancy-id-column">
                ID
              </th>
              <th className="px-3 text-center tenancy-thead tenant-column">
                TENANT NAME
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
                      ? "mobile-no-border"
                      : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data">{tenancy.id}</td>
                  <td className="px-3 text-center tenancy-data tenant-column">
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
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-dropdown-content">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <div className="dropdown-label">BUILDING NAME</div>
                            <div className="dropdown-value">
                              {tenancy.building}
                            </div>
                          </div>
                          <div>
                            <div className="dropdown-label">UNIT NAME</div>
                            <div className="dropdown-value">{tenancy.unit}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <div className="dropdown-label">RENTAL MONTHS</div>
                            <div className="dropdown-value">
                              {tenancy.months}
                            </div>
                          </div>
                          <div>
                            <div className="dropdown-label">STATUS</div>
                            <div className="dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] h-[24px] rounded-[4px] tenancy-status ${
                                  tenancy.status === "Pending"
                                    ? "bg-[#E8EFF6] text-[#1458A2]"
                                    : "bg-[#E8EFF6] text-[#1458A2]"
                                }`}
                              >
                                {tenancy.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <div className="dropdown-label">VIEW</div>
                            <div className="dropdown-value">
                              <button onClick={openTenancyViewModal}>
                                <img
                                  src={tenancy.view}
                                  alt="View"
                                  className="w-[30px] h-[24px] action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="dropdown-label">ACTION</div>
                            <div className="dropdown-value flex items-center gap-2">
                              <button onClick={openUpdateTenancyModal}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button onClick={() => openConfirmModal(tenancy)}>
                                <img
                                  src={confirmicon}
                                  alt="Confirm"
                                  className="w-[24px] h-[20px] confirm-btn duration-200"
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
      <CreateTenancyModal
        isOpen={createTenancyModal}
        onClose={closeCreateTenancyModal}
      />
      <UpdateTenancyModal
        isOpen={updateTenancyModal}
        onClose={closeUpdateTenancyModal}
      />
      <TenancyViewModal
        isOpen={tenancyViewModal}
        onClose={closeViewTenancyModal}
      />
      <TenancyConfirmModal
        isOpen={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default TenancyConfirm;
