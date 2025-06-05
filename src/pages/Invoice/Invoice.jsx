import React, { useState } from "react";
import "./Invoice.css";
import plusicon from "../../assets/Images/Invoice/plus-icon.svg";
import downloadicon from "../../assets/Images/Invoice/download-icon.svg";
import deleteicon from "../../assets/Images/Invoice/delete-icon.svg";
import viewicon from "../../assets/Images/Invoice/view-icon.svg";
import downarrow from "../../assets/Images/Invoice/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import CustomDropDown from "../../components/CustomDropDown";

const Invoice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const { openModal } = useModal();
  const itemsPerPage = 10;

  // Dropdown options for CustomDropDown
  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" }
  ];

  // State for selected dropdown value
  const [selectedOption, setSelectedOption] = useState("showing");

  const demoData = [
    {
      id: "INV2412001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Pharmacy",
      amountDue: "300.00",
      view: viewicon,
    },
    {
      id: "INV2412001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Pharmacy",
      amountDue: "300.00",
      view: viewicon,
    },
    {
      id: "INV2412001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Pharmacy",
      amountDue: "300.00",
      view: viewicon,
    },
    {
      id: "INV2412001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Pharmacy",
      amountDue: "300.00",
      view: viewicon,
    },
    {
      id: "INV2412001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Pharmacy",
      amountDue: "300.00",
      view: viewicon,
    },
  ];

  const filteredData = demoData.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenancyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amountDue.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="border border-[#E9E9E9] rounded-md inv-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] inv-table-header">
        <h1 className="inv-head">Invoice List</h1>
        <div className="flex flex-col md:flex-row gap-[10px] inv-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 inv-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 inv-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] inv-action-buttons-container w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md inv-add-invoice duration-200 w-[176px]"
              onClick={() => openModal("create-invoice")}
            >
              Add New Invoice
              <img src={plusicon} alt="plus icon" className="relative right-[5px] md:right-0 w-[15px] h-[15px]" />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 inv-download-btn w-[122px]">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] inv-download-img"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="inv-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left inv-thead">ID</th>
              <th className="px-5 text-left inv-thead">DATE</th>
              <th className="pl-5 text-left inv-thead">TENANCY ID</th>
              <th className="pl-5 text-left inv-thead">TENANT NAME</th>
              <th className="px-5 text-left inv-thead w-[10%]">AMOUNT DUE</th>
              <th className="pl-12 pr-5 text-center inv-thead">VIEW</th>
              <th className="px-5 pr-6 text-right inv-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left inv-data">{invoice.id}</td>
                <td className="px-5 text-left inv-data">{invoice.date}</td>
                <td className="pl-5 text-left inv-data">{invoice.tenancyId}</td>
                <td className="pl-5 text-left inv-data">{invoice.tenantName}</td>
                <td className="px-5 text-left inv-data">{invoice.amountDue}</td>
                <td className="pl-14 text-center pr-5 pt-2">
                  <button onClick={() => openModal("view-invoice")}>
                    <img
                      src={invoice.view}
                      alt="View"
                      className="w-[30px] h-[24px] inv-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex items-center justify-end h-[57px]">
                  <button>
                    <img
                      src={deleteicon}
                      alt="Delete"
                      className="w-[18px] h-[18px] inv-action-btn duration-200 mr-[24px]"
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
            <tr className="inv-table-row-head">
              <th className="px-5 text-left inv-thead inv-id-column">ID</th>
              <th className="px-5 text-left inv-thead inv-date-column">TENANT NAME</th>
              <th className="px-5 text-right inv-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((invoice, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[invoice.id + index] ? "inv-mobile-no-border" : "inv-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left inv-data inv-id-column">{invoice.id}</td>
                  <td className="px-5 text-left inv-data inv-date-column">{invoice.tenantName}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`inv-dropdown-field ${
                        expandedRows[invoice.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(invoice.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`inv-dropdown-img ${
                          expandedRows[invoice.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[invoice.id + index] && (
                  <tr className="inv-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="inv-dropdown-content">
                        <div className="inv-dropdown-content-grid">
                          <div className="inv-dropdown-content-item w-[50%]">
                            <div className="inv-dropdown-label">TENANCY ID</div>
                            <div className="inv-dropdown-value">{invoice.tenancyId}</div>
                          </div>
                          <div className="inv-dropdown-content-item w-[50%]">
                            <div className="inv-dropdown-label">DATE</div>
                            <div className="inv-dropdown-value">{invoice.date}</div>
                          </div>
                        </div>
                        <div className="inv-dropdown-content-grid">
                          <div className="inv-dropdown-content-item w-[50%]">
                            <div className="inv-dropdown-label">AMOUNT DUE</div>
                            <div className="inv-dropdown-value">{invoice.amountDue}</div>
                          </div>
                          <div className="inv-dropdown-content-item w-[25%]">
                            <div className="inv-dropdown-label">VIEW</div>
                            <div className="inv-dropdown-value">
                              <button onClick={() => openModal("view-invoice")}>
                                <img
                                  src={invoice.view}
                                  alt="View"
                                  className="w-[30px] h-[24px] inv-action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="inv-dropdown-content-item w-[25%]">
                            <div className="inv-dropdown-label">ACTION</div>
                            <div className="inv-dropdown-value flex items-center gap-4">
                              <button>
                                <img
                                  src={deleteicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] inv-action-btn duration-200"
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

      {/* Pagination Section */}
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

export default Invoice;