import React, { useState } from "react";
import "./DocumentType.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import buildingimg from "../../../assets/Images/Admin Masters/building-img.svg";
import downarrow from "../../../assets/Images/Admin Masters/downarrow.svg";
import AddDocumentModal from "./AddDocumentModal/AddDocumentModal";
import UpdateDocumentModal from "./UpdateDocumentModal/UpdateDocumentModal";

const DocumentType = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const demoData = [
    { id: "01", date: "09 Sept 2024", name: "Trade License" },
    { id: "02", date: "09 Sept 2024", name: "Nationality ID" },
    { id: "03", date: "09 Sept 2024", name: "Trade License" },
    { id: "04", date: "09 Sept 2024", name: "Nationality ID" },
    { id: "05", date: "09 Sept 2024", name: "Contract" },
    { id: "06", date: "09 Sept 2024", name: "Nationality ID" },
    { id: "07", date: "09 Sept 2024", name: "Nationality ID" },
    { id: "08", date: "09 Sept 2024", name: "Nationality ID" },
    { id: "09", date: "09 Sept 2024", name: "Permit" },
    { id: "10", date: "09 Sept 2024", name: "Nationality ID" },
  ];

  const filteredData = demoData.filter(
    (document) =>
      document.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openUpdateModal = (document) => {
    setSelectedDocument(document);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border border-gray-200 rounded-md doctype-table">
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] doctype-table-header">
        <h1 className="doctype-head">Document Type Masters</h1>
        <div className="flex flex-col md:flex-row gap-[10px] doctype-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 doctype-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 doctype-selection"
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
          <div className="flex gap-[10px] action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-full md:w-[176px] h-[38px] rounded-md doctype-add-new-master duration-200"
              onClick={openModal}
            >
              Add New Master
              <img src={plusicon} alt="plus icon" className="relative right-[5px] md:right-0 w-[15px] h-[15px]" />
            </button>
            <button className="flex items-center justify-center gap-2 w-full md:w-[122px] h-[38px] rounded-md duration-200 doctype-download-btn">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
                className="w-[15px] h-[15px] download-img"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="desktop-only">
        <div className="flex gap-4 p-5">
          {/* Table Section */}
          <div className="w-[60%] border border-gray-200 rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-4 py-3 text-left doctype-thead">ID</th>
                  <th className="px-4 py-3 text-left doctype-thead">DATE</th>
                  <th className="px-4 py-3 text-left doctype-thead">NAME</th>
                  <th className="px-4 py-3 text-right doctype-thead">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((document, index) => {
                  const isLastItemOnPage = index === paginatedData.length - 1;
                  const shouldRemoveBorder =
                    isLastItemOnPage && paginatedData.length === itemsPerPage;

                  return (
                    <tr
                      key={document.id}
                      className={`h-[57px] hover:bg-gray-50 cursor-pointer ${
                        shouldRemoveBorder ? "" : "border-b border-[#E9E9E9]"
                      }`}
                    >
                      <td className="px-5 text-left doctype-data">{document.id}</td>
                      <td className="px-5 text-left doctype-data">{document.date}</td>
                      <td className="pl-5 text-left doctype-data">{document.name}</td>
                      <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                        <button onClick={() => openUpdateModal(document)}>
                          <img
                            src={editicon}
                            alt="Edit"
                            className="w-[18px] h-[18px] action-btn duration-200"
                          />
                        </button>
                        <button>
                          <img
                            src={deleteicon}
                            alt="Delete"
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
      </div>

      {/* Mobile Table */}
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="doctype-table-row-head">
              <th className="px-5 w-[52%] text-left doctype-thead doctype-id-column">ID</th>
              <th className="px-5 w-[47%] text-left doctype-thead doctype-date-column">DATE</th>
              <th className="px-5 text-right doctype-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((document) => (
              <React.Fragment key={document.id}>
                <tr
                  className={`${
                    expandedRows[document.id] ? "mobile-no-border" : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left doctype-data">{document.id}</td>
                  <td className="px-5 text-left doctype-data doctype-date-column">{document.date}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`doctype-dropdown-field ${
                        expandedRows[document.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(document.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`doctype-dropdown-img ${
                          expandedRows[document.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[document.id] && (
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="doctype-dropdown-content">
                        <div className="doctype-grid">
                          <div className="doctype-grid-items">
                            <div className="dropdown-label">NAME</div>
                            <div className="dropdown-value">{document.name}</div>
                          </div>
                          <div className="doctype-grid-items">
                            <div className="dropdown-label">ACTION</div>
                            <div className="dropdown-value flex items-center gap-4 p-1">
                              <button onClick={() => openUpdateModal(document)}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deleteicon}
                                  alt="Delete"
                                  className="w-[18px] h-[18px] action-btn duration-200"
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

      {/* Pagination */}
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

      {/* Modals */}
      <AddDocumentModal isOpen={isModalOpen} onClose={closeModal} />
      <UpdateDocumentModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        document={selectedDocument}
      />
    </div>
  );
};

export default DocumentType;