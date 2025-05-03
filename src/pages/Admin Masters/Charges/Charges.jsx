import React, { useState } from "react";
import "./Charges.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import plusiconblue from "../../../assets/Images/Admin Masters/plus-icon-blue.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import closeicon from "../../../assets/Images/Admin Masters/close-icon.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import CreateChargesModal from "./CreateChargesModal/CreateChargesModal";
import UpdateChargesModal from "./UpdateChargesModal/UpdateChargesModal";

const Charges = () => {
  const [isHeaderSelectOpen, setIsHeaderSelectOpen] = useState(false);
  const [isTaxNameSelectOpen, setIsTaxNameSelectOpen] = useState(false);
  const [isChargeCodeSelectOpen, setIsChargeCodeSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [isRefundable, setIsRefundable] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "01",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "02",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "03",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "04",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "05",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "06",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "07",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "08",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "09",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
    {
      id: "10",
      date: "09 Sept 2024",
      name: "Maintenance",
      chargeType: "Deposit",
    },
  ];

  const filteredData = demoData.filter(
    (charge) =>
      charge.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.chargeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openCreateChargeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openUpdateModal = (charge) => {
    setSelectedCharge(charge);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleRefundableToggle = () => {
    setIsRefundable((prev) => !prev);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border border-gray-200 rounded-md charges-table">
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
            />
            <div className="relative w-full md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 charges-selection"
                onFocus={() => setIsHeaderSelectOpen(true)}
                onBlur={() => setIsHeaderSelectOpen(false)}
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
              onClick={openCreateChargeModal}
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md add-new-master duration-200"
            >
              Add New Master
              <img src={plusicon} alt="plus icon" className="w-[15px] h-[15px]" />
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

      {/* Content Section */}
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
                  <th className="px-4 py-3 text-left charges-thead">CHARGE TYPE</th>
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
                      <td className="px-5 text-left charges-data">{charge.id}</td>
                      <td className="px-5 text-left charges-data">{charge.date}</td>
                      <td className="pl-5 text-left charges-data">{charge.name}</td>
                      <td className="pl-5 text-left charges-data w-[15%]">{charge.chargeType}</td>
                      <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                        <button onClick={() => openUpdateModal(charge)}>
                          <img
                            src={editicon}
                            alt="Edit"
                            className="w-[18px] h-[18px] action-btn duration-200"
                          />
                        </button>
                        <button>
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
                      <th className="px-4 py-3 text-left tax-section-thead">TAX NAME</th>
                      <th className="px-4 py-3 text-left tax-section-thead">CHARGE TYPE</th>
                      <th className="px-4 py-3 text-left tax-section-thead">PERCENTAGE</th>
                      <th className="px-4 py-3 text-right tax-section-thead">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-[57px] hover:bg-gray-50 cursor-pointer">
                      <td className="px-5 text-left tax-section-tdata">Vat</td>
                      <td className="px-5 text-left tax-section-tdata">Maintenance</td>
                      <td className="pl-5 text-left tax-section-tdata w-[18%]">20%</td>
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
              <div className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#201D1E] tax-form-head">Add New Tax</h3>
                  <button className="tax-form-close-btn">
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
                      placeholder="Enter Tax Type"
                      className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                      Name
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2 border rounded-md appearance-none outline-none focus:border-gray-400"
                        onFocus={() => setIsTaxNameSelectOpen(true)}
                        onBlur={() => setIsTaxNameSelectOpen(false)}
                      >
                        <option>Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                          isTaxNameSelectOpen ? "rotate-180" : "rotate-0"
                        }`}
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
                        className="w-full px-3 py-2 border rounded-md appearance-none outline-none focus:border-gray-400 charge-code-select"
                        onFocus={() => setIsChargeCodeSelectOpen(true)}
                        onBlur={() => setIsChargeCodeSelectOpen(false)}
                      >
                        <option>Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                          isChargeCodeSelectOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="ml-[30px] w-[110px]">
                    <label className="block mb-[10px] text-[#201D1E] tax-form-label">
                      Percentage (%)
                    </label>
                    <input
                      type="text"
                      placeholder="20%"
                      className="w-full px-3 py-2 border rounded-md outline-none focus:border-gray-400 percentage-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="flex flex-col gap-4 ml-[25px]">
                    <div className="flex items-center">
                      <span className="mr-3 text-[#201D1E] tax-toggle-caption">
                        Enable to Refundable
                      </span>
                      <div
                        className={`tax-toggle-switch ${
                          isRefundable ? "active" : ""
                        }`}
                        onClick={handleRefundableToggle}
                      >
                        <div className="tax-toggle-circle"></div>
                      </div>
                    </div>
                    <button className="bg-[#2892CE] py-2 hover:bg-[#076094] transition-colors tax-form-save-btn ml-[25px] mb-2">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Add Tax Button */}
              <button className="ml-auto mt-[32px] hover:bg-blue-50 transition-colors flex items-center justify-center tax-form-add-btn">
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
              <th className="px-5 w-[74px] text-left charges-thead charges-id-column">ID</th>
              <th className="px-3 text-center charges-thead charges-date-column">DATE</th>
              <th className="px-5 text-right charges-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((charge) => (
              <React.Fragment key={charge.id}>
                <tr
                  className={`${
                    expandedRows[charge.id] ? "mobile-no-border" : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left charges-data">{charge.id}</td>
                  <td className="px-3 text-center charges-data charges-date-column">{charge.date}</td>
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
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="mb-[10px]">
                            <div className="dropdown-label">NAME</div>
                            <div className="dropdown-value">{charge.name}</div>
                          </div>
                          <div>
                            <div className="dropdown-label">CHARGE TYPE</div>
                            <div className="dropdown-value">{charge.chargeType}</div>
                          </div>
                          <div>
                            <div className="dropdown-label">ACTION</div>
                            <div className="dropdown-value flex items-center gap-4 p-[5px]">
                              <button onClick={() => openUpdateModal(charge)}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deleteicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div></div> {/* Empty cell for 2x2 grid */}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
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

      {/* Modals */}
      <CreateChargesModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
      <UpdateChargesModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        charge={selectedCharge}
      />
    </div>
  );
};

export default Charges;
