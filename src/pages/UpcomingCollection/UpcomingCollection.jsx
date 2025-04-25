import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./upcomingcollection.css";

const UpcomingCollection = () => {
  const [openSelectKey, setOpenSelectKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [tempFilters, setTempFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    status: "",
    start_date: "",
    end_date: "",
  });

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
      id: "TC0019-1",
      invoice_no: "457893",
      invoice_date: "2024-09-09",
      tenant: "Coffee",
      building: "Down Town",
      unit: "SHOP10",
      charge: "Rent",
      amount: "120.00",
      due_date: "2024-09-15",
      status: "Paid",
    },
    {
      id: "TC0020-1",
      invoice_no: "457894",
      invoice_date: "2024-09-10",
      tenant: "anonymous",
      building: "Al Reem",
      unit: "SHOP11",
      charge: "Rent",
      amount: "120.00",
      due_date: "2024-09-18",
      status: "Unpaid",
    },
  ];

  const getUnique = (key) => [...new Set(demoData.map((item) => item[key]))];

  const uniqueIds = getUnique("id");
  const uniqueTenants = getUnique("tenant");
  const uniqueBuildings = getUnique("building");
  const uniqueUnits = getUnique("unit");
  const uniqueStatuses = getUnique("status");

  const clearFilters = () => {
    const cleared = {
      id: "",
      tenant: "",
      building: "",
      unit: "",
      status: "",
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
      (!filters.status || report.status === filters.status) &&
      (!filters.start_date ||
        new Date(report.invoice_date) >= new Date(filters.start_date)) &&
      (!filters.end_date ||
        new Date(report.due_date) <= new Date(filters.end_date));

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

  // Helper function to get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-[#28C76F20] text-[#34A853]";
      case "Unpaid":
        return "bg-[#FFF7F6] text-[#FF725E]";
      case "Overdue":
        return "bg-[#FEF7E0] text-[#FBBC04]";
      default:
        return "bg-[#E8EFF6] text-[#1458A2]";
    }
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md">
      <div className="p-5 border-b border-[#E9E9E9]">
        <div className="flex justify-between items-center pb-5">
          <h1 className="upcoming-collection-head">
            Upcoming Collection Report
          </h1>
          <div className="flex gap-[10px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 upcoming-collection-search"
            />
            <div className="relative">
              <select
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 upcoming-collection-selection"
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
            <button className="flex items-center justify-center gap-2 w-[132px] h-[38px] rounded-md duration-200 export-btn">
              Export To Excel
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-[10px] flex-wrap">
            {[
              ["id", "All Tenancy", uniqueIds],
              ["tenant", "All Tenants", uniqueTenants],
              ["building", "All Buildings", uniqueBuildings],
              ["unit", "All Units", uniqueUnits],
              ["status", "All Status", uniqueStatuses],
            ].map(([key, label, options]) => (
              <div key={key} className="relative">
                <select
                  name={key}
                  className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer focus:border-gray-300 duration-200 upcoming-collection-selection"
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

            {/* Date Range Filter - Changed to use click instead of focus/blur */}
            <div className="relative" ref={dateRangeRef}>
              <div
                className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between upcoming-collection-selection"
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

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#E9E9E9] h-[57px]">
            <th className="px-5 text-left upcoming-collection-thead">ID</th>
            <th className="px-5 text-left upcoming-collection-thead">
              INVOICE NO
            </th>
            <th className="px-5 text-left upcoming-collection-thead">
              INVOICE DATE
            </th>
            <th className="px-5 text-left upcoming-collection-thead">TENANT</th>
            <th className="px-5 text-left upcoming-collection-thead">
              BUILDING
            </th>
            <th className="px-5 text-left upcoming-collection-thead">UNIT</th>
            <th className="px-5 text-left upcoming-collection-thead">CHARGE</th>
            <th className="px-5 text-left upcoming-collection-thead">AMOUNT</th>
            <th className="px-5 text-left upcoming-collection-thead">
              DUE DATE
            </th>
            <th className="px-5 text-center upcoming-collection-thead">
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
              <td className="px-5 upcoming-collection-data">{report.id}</td>
              <td className="px-5 upcoming-collection-data">
                {report.invoice_no}
              </td>
              <td className="px-5 upcoming-collection-data">
                {report.invoice_date}
              </td>
              <td className="px-5 upcoming-collection-data">{report.tenant}</td>
              <td className="px-5 upcoming-collection-data">
                {report.building}
              </td>
              <td className="px-5 upcoming-collection-data">{report.unit}</td>
              <td className="px-5 upcoming-collection-data">{report.charge}</td>
              <td className="px-5 upcoming-collection-data">{report.amount}</td>
              <td className="px-5 upcoming-collection-data">
                {report.due_date}
              </td>
              <td className="px-5 text-center upcoming-collection-data">
                <span
                  className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${getStatusStyle(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center h-[77.5px] px-5">
        <span className="collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 pagination-btn"
          >
            Previous
          </button>
          {[...Array(endPage - startPage + 1)].map((_, i) => {
            const page = startPage + i;
            return (
              <button
                key={page}
                className={`px-4 h-[38px] rounded-md duration-200 ${
                  page === currentPage
                    ? "bg-[#1458A2] text-white"
                    : "bg-[#F4F4F4] text-[#8a94a3] hover:bg-[#e6e6e6]"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingCollection;
