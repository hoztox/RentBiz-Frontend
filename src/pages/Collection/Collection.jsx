import React, { useState } from "react";
import "./Collection.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../assets/Images/Collection/plus-icon.svg";
import downloadicon from "../../assets/Images/Collection/download-icon.svg";
import editicon from "../../assets/Images/Collection/edit-icon.svg";
import printericon from "../../assets/Images/Collection/printer-icon.svg";
import downloadactionicon from "../../assets/Images/Collection/download-action-icon.svg";
import downarrow from "../../assets/Images/Collection/downarrow.svg";
import AddCollectionModal from "./AddCollectionModal/AddCollectionModal";
import UpdateCollectionModal from "./UpdateCollectionModal/UpdateCollectionModal";

const Collection = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "#RCT2002001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Manea Bin Saeed",
      amount: "300.00",
      description: "Test test test ",
      payment: "Cash",
      status: "Paid",
    },
    {
      id: "#RCT2002001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Manea Bin Saeed",
      amount: "300.00",
      description: "Test test test ",
      payment: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "#RCT2002001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Manea Bin Saeed",
      amount: "300.00",
      description: "Test test test ",
      payment: "Cash",
      status: "Paid",
    },
    {
      id: "#RCT2002001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Manea Bin Saeed",
      amount: "300.00",
      description: "Test test test ",
      payment: "Bank Transfer",
      status: "Paid",
    },
    {
      id: "#RCT2002001",
      date: "24 Nov 2024",
      tenancyId: "TC0013-1",
      tenantName: "Manea Bin Saeed",
      amount: "300.00",
      description: "Test test test ",
      payment: "Cash",
      status: "Paid",
    },
  ];

  const filteredData = demoData.filter(
    (collection) =>
      collection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.tenancyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openUpdateModal = () => {
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
    <div className="border border-[#E9E9E9] rounded-md collection-table">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] collection-table-header">
        <h1 className="collection-head">Collection</h1>
        <div className="flex flex-col md:flex-row gap-[10px] collection-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 collection-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 collection-selection"
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
          <div className="flex gap-[10px] collection-action-buttons w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-collection duration-200"
              onClick={openAddModal}
            >
              Add Collection
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 w-[122px] h-[38px] rounded-md duration-200 collection-download-btn">
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
      <div className="collection-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left collection-thead">ID</th>
              <th className="px-5 text-left collection-thead">DATE</th>
              <th className="pl-5 text-left collection-thead">TENANCY ID</th>
              <th className="pl-5 text-left collection-thead">TENANT NAME</th>
              <th className="px-5 text-left collection-thead">AMOUNT</th>
              <th className="px-5 text-left collection-thead">DESCRIPTION</th>
              <th className="px-5 text-left collection-thead">PAYMENT METHOD</th>
              <th className="px-5 text-left collection-thead w-[68px]">STATUS</th>
              <th className="px-5 pr-11 text-right collection-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((collection, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left collection-data">{collection.id}</td>
                <td className="px-5 text-left collection-data">{collection.date}</td>
                <td className="pl-5 text-left collection-data">{collection.tenancyId}</td>
                <td className="pl-5 text-left collection-data">{collection.tenantName}</td>
                <td className="px-5 text-left collection-data">{collection.amount}</td>
                <td className="px-5 text-left collection-data">{collection.description}</td>
                <td className="px-5 text-left collection-data">{collection.payment}</td>
                <td className="px-5 text-left collection-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] h-[28px] ${
                      collection.status === "Paid"
                        ? "bg-[#28C76F29] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {collection.status}
                  </span>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={openUpdateModal}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={downloadactionicon}
                      alt="Download"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={printericon}
                      alt="Printer"
                      className="w-[18px] h-[18px] action-btn duration-200"
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
            <tr className="collection-table-row-head">
              <th className="px-5 text-left collection-thead collection-id-column">ID</th>
              <th className="px-5 text-left collection-thead collection-date-column">DATE</th>
              <th className="px-5 text-right collection-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((collection, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[collection.id + index]
                      ? "collection-mobile-no-border"
                      : "collection-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left collection-data collection-id-column">{collection.id}</td>
                  <td className="px-5 text-left collection-data collection-date-column">{collection.date}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`collection-dropdown-field ${
                        expandedRows[collection.id + index] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(collection.id + index)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`collection-dropdown-img ${
                          expandedRows[collection.id + index] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[collection.id + index] && (
                  <tr className="collection-mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="collection-dropdown-content">
                        <div className="collection-dropdown-grid">
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">TENANCY ID</div>
                            <div className="collection-dropdown-value">{collection.tenancyId}</div>
                          </div>
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">TENANT NAME</div>
                            <div className="collection-dropdown-value">{collection.tenantName}</div>
                          </div>
                        </div>
                        <div className="collection-dropdown-grid">
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">AMOUNT</div>
                            <div className="collection-dropdown-value">{collection.amount}</div>
                          </div>
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">DESCRIPTION</div>
                            <div className="collection-dropdown-value">{collection.description}</div>
                          </div>
                        </div>
                        <div className="collection-dropdown-grid">
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">PAYMENT METHOD</div>
                            <div className="collection-dropdown-value">{collection.payment}</div>
                          </div>
                          <div className="collection-dropdown-item w-[50%]">
                            <div className="collection-dropdown-label">STATUS</div>
                            <div className="collection-dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] rounded-[4px] w-[69px] h-[28px] ${
                                  collection.status === "Paid"
                                    ? "bg-[#28C76F29] text-[#28C76F]"
                                    : "bg-[#FFE1E1] text-[#C72828]"
                                }`}
                              >
                                {collection.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="collection-dropdown-grid">
                          <div className="collection-dropdown-item w-[100%]">
                            <div className="collection-dropdown-label">ACTION</div>
                            <div className="collection-dropdown-value flex items-center gap-4">
                              <button onClick={openUpdateModal}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={downloadactionicon}
                                  alt="Download"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={printericon}
                                  alt="Printer"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 px-5 collection-pagination-container">
        <span className="collection-list-pagination collection-pagination-text">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto collection-pagination-buttons">
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
          {endPage < totalPages - 1 && <span className="px-2 flex items-center">...</span>}
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
      <AddCollectionModal isOpen={isAddModalOpen} onClose={closeAddModal} />
      <UpdateCollectionModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} />
    </div>
  );
};

export default Collection;