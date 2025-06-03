import React, { useState } from "react";
import "./AdditionalCharges.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../assets/Images/Additional Charges/plus-icon.svg";
import downloadicon from "../../assets/Images/Additional Charges/download-icon.svg";
import editicon from "../../assets/Images/Additional Charges/edit-icon.svg";
import deleteicon from "../../assets/Images/Additional Charges/delete-icon.svg";
import downarrow from "../../assets/Images/Additional Charges/downarrow.svg";
import { useModal } from "../../context/ModalContext";

const AdminAdditionalCharges = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "#834",
      chargeId: "Rent",
      date: "24 Nov 2024",
      amountDue: "300.00",
      reason: "Monthly Rent",
      dueDate: "24 Nov 2024",
      status: "Paid",
    },
    {
      id: "#835",
      chargeId: "Rent",
      date: "24 Nov 2024",
      amountDue: "300.00",
      reason: "Monthly Rent",
      dueDate: "24 Nov 2024",
      status: "Paid",
    },
    {
      id: "#836",
      chargeId: "Rent",
      date: "24 Nov 2024",
      amountDue: "300.00",
      reason: "Monthly Rent",
      dueDate: "24 Nov 2024",
      status: "Paid",
    },
    {
      id: "#837",
      chargeId: "Rent",
      date: "24 Nov 2024",
      amountDue: "300.00",
      reason: "Monthly Rent",
      dueDate: "24 Nov 2024",
      status: "Paid",
    },
    {
      id: "#838",
      chargeId: "Rent",
      date: "24 Nov 2024",
      amountDue: "300.00",
      reason: "Monthly Rent",
      dueDate: "24 Nov 2024",
      status: "Paid",
    },
  ];

  const filteredData = demoData.filter(
    (charges) =>
      charges.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.chargeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.amountDue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.dueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charges.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // const openUpdateModal = (charge) => {
  //   openModal("update-additional-charges", charge);
  // };

  const handleEditClick = (charges) => {
    console.log("ID Types: Selected IdType:", charges);
    openModal("update-additional-charges", "Update Additional Charges", charges);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md admin-add-charges-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] admin-add-charges-table-header">
        <h1 className="admin-add-charges-head">Additional Charges</h1>
        <div className="flex flex-col md:flex-row gap-[10px] admin-add-charges-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md md:w-[302px] focus:border-gray-300 duration-200 admin-add-charges-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 admin-add-charges-selection"
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
          <div className="flex gap-[10px] admin-add-charges-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md admin-add-charges-btn duration-200 md:w-[169px]"
              onClick={() => openModal("create-additional-charges")}
            >
              Add Charges
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 admin-add-charges-download-btn w-[122px]">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] admin-add-charges-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="admin-add-charges-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left admin-add-charges-thead">ID</th>
              <th className="px-5 text-left admin-add-charges-thead">
                CHARGE ID
              </th>
              <th className="pl-5 text-left admin-add-charges-thead">DATE</th>
              <th className="pl-5 text-left admin-add-charges-thead">
                AMOUNT DUE
              </th>
              <th className="px-5 text-left admin-add-charges-thead">REASON</th>
              <th className="px-5 text-left admin-add-charges-thead">
                DUE DATE
              </th>
              <th className="px-5 text-left admin-add-charges-thead w-[68px]">
                STATUS
              </th>
              <th className="px-5 pr-6 text-right admin-add-charges-thead">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((charges, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left admin-add-charges-data">
                  {charges.id}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charges.chargeId}
                </td>
                <td className="pl-5 text-left admin-add-charges-data">
                  {charges.date}
                </td>
                <td className="pl-5 text-left admin-add-charges-data">
                  {charges.amountDue}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charges.reason}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  {charges.dueDate}
                </td>
                <td className="px-5 text-left admin-add-charges-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                      charges.status === "Paid"
                        ? "bg-[#28C76F29] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {charges.status}
                  </span>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={() => handleEditClick(charges)}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={deleteicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
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
            <tr className="admin-add-charges-table-row-head">
              <th className="px-5 w-[35%] text-left admin-add-charges-thead admin-add-charges-id-column">
                ID
              </th>
              <th className="px-[10px] w-[30%] text-left admin-add-charges-thead admin-add-charges-charge-id-column">
                CHARGE ID
              </th>
              <th className="px-[10px] w-[20%] text-left admin-add-charges-thead admin-add-charges-date-column">
                DATE
              </th>
              <th className="px-5 w-[15%] text-right admin-add-charges-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((charges, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[charges.id + index]
                      ? "admin-add-charges-mobile-no-border"
                      : "admin-add-charges-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left admin-add-charges-data admin-add-charges-id-column">
                    {charges.id}
                  </td>
                  <td className="px-[10px] text-left admin-add-charges-data admin-add-charges-charge-id-column">
                    {charges.chargeId}
                  </td>
                  <td className="px-[10px] text-left admin-add-charges-data admin-add-charges-date-column">
                    {charges.date}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`admin-add-charges-dropdown-field ${
                        expandedRows[charges.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(charges.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`admin-add-charges-dropdown-img ${
                          expandedRows[charges.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[charges.id + index] && (
                  <tr className="admin-add-charges-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={4} className="px-5">
                      <div className="admin-add-charges-dropdown-content">
                        <div className="admin-add-charges-dropdown-grid">
                          <div className="admin-add-charges-dropdown-item w-[30%]">
                            <div className="admin-add-charges-dropdown-label">
                              AMOUNT DUE
                            </div>
                            <div className="admin-add-charges-dropdown-value">
                              {charges.amountDue}
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-item label-reason w-[30%]">
                            <div className="admin-add-charges-dropdown-label">
                              REASON
                            </div>
                            <div className="admin-add-charges-dropdown-value">
                              {charges.reason}
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-item label-due w-[35%]">
                            <div className="admin-add-charges-dropdown-label">
                              DUE DATE
                            </div>
                            <div className="admin-add-charges-dropdown-value">
                              {charges.dueDate}
                            </div>
                          </div>
                        </div>
                        <div className="admin-add-charges-dropdown-grid">
                          <div className="admin-add-charges-dropdown-item w-[30%]">
                            <div className="admin-add-charges-dropdown-label">
                              STATUS
                            </div>
                            <div className="admin-add-charges-dropdown-value">
                              <span
                                className={`admin-add-charges-status ${
                                  charges.status === "Paid"
                                    ? "bg-[#28C76F29] text-[#28C76F]"
                                    : "bg-[#FFE1E1] text-[#C72828]"
                                }`}
                              >
                                {charges.status}
                              </span>
                            </div>
                          </div>
                          <div className="admin-add-charges-dropdown-item w-[67%] label-action">
                            <div className="admin-add-charges-dropdown-label">
                              ACTION
                            </div>
                            <div className="admin-add-charges-dropdown-value flex items-center gap-4">
                              <button onClick={() => handleEditClick(charges)}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deleteicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] admin-add-charges-action-btn duration-200"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
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

export default AdminAdditionalCharges;
