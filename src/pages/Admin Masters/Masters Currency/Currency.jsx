import React, { useState } from "react";
import "./Currency.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../../assets/Images/Admin Masters/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Masters/download-icon.svg";
import editicon from "../../../assets/Images/Admin Masters/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Masters/delete-icon.svg";
import AddCurrencyModal from "./AddCurrencyModal/AddCurrencyModal";
import UpdateCurrencyModal from "./UpdateCurrencyModal/UpdateCurrencyModal";

const Currency = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "01",
      country: "United Arab Emirates",
      currency: "Dirham",
      code: "AED",
      minorUnit: "3 unit",
    },
    {
      id: "02",
      country: "Kuwait",
      currency: "Dinar",
      code: "KWD",
      minorUnit: "3 unit",
    },
    {
      id: "03",
      country: "Saudi Arabia",
      currency: "Riyal",
      code: "SAR",
      minorUnit: "3 unit",
    },
    {
      id: "04",
      country: "United Arab Emirates",
      currency: "Dirham",
      code: "AED",
      minorUnit: "3 unit",
    },
    {
      id: "05",
      country: "Kuwait",
      currency: "Dinar",
      code: "KWD",
      minorUnit: "3 unit",
    },
    {
      id: "06",
      country: "United Arab Emirates",
      currency: "Dirham",
      code: "AED",
      minorUnit: "3 unit",
    },
    {
      id: "07",
      country: "Saudi Arabia",
      currency: "Riyal",
      code: "SAR",
      minorUnit: "3 unit",
    },
    {
      id: "08",
      country: "United Arab Emirates",
      currency: "Dirham",
      code: "AED",
      minorUnit: "3 unit",
    },
    {
      id: "09",
      country: "Saudi Arabia",
      currency: "Riyal",
      code: "SAR",
      minorUnit: "3 unit",
    },
    {
      id: "10",
      country: "United Arab Emirates",
      currency: "Dirham",
      code: "AED",
      minorUnit: "3 unit",
    },
  ];

  const filteredData = demoData.filter(
    (currency) =>
      currency.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.minorUnit.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openUpdateModal = (currency) => {
    setSelectedCurrency(currency);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCurrency(null); // Clear selected currency
  };

  return (
    <div className="border border-[#E9E9E9] rounded-md">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9]">
        <h1 className="currency-head">Currency</h1>
        <div className="flex gap-[10px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 currency-search"
          />

          <div className="relative">
            <select
              name="select"
              id=""
              className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 currancy-selection"
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
            className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-new-currency duration-200"
            onClick={openAddModal}
          >
            Add New Currency
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
            <th className="px-5 text-left currency-thead">ID</th>
            <th className="px-5 text-left currency-thead">COUNTRY</th>
            <th className="pl-5 text-left currency-thead">CURRENCY</th>
            <th className="pl-5 text-left currency-thead">CODE</th>
            <th className="px-5 text-center currency-thead">MINOR UNIT</th>
            <th className="px-5 pr-6 text-right currency-thead">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((currency, index) => (
            <tr
              key={index}
              className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-5 text-left currency-data">{currency.id}</td>
              <td className="px-5 text-left currency-data">
                {currency.country}
              </td>
              <td className="pl-5 text-left currency-data">
                {currency.currency}
              </td>
              <td className="pl-5 text-left currency-data">{currency.code}</td>
              <td className="px-5 currency-data text-center">
                {currency.minorUnit}
              </td>
              <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                <button onClick={() => openUpdateModal(currency)}>
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
      {/* Add New Currency Modal */}
      <AddCurrencyModal isOpen={isAddModalOpen} onClose={closeAddModal} />

      {/* Update Currency Modal */}
      <UpdateCurrencyModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        currencyData={selectedCurrency}
      />
    </div>
  );
};

export default Currency;
