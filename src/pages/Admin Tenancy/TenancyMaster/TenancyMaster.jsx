import React, { useState } from "react";
import "./TenancyMaster.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Tenancy/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deletesicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import CreateTenancyModal from "../CreateTenancy/CreateTenancyModal";

const TenancyMaster = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [createTenancyModal, setCreateTenancyModal] = useState(false);

  const openCreateTenancyModal = () => {
    setCreateTenancyModal(true);
  };

  const closeCreateTenancyModal = () => {
    setCreateTenancyModal(false);
  };

  const demoData = [
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Occupied",
    },
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Occupied",
    },
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Occupied",
    },
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Occupied",
    },
    {
      id: "#TC0018-1",
      tenant: "Furniture shop",
      building: "DANAT ALZAHIA",
      unit: "SHOP10",
      months: "66",
      view: viewicon,
      status: "Occupied",
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
    <div className="border border-[#E9E9E9]  rounded-md">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9]">
        <h1 className="tenancy-head">Tenancy</h1>
        <div className="flex gap-[10px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 tenancy-search"
          />

          <div className="relative">
            <select
              name="select"
              id=""
              className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 tenancy-selection"
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
          <button
            className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-new-tenancy duration-200"
            onClick={openCreateTenancyModal}
          >
            Add New Tenancy
            <img src={plusicon} alt="plus icon" className="w-[15px] h-[15px]" />
          </button>
          <button className="flex items-center justify-center gap-2 w-[122px] h-[38px] rounded-md duration-200 download-btn">
            Download
            <img
              src={downloadicon}
              alt="Download Icon"
              className="w-[15px] h-[15px] download-img"
            />
          </button>
        </div>
      </div>
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
            <th className="pl-5 text-left tenancy-thead w-[12%]">UNIT NAME</th>
            <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
            <th className="px-5 text-left tenancy-thead w-[12%]">STATUS</th>
            <th className="pl-12 pr-5 text-center tenancy-thead w-[8%]">
              VIEW
            </th>
            <th className="px-5 pr-6 text-right tenancy-thead">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((tenancy, index) => (
            <tr
              key={index}
              className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-5 text-left tenancy-data">{tenancy.id}</td>
              <td className="px-5 text-left tenancy-data">{tenancy.tenant}</td>
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
                <button>
                  <img
                    src={tenancy.view}
                    alt="View"
                    className="w-[30px] h-[24px] action-btn duration-200"
                  />
                </button>
              </td>
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
                    src={deletesicon}
                    alt="Deletes"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
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
      <CreateTenancyModal
        isOpen={createTenancyModal}
        onClose={closeCreateTenancyModal}
      />
    </div>
  );
};

export default TenancyMaster;
