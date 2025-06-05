import React, { useState } from "react";
import "./TenancyReport.css";
import { ChevronDown } from "lucide-react";
import downarrow from "../../assets/Images/Tenancy Report/downarrow.svg";
import CustomDropDown from "../../components/CustomDropDown";

const TenancyReport = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

  const [selectedOption, setSelectedOption] = useState("showing");

  const demoData = [
    {
      id: "TC0018-1",
      name: "Shoes shop",
      description: "عبدالعزيز بن",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      createdDate: "09 Sept 2024",
      hireStart: "09 Sept 2024",
      hireEnd: "09 Sept 2024",
      rental: "12",
      rent: "120.00",
      payment: "12",
      status: "Occupied",
    },
    {
      id: "TC0018-2",
      name: "Shoes shop",
      description: "عبدالعزيز بن",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      createdDate: "09 Sept 2024",
      hireStart: "09 Sept 2024",
      hireEnd: "09 Sept 2024",
      rental: "12",
      rent: "120.00",
      payment: "12",
      status: "Occupied",
    },
    {
      id: "TC0018-3",
      name: "Shoes shop",
      description: "عبدالعزيز بن",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      createdDate: "09 Sept 2024",
      hireStart: "09 Sept 2024",
      hireEnd: "09 Sept 2024",
      rental: "12",
      rent: "120.00",
      payment: "12",
      status: "Occupied",
    },
    {
      id: "TC0018-4",
      name: "Shoes shop",
      description: "عبدالعزيز بن",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      createdDate: "09 Sept 2024",
      hireStart: "09 Sept 2024",
      hireEnd: "09 Sept 2024",
      rental: "12",
      rent: "120.00",
      payment: "12",
      status: "Occupied",
    },
    {
      id: "TC0018-5",
      name: "Shoes shop",
      description: "عبدالعزيز بن",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      createdDate: "09 Sept 2024",
      hireStart: "09 Sept 2024",
      hireEnd: "09 Sept 2024",
      rental: "12",
      rent: "120.00",
      payment: "12",
      status: "Occupied",
    },
  ];

  const filteredData = demoData.filter(
    (report) =>
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.createdDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.hireStart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.hireEnd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.rental.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.rent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="border border-[#E9E9E9] rounded-md tenancy-report-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-report-header">
        <h1 className="tenancy-report-head">Tenant Report</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-report-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 tenancy-report-search"
          />
          <div className="flex gap-[10px] tenancy-report-secondary-inputs">
            <div className="relative w-[60%] md:w-auto">
              <CustomDropDown
                options={dropdownOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 tenancy-report-selection"
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-[132px] h-[38px] rounded-md duration-200 report-export-btn">
              Export To Excel
            </button>
          </div>
        </div>
      </div>
      <div className="tenancy-report-desktop-only overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                ID
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                NAME
              </th>
              <th className="pl-5 text-left tenancy-report-thead whitespace-nowrap">
                DESCRIPTION
              </th>
              <th className="pl-5 text-left tenancy-report-thead whitespace-nowrap">
                BUILDING
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                UNIT
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                CREATED
                <br />
                DATE
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                HIRE START
                <br />
                DATE
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                HIRE END
                <br />
                DATE
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                RENTAL
                <br />
                MONTHS
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                RENT/
                <br />
                MONTH
              </th>
              <th className="px-5 text-left tenancy-report-thead whitespace-nowrap">
                NO.OF
                <br />
                PAYMENTS
              </th>
              <th className="px-5 pr-6 text-center tenancy-report-thead whitespace-nowrap">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.id}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.name}
                </td>
                <td className="pl-5 text-left tenancy-report-data">
                  {report.description}
                </td>
                <td className="pl-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.building}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.unit}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.createdDate}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.hireStart}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.hireEnd}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.rental}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.rent}
                </td>
                <td className="px-5 text-left tenancy-report-data whitespace-nowrap">
                  {report.payment}
                </td>
                <td className="px-5 text-center tenancy-report-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenancy-report-status ${
                      report.status === "Pending"
                        ? "bg-[#E8EFF6] text-[#1458A2]"
                        : "bg-[#E8EFF6] text-[#1458A2]"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="tenancy-report-table-row-head">
              <th className="px-5 w-[50%] text-left tenancy-report-thead tenancy-report-id-column">
                ID
              </th>
              <th className="px-3 w-[50%] text-left tenancy-report-thead tenancy-report-name-column">
                NAME
              </th>
              <th className="px-5 text-right tenancy-report-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report) => (
              <React.Fragment key={report.id}>
                <tr
                  className={`${
                    expandedRows[report.id]
                      ? "tenancy-report-mobile-no-border"
                      : "tenancy-report-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-report-data tenancy-report-id-column">
                    {report.id}
                  </td>
                  <td className="px-3 text-left tenancy-report-data tenancy-report-name-column">
                    {report.name}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-report-dropdown-field ${
                        expandedRows[report.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(report.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenancy-report-dropdown-img ${
                          expandedRows[report.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[report.id] && (
                  <tr className="tenancy-report-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="tenancy-report-dropdown-content">
                        <div className="tenancy-report-grid">
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              DESCRIPTION
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.description}
                            </div>
                          </div>
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              BUILDING
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.building}
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-report-grid">
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              UNIT
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.unit}
                            </div>
                          </div>
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              CREATED DATE
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.createdDate}
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-report-grid">
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              HIRE START DATE
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.hireStart}
                            </div>
                          </div>
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              HIRE END DATE
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.hireEnd}
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-report-grid">
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              RENTAL MONTHS
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.rental}
                            </div>
                          </div>
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              RENT/MONTH
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.rent}
                            </div>
                          </div>
                        </div>
                        <div className="tenancy-report-grid">
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              NO.OF PAYMENTS
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              {report.payment}
                            </div>
                          </div>
                          <div className="tenancy-report-grid-item">
                            <div className="tenancy-report-dropdown-label">
                              STATUS
                            </div>
                            <div className="tenancy-report-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] h-[24px] rounded-[4px] tenancy-report-status ${
                                  report.status === "Pending"
                                    ? "bg-[#E8EFF6] text-[#1458A2]"
                                    : "bg-[#E8EFF6] text-[#1458A2]"
                                }`}
                              >
                                {report.status}
                              </span>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tenancy-report-pagination-container">
        <span className="tenancy-report-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tenancy-report-pagination-buttons">
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

export default TenancyReport;
