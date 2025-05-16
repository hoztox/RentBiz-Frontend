import React, { useState } from "react";
import "./Translate.css";
import { ChevronDown } from "lucide-react";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";

const Translate = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "#311",
      variable: "test",
    },
    {
      id: "#312",
      variable: "test",
    },
    {
      id: "#313",
      variable: "test",
    },
    {
      id: "#314",
      variable: "test",
    },
    {
      id: "#315",
      variable: "test",
    },
    {
      id: "#316",
      variable: "test",
    },
    {
      id: "#317",
      variable: "test",
    },
    {
      id: "#318",
      variable: "test",
    },
    {
      id: "#319",
      variable: "test",
    },
    {
      id: "#31",
      variable: "test",
    },
  ];

  const filteredData = demoData.filter(
    (translate) =>
      translate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translate.variable.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="border border-[#E9E9E9] rounded-md translate-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] translate-table-header">
        <h1 className="translate-head">Translation</h1>
        <div className="flex flex-col md:flex-row gap-[10px] translate-inputs-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] h-[38px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 translate-search"
          />
          <div className="flex flex-row gap-[10px] w-full md:w-auto second-row-container">
            <div className="relative flex-1 md:flex-none w-[45%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none h-[38px] px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 translate-selection"
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
            <button className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md update-btn duration-200">
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="desktop-only">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-4 text-left translate-thead whitespace-nowrap w-[90px]">
                ID
              </th>
              <th className="px-4 text-left translate-thead whitespace-nowrap w-[189px]">
                VARIABLE
              </th>
              <th className="px-4 text-left translate-thead whitespace-nowrap w-[1128px]">
                ENGLISH
              </th>
              <th className="px-4 text-left translate-thead whitespace-nowrap w-[1128px]">
                ARABIC
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((translate, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 text-left translate-data w-[90px]">
                  {translate.id}
                </td>
                <td className="px-4 text-left translate-data w-[189px]">
                  {translate.variable}
                </td>
                <td className="px-4 text-left translate-data w-[1128px]">
                  <input
                    type="text"
                    placeholder="Test"
                    className="w-full border border-[#E9E9E9] px-3 py-2 custom-input"
                  />
                </td>
                <td className="px-4 text-left translate-data">
                  <input
                    type="text"
                    placeholder="امتحان"
                    className="w-full border border-[#E9E9E9] px-3 py-2 text-right custom-input"
                    dir="rtl"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="translate-table-row-head">
              <th className="px-5 w-[50%] text-left translate-thead translate-id-column">
                ID
              </th>
              <th className="px-5 w-[47%] text-left translate-thead variable-column">
                VARIABLE
              </th>
              <th className="px-5 text-right translate-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((translate) => (
              <React.Fragment key={translate.id}>
                <tr
                  className={`${
                    expandedRows[translate.id]
                      ? "mobile-no-border"
                      : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left translate-data">{translate.id}</td>
                  <td className="px-5 text-left translate-data variable-column">
                    {translate.variable}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`translate-dropdown-field ${
                        expandedRows[translate.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(translate.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`translate-dropdown-img ${
                          expandedRows[translate.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[translate.id] && (
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="translate-dropdown-content">
                        <div className="translate-grid">
                          <div className="translate-grid-items">
                            <div className="dropdown-label">ENGLISH</div>
                            <div className="dropdown-value">
                              <input
                                type="text"
                                placeholder="Test"
                                className="w-full border border-[#E9E9E9] px-[14px] py-[7px] custom-input"
                              />
                            </div>
                          </div>
                          <div className="translate-grid-items">
                            <div className="dropdown-label">ARABIC</div>
                            <div className="dropdown-value">
                              <input
                                type="text"
                                placeholder="امتحان"
                                className="w-full border border-[#E9E9E9] px-[14px] py-[7px] text-right custom-input"
                                dir="rtl"
                              />
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
          {startPage > 2 && (
            <span className="px-2 flex items-center">...</span>
          )}
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

export default Translate;
