import React, { useState } from "react";
import "./IdType.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import buildingimg from "../../../assets/Images/Admin Masters/building-img2.svg";
import CreateIdModal from "./CreateIdModal/CreateIdModal";
import UpdateIdModal from "./UpdateIdModal/UpdateIdModal";

const IdType = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModal] = useState(false);
  const [selectedIdtype, setSelectedIdtype] = useState(null);
  const itemsPerPage = 10;

  const demoData = [
    { id: "01", entriDate: "09 Sept 2024", name: "Passport" },
    { id: "02", entriDate: "09 Sept 2024", name: "Nationality ID" },
    { id: "03", entriDate: "09 Sept 2024", name: "Nationality ID" },
    { id: "04", entriDate: "09 Sept 2024", name: "Passport" },
    { id: "05", entriDate: "09 Sept 2024", name: "Nationality ID" },
    { id: "06", entriDate: "09 Sept 2024", name: "Nationality ID" },
    { id: "07", entriDate: "09 Sept 2024", name: "Passport" },
    { id: "08", entriDate: "09 Sept 2024", name: "Nationality ID" },
    { id: "09", entriDate: "09 Sept 2024", name: "Passport" },
    { id: "10", entriDate: "09 Sept 2024", name: "Nationality ID" },
  ];

  const filteredData = demoData.filter(
    (idtype) =>
      idtype.entriDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idtype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idtype.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openCreateModal = () => {
    setIsCreateModal(true);
  };

  const closeCreateModal = () => {
    setIsCreateModal(false);
  };

  const openUpdateModal = (idtype) => {
    setSelectedIdtype(idtype);
    setIsUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModal(false);
  };

  return (
    <div className="border border-gray-200 rounded-md p-5 bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="idtype-head">ID Type Masters</h1>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 idtype-search"
            />
          </div>

          <div className="relative">
            <select
              name="select"
              id=""
              className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 idtype-selection"
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
            className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-new-master duration-200"
            onClick={openCreateModal}
          >
            Add New Master
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

      {/* Content Section with Table and Image */}
      <div className="flex gap-4">
        {/* Table Section */}
        <div className="w-[60%] border border-gray-200 rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E9E9E9] h-[57px]">
                <th className="px-4 py-3 text-left idtype-thead">ID</th>
                <th className="px-4 py-3 text-left idtype-thead">ENTRY DATE</th>
                <th className="px-4 py-3 text-left idtype-thead">NAME</th>
                <th className="px-4 py-3 text-right idtype-thead">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((idtype, index) => {
                const isLastItemOnPage = index === paginatedData.length - 1;
                const shouldRemoveBorder =
                  isLastItemOnPage && paginatedData.length === itemsPerPage;

                return (
                  <tr
                    key={index}
                    className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                      shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                    }`}
                  >
                    <td className="px-5 text-left idtype-data">{idtype.id}</td>
                    <td className="px-5 text-left idtype-data">
                      {idtype.entriDate}
                    </td>
                    <td className="pl-5 text-left idtype-data w-[22%]">
                      {idtype.name}
                    </td>
                    <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                      <button onClick={() => openUpdateModal(idtype)}>
                        <img
                          src={editicon}
                          alt="Edit"
                          className="w-[18px] h-[18px] action-btn duration-200"
                        />
                      </button>
                      <button>
                        <img
                          src={deleteicon}
                          alt="Deletes"
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
        {/* Image Section */}
        <div className="w-[40%] border border-[#E9E9E9] rounded-md p-5">
          <img
            src={buildingimg}
            alt="Building exterior"
            className="h-[587px] w-full object-cover rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-between items-center h-[38px] pt-10 mb-5 px-5">
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
      {/* Add New ID Modal */}
      <CreateIdModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

      {/* Update ID Modal */}
      <UpdateIdModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        idtype={selectedIdtype}
      />
    </div>
  );
};

export default IdType;
