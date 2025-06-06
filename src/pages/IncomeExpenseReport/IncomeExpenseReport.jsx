import React, { useState, useRef, useEffect } from "react";
import "./IncomeExpenseReport.css";
import { ChevronDown } from "lucide-react";
import downarrow from "../../assets/Images/IncomeExpenseReport/downarrow.svg";
import CustomDropDown from "../../components/CustomDropDown";

const IncomeExpenseReport = () => {
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
  const [expandedRows, setExpandedRows] = useState({});

  const dateRangeRef = useRef(null);

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
      id: "1",
      date: "09 Sept 2024",
      building: "Emaar Square Area",
      unit: "SHOP10",
      tenant: "Coffee",
      charge: "Deposit",
      invoice_no: "INV2410009",
      income_amount: "120.50",
      income_vat: "1.50",
      income_total: "122.00",
      expense_amount: "120.50",
      expense_vat: "1.50",
      expense_total: "122.00",
    },
    {
      id: "2",
      date: "09 Sept 2024",
      building: "Emaar Square Area",
      unit: "SHOP10",
      tenant: "Coffee",
      charge: "Deposit",
      invoice_no: "INV2410009",
      income_amount: "120.50",
      income_vat: "1.50",
      income_total: "122.00",
      expense_amount: "120.50",
      expense_vat: "1.50",
      expense_total: "122.00",
    },
    {
      id: "3",
      date: "09 Sept 2024",
      building: "Emaar Square Area",
      unit: "SHOP10",
      tenant: "Coffee",
      charge: "Deposit",
      invoice_no: "INV2410009",
      income_amount: "120.50",
      income_vat: "1.50",
      income_total: "122.00",
      expense_amount: "120.50",
      expense_vat: "1.50",
      expense_total: "122.00",
    },
  ];

  const getUnique = (key) => [...new Set(demoData.map((item) => item[key]))];

  const uniqueTenants = getUnique("tenant");
  const uniqueBuildings = getUnique("building");
  const uniqueUnits = getUnique("unit");

  // Dropdown options for "Showing"/"All"
  const showingOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
  ];

  // Dropdown options for "Filter"/"All"
  const filterOptions = [
    { value: "filter", label: "Filter" },
    { value: "all", label: "All" },
  ];

  // Dropdown options for filter fields
  const tenantOptions = [
    { value: "", label: "All Tenancy" },
    ...uniqueTenants.map((tenant) => ({ value: tenant, label: tenant })),
  ];
  const buildingOptions = [
    { value: "", label: "All Buildings" },
    ...uniqueBuildings.map((building) => ({
      value: building,
      label: building,
    })),
  ];
  const unitOptions = [
    { value: "", label: "All Units" },
    ...uniqueUnits.map((unit) => ({ value: unit, label: unit })),
  ];

  // State for selected dropdown values
  const [selectedShowing, setSelectedShowing] = useState("showing");
  const [selectedFilter, setSelectedFilter] = useState("filter");

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
    setSelectedShowing("showing");
    setSelectedFilter("filter");
  };

  const filteredData = demoData.filter((report) => {
    const matchesSearch = Object.values(report).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters =
      (!filters.tenant || report.tenant === filters.tenant) &&
      (!filters.building || report.building === filters.building) &&
      (!filters.unit || report.unit === filters.unit) &&
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
    <div className="border border-[#E9E9E9] rounded-md income-expense-table">
      <div className="flex justify-between items-center p-5 income-expense-table-header">
        <h1 className="income-expense-head">Income-Expense Report</h1>
        <div className="flex flex-col md:flex-row gap-[10px] income-expense-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 income-expense-search"
            />
            <div className="relative w-[45%] md:w-auto">
              <CustomDropDown
                options={showingOptions}
                value={selectedShowing}
                onChange={setSelectedShowing}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 income-expense-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] income-expense-action-buttons-container">
            <div className="relative w-[55%] md:w-auto">
              <CustomDropDown
                options={filterOptions}
                value={selectedFilter}
                onChange={setSelectedFilter}
                className="w-full md:w-[121px]"
                dropdownClassName="px-[14px] py-[7px] border-[#201D1E20] focus:border-gray-300 income-expense-selection"
              />
            </div>
            <button className="flex items-center justify-center gap-2 w-[89%] md:w-[132px] rounded-md duration-200 income-expense-export-btn">
              Export To Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-[#E9E9E9] mt-[-20px] income-expense-desktop-only">
        <div className="flex items-center justify-between">
          <div className="flex gap-[10px] flex-wrap">
            <div className="relative">
              <CustomDropDown
                options={tenantOptions}
                value={tempFilters.tenant}
                onChange={(value) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    tenant: value,
                  }))
                }
                className="w-[130px]"
                dropdownClassName="px-[7px] py-[7px] border-[#201D1E20] focus:border-gray-300 income-expense-selection h-[38px]"
              />
            </div>

            <div className="relative">
              <CustomDropDown
                options={buildingOptions}
                value={tempFilters.building}
                onChange={(value) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    building: value,
                  }))
                }
                dropdownClassName="px-[7px] py-[7px] w-[130px] border-[#201D1E20] focus:border-gray-300 income-expense-selection h-[38px]"
              />
            </div>

            <div className="relative">
              <CustomDropDown
                options={unitOptions}
                value={tempFilters.unit}
                onChange={(value) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    unit: value,
                  }))
                }
                className="w-[130px]"
                dropdownClassName="px-[7px] py-[7px] border-[#201D1E20] focus:border-gray-300 income-expense-selection h-[38px]"
              />
            </div>

            <div className="relative" ref={dateRangeRef}>
              <div
                className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between income-expense-selection"
                onClick={toggleDateRange}
              >
                Date Range
                <ChevronDown
                  className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
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

      <div className="income-expense-desktop-only overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-[57px]">
              <th
                colSpan="6"
                className="border-b border-[#E9E9E9] income-expense-header"
              ></th>
              <th
                colSpan="3"
                className="px-5 text-center border-b bg-[#F2FCF7] text-[#28C76F] income-expense-header"
              >
                INCOME
              </th>
              <th
                colSpan="3"
                className="px-5 text-center border-b border-[#E9E9E9] bg-[#FFF7F6] text-[#FE7062] income-expense-header"
              >
                EXPENSE
              </th>
            </tr>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left income-expense-thead">DATE</th>
              <th className="px-5 text-left income-expense-thead">BUILDING</th>
              <th className="px-5 text-left income-expense-thead">UNIT</th>
              <th className="px-5 text-left income-expense-thead">TENANT</th>
              <th className="px-5 text-left income-expense-thead">CHARGE</th>
              <th className="px-5 text-left income-expense-thead whitespace-nowrap">
                INVOICE NO/ <br />
                EXPENSE NO
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                AMOUNT
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                VAT
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                TOTAL
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                AMOUNT
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                VAT
              </th>
              <th className="px-5 text-center income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((income) => (
              <tr
                key={income.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 income-expense-data">{income.date}</td>
                <td className="px-5 income-expense-data">{income.building}</td>
                <td className="px-5 income-expense-data">{income.unit}</td>
                <td className="px-5 income-expense-data">{income.tenant}</td>
                <td className="px-5 income-expense-data">{income.charge}</td>
                <td className="px-5 income-expense-data">
                  {income.invoice_no}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                  {income.income_amount}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                  {income.income_vat}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                  {income.income_total}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                  {income.expense_amount}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                  {income.expense_vat}
                </td>
                <td className="px-5 text-center income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                  {income.expense_total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="income-expense-table-row-head">
              <th className="px-5 pl-[1rem] w-[50%] text-left income-expense-thead income-expense-date-column">
                DATE
              </th>
              <th className="px-3 w-[33.33%] text-left income-expense-thead income-expense-tenant-column">
                BUILDING
              </th>
              <th className=" text-right income-expense-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report) => (
              <React.Fragment key={report.id}>
                <tr
                  className={`${
                    expandedRows[report.id]
                      ? "income-expense-mobile-no-border"
                      : "income-expense-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left income-expense-data income-expense-date-column w-[35%] pl-[16px]">
                    {report.date}
                  </td>
                  <td className="px-3 text-left income-expense-data income-expense-tenant-column w-[30%]">
                    {report.building}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`income-expense-dropdown-field ${
                        expandedRows[report.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(report.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`income-expense-dropdown-img ${
                          expandedRows[report.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[report.id] && (
                  <tr className="income-expense-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="p-0">
                      <div className="income-expense-grid-container">
                        <div className="income-expense-grid">
                          <div className="income-expense-grid-item">
                            <div className="income-expense-dropdown-label w-[50%]">
                              UNIT
                            </div>
                            <div className="income-expense-dropdown-value">
                              {report.unit}
                            </div>
                          </div>
                          <div className="income-expense-grid-item w-[50%]">
                            <div className="income-expense-dropdown-label">
                              TENANT
                            </div>
                            <div className="income-expense-dropdown-value">
                              {report.tenant}
                            </div>
                          </div>
                        </div>
                        <div className="income-expense-grid">
                          <div className="income-expense-grid-item w-[50%]">
                            <div className="income-expense-dropdown-label">
                              CHARGE
                            </div>
                            <div className="income-expense-dropdown-value">
                              {report.charge}
                            </div>
                          </div>
                          <div className="income-expense-grid-item w-[50%]">
                            <div className="income-expense-dropdown-label">
                              INVOICE NO/EXPENSE NO
                            </div>
                            <div className="income-expense-dropdown-value">
                              {report.invoice_no}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="income-expense-table-container">
                        <table className="income-expense-dropdown-table">
                          <thead>
                            <tr className="income-expense-dropdown-table-header">
                              <th
                                colSpan="3"
                                className="income-expense-income-header"
                              >
                                INCOME
                              </th>
                              <th
                                colSpan="3"
                                className="income-expense-expense-header"
                              >
                                EXPENSE
                              </th>
                            </tr>
                            <tr className="income-expense-dropdown-table-subheader">
                              <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                AMOUNT
                              </th>
                              <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                VAT
                              </th>
                              <th className="income-expense-thead bg-[#F2FCF7] !text-[#28C76F]">
                                TOTAL
                              </th>
                              <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                AMOUNT
                              </th>
                              <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                VAT
                              </th>
                              <th className="income-expense-thead bg-[#FFF7F6] !text-[#FE7062]">
                                TOTAL
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="income-expense-dropdown-table-row">
                              <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                {report.income_amount}
                              </td>
                              <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                {report.income_vat}
                              </td>
                              <td className="income-expense-data bg-[#F2FCF7] !text-[#28C76F]">
                                {report.income_total}
                              </td>
                              <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                {report.expense_amount}
                              </td>
                              <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                {report.expense_vat}
                              </td>
                              <td className="income-expense-data bg-[#FFF7F6] !text-[#FE7062]">
                                {report.expense_total}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 income-expense-pagination-container">
        <span className="income-expense-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto income-expense-pagination-buttons">
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

export default IncomeExpenseReport;
