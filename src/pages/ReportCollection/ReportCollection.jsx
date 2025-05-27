import React, { useState, useRef, useEffect } from "react";
import "./reportcollection.css";
import { ChevronDown } from "lucide-react";
import downarrow from "../../assets/Images/CollectionReport/downarrow.svg";

const ReportCollection = () => {
  const [openSelectKey, setOpenSelectKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    payment: "",
    start_date: "",
    end_date: "",
  });
  const [tempFilters, setTempFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    payment: "",
    start_date: "",
    end_date: "",
  });
  const [expandedRows, setExpandedRows] = useState({});

  // Reference to the date range dropdown
  const dateRangeRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openSelectKey === "date_range" &&
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenSelectKey(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectKey]);

  const itemsPerPage = 10;

  const demoData = [
    {
      id: "B24090001",
      tenancy: "TC0013-1",
      date: "09 sept 2024  ",
      tenant: "Coffee",
      building: "Emaar Square Area",
      unit: "SHOP10",
      amount: "120.00",
      remark: "Anonymous",
      payment: "Cash",
    },
    {
      id: "B24090002",
      tenancy: "TC0013-1",
      date: "09 sept 2024  ",
      tenant: "Shoes shop",
      building: "Al Reem",
      unit: "SHOP11",
      amount: "120.00",
      remark: "Anonymous",
      payment: "Bank",
    },
    {
      id: "B24090003",
      tenancy: "TC0013-1",
      date: "09 sept 2024  ",
      tenant: "Coffee",
      building: "Down Town",
      unit: "SHOP10",
      amount: "120.00",
      remark: "Anonymous",
      payment: "Cash",
    },
    {
      id: "B24090004",
      tenancy: "TC0013-1",
      date: "09 sept 2024  ",
      tenant: "Shoes shop",
      building: "Al Reem",
      unit: "SHOP11",
      amount: "120.00",
      remark: "Anonymous",
      payment: "Bank",
    },
  ];

  const getUnique = (key) => [...new Set(demoData.map((item) => item[key]))];

  const uniqueIds = getUnique("id");
  const uniqueTenants = getUnique("tenant");
  const uniqueBuildings = getUnique("building");
  const uniqueUnits = getUnique("unit");
  const uniquePayments = getUnique("payment");

  const clearFilters = () => {
    const cleared = {
      id: "",
      tenant: "",
      building: "",
      unit: "",
      payment: "",
      start_date: "",
      end_date: "",
    };
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const filteredData = demoData.filter((report) => {
    const matchesSearch = Object.values(report).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters =
      (!filters.id || report.id === filters.id) &&
      (!filters.tenant || report.tenant === filters.tenant) &&
      (!filters.building || report.building === filters.building) &&
      (!filters.unit || report.unit === filters.unit) &&
      (!filters.payment || report.payment === filters.payment) &&
      (!filters.start_date ||
        new Date(report.date) >= new Date(filters.start_date)) &&
      (!filters.end_date ||
        new Date(report.date) <= new Date(filters.end_date));

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Toggle date range dropdown
  const toggleDateRange = () => {
    setOpenSelectKey(openSelectKey === "date_range" ? null : "date_range");
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md report-collection-table">
      <div className="flex justify-between items-center p-5 report-collection-table-header">
        <h1 className="report-collection-head">Collection Report</h1>
        <div className="flex flex-col md:flex-row gap-[10px] report-collection-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 report-collection-search"
            />
            <div className="relative w-[45%] md:w-auto">
              <select
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 report-collection-selection"
                onFocus={() => setOpenSelectKey("showing")}
                onBlur={() => setOpenSelectKey(null)}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  openSelectKey === "showing" ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
          <div className="flex gap-[10px] report-collection-action-buttons-container">
            <div className="relative w-[55%] md:w-auto">
              <select
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 report-collection-selection"
                onFocus={() => setOpenSelectKey("filter")}
                onBlur={() => setOpenSelectKey(null)}
              >
                <option value="filter">Filter</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  openSelectKey === "filter" ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-[89%] md:w-[132px] rounded-md duration-200 report-collection-export-btn">
              Export To Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-[#E9E9E9] report-collection-desktop-only mt-[-20px]">
        <div className="flex items-center justify-between">
          <div className="flex gap-[10px] flexBars-wrap">
            {[
              ["id", "All Tenancy", uniqueIds],
              ["tenant", "All Tenants", uniqueTenants],
              ["building", "All Buildings", uniqueBuildings],
              ["unit", "All Units", uniqueUnits],
              ["payment", "All Payments", uniquePayments],
            ].map(([key, label, options]) => (
              <div key={key} className="relative">
                <select
                  name={key}
                  className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer focus:border-gray-300 duration-200 report-collection-selection"
                  value={tempFilters[key]}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  onFocus={() => setOpenSelectKey(key)}
                  onBlur={() => setOpenSelectKey(null)}
                >
                  <option value="">{label}</option>
                  {options.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute left-[105px] top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                    openSelectKey === key ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            ))}
            <div className="relative" ref={dateRangeRef}>
              <div
                className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between report-collection-selection"
                onClick={toggleDateRange}
              >
                Date Range
                <ChevronDown
                  className={`ml-2 transition-transform duration-300 ${
                    openSelectKey === "date_range" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              {openSelectKey === "date_range" && (
                <div className="absolute z-10 bg-white p-4 mt-1 border border-gray-300 rounded-md shadow-md w-[250px]">
                  <label className="block text-sm mb-1 filter-btn">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempFilters.start_date}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mb-3 outline-none"
                  />
                  <label className="block text-sm mb-1 filter-btn">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempFilters.end_date}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        end_date: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-[10px]">
            <button
              onClick={() => {
                setFilters(tempFilters);
                setCurrentPage(1);
              }}
              className="bg-[#201D1E] text-white w-[105px] h-[38px] rounded-md hover:bg-[#F0F0F0] hover:text-[#201D1E] duration-200 filter-btn"
            >
              Filter
            </button>
            <button
              onClick={clearFilters}
              className="w-[105px] h-[38px] bg-[#F0F0F0] text-[#4D4E4D] rounded-md clear-btn hover:bg-[#201D1E] hover:text-white duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="report-collection-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left report-collection-thead">ID</th>
              <th className="px-5 text-left report-collection-thead">DATE</th>
              <th className="px-5 text-left report-collection-thead">
                TENANCY
              </th>
              <th className="px-5 text-left report-collection-thead">TENANT</th>
              <th className="px-5 text-left report-collection-thead">
                BUILDING
              </th>
              <th className="px-5 text-left report-collection-thead">UNIT</th>
              <th className="px-5 text-left report-collection-thead">AMOUNT</th>
              <th className="px-5 text-left report-collection-thead">REMARK</th>
              <th className="px-5 text-center report-collection-thead">
                PAYMENT METHOD
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report) => (
              <tr
                key={report.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 report-collection-data">{report.id}</td>
                <td className="px-5 report-collection-data">{report.date}</td>
                <td className="px-5 report-collection-data">
                  {report.tenancy}
                </td>
                <td className="px-5 report-collection-data">{report.tenant}</td>
                <td className="px-5 report-collection-data">
                  {report.building}
                </td>
                <td className="px-5 report-collection-data">{report.unit}</td>
                <td className="px-5 report-collection-data">{report.amount}</td>
                <td className="px-5 report-collection-data">{report.remark}</td>
                <td className="px-5 text-center report-collection-data">
                  {report.payment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="report-collection-table-row-head">
              <th className="px-5 w-[50%] text-left report-collection-thead report-collection-id-column">
                ID
              </th>
              <th className="px-3 w-[50%] text-left report-collection-thead report-collection-tenant-column">
                BUILDING
              </th>
              <th className="px-5 text-right report-collection-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report) => (
              <React.Fragment key={report.id}>
                <tr
                  className={`${
                    expandedRows[report.id]
                      ? "report-collection-mobile-no-border"
                      : "report-collection-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left w-[50%] report-collection-data report-collection-id-column">
                    {report.id}
                  </td>
                  <td className="px-3 text-left w-[50%] report-collection-data report-collection-tenant-column">
                    {report.building}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`report-collection-dropdown-field ${
                        expandedRows[report.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(report.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`report-collection-dropdown-img ${
                          expandedRows[report.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[report.id] && (
                  <tr className="report-collection-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="report-collection-dropdown-content">
                        <div className="report-collection-grid">
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              DATE
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.date}
                            </div>
                          </div>
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              TENANCY
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.tenancy}
                            </div>
                          </div>
                        </div>
                        <div className="report-collection-grid">
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              TENANT 
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.tenant}
                            </div>
                          </div>
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              UNIT
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.unit}
                            </div>
                          </div>
                        </div>
                        <div className="report-collection-grid">
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              AMOUNT
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.amount}
                            </div>
                          </div>
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              REMARK
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.remark}
                            </div>
                          </div>
                        </div>
                        <div className="report-collection-grid">
                          <div className="report-collection-grid-item">
                            <div className="report-collection-dropdown-label">
                              PAYMENT METHOD
                            </div>
                            <div className="report-collection-dropdown-value">
                              {report.payment}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 report-collection-pagination-container">
        <span className="report-collection-pagination collection-list-pagination">
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
export default ReportCollection;
