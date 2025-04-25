import React, { useState } from "react";
import "./TenancyReport.css";
import { ChevronDown } from "lucide-react";

const TenancyReport = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="border border-[#E9E9E9]  rounded-md">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9]">
        <h1 className="tenancy-report-head">Tenant Report</h1>
        <div className="flex gap-[10px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 tenancy-report-search"
          />

          <div className="relative">
            <select
              name="select"
              id=""
              className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenancy-reporttenancy-reporttenancy-report-selection"
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
            >
              <option value="showing">Showing</option>
              <option value="all">All</option>
            </select>
            <ChevronDown
              className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          </div>
          <button className="flex items-center justify-center gap-2 w-[132px] h-[38px] rounded-md duration-200 export-btn">
            Export To Excel
          </button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#E9E9E9] h-[57px]">
            <th className="px-5 text-left tenancy-report-thead W-[58px]">
              ID
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[86px]">
              NAME
            </th>
            <th className="pl-5 text-left tenancy-report-thead w-[87px]">
              DESCRIPTION
            </th>
            <th className="pl-5 text-left tenancy-report-thead w-[102px]">
              BUILDING
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[54px]">
              UNIT
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[84px]">
              CREATED DATE
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[94px]">
              HIRE START DATE
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[94px]">
              HIRE END DATE
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[60px]">
              RENTAL MONTHS
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[53px]">
              RENT/MONTH
            </th>
            <th className="px-5 text-left tenancy-report-thead w-[74px]">
              NO.OF PAYMENTS
            </th>
            <th className="px-5 pr-6 text-center tenancy-report-thead w-[69px]">
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
              <td className="px-5 text-left tenancy-report-data w-[58px]">
                {report.id}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[86px]">
                {report.name}
              </td>
              <td className="pl-5 text-left tenancy-report-data w-[67px]">
                {report.description}
              </td>
              <td className="pl-5 text-left tenancy-report-data w-[102px]">
                {report.building}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[54px]">
                {report.unit}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[84px]">
                {report.createdDate}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[95px]">
                {report.hireStart}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[95px]">
                {report.hireEnd}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[60px]">
                {report.rental}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[40px]">
                {report.rent}
              </td>
              <td className="px-5 text-left tenancy-report-data w-[74px]">
                {report.payment}
              </td>
              <td className="px-5 text-center tenancy-report-data">
                <span
                  className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${report.status === "Pending"
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
      <div className="flex justify-between items-center h-[77.5px] px-5">
        <span className="collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px]">
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
          {startPage > 2 && <span className="px-2">...</span>}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={startPage + i}
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${currentPage === startPage + i
                  ? "bg-[#1458A2] text-white"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
                }`}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
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
      {/* Create Tenancy Modal */}
    </div>
  );
};

export default TenancyReport;
