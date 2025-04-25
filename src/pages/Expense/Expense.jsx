import React, { useState } from "react";
import "./Expense.css";
import { ChevronDown } from "lucide-react";
import plusicon from "../../assets/Images/Expense/plus-icon.svg";
import downloadicon from "../../assets/Images/Expense/download-icon.svg";
import editicon from "../../assets/Images/Expense/edit-icon.svg";
import printericon from "../../assets/Images/Expense/printer-icon.svg";
import downloadactionicon from "../../assets/Images/Expense/download-action-icon.svg";
import AddExpenseModal from "./AddExpenseModal/AddExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal/UpdateExpenseModal";

const Expense = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const itemsPerPage = 10;

  const demoData = [
    {
      id: "01",
      date: "24 Nov 2024",
      expense: "Maintenance",
      amount: "280.00",
      vatAmount: "1.25",
      totalAmount: "281.25",
      status: "Paid",
    },
    {
      id: "02",
      date: "24 Nov 2024",
      expense: "Maintenance",
      amount: "280.00",
      vatAmount: "1.25",
      totalAmount: "281.25",
      status: "Paid",
    },
    {
      id: "03",
      date: "24 Nov 2024",
      expense: "Maintenance",
      amount: "280.00",
      vatAmount: "1.25",
      totalAmount: "281.25",
      status: "Paid",
    },
    {
      id: "04",
      date: "24 Nov 2024",
      expense: "Maintenance",
      amount: "280.00",
      vatAmount: "1.25",
      totalAmount: "281.25",
      status: "Paid",
    },
    {
      id: "05",
      date: "24 Nov 2024",
      expense: "Maintenance",
      amount: "280.00",
      vatAmount: "1.25",
      totalAmount: "281.25",
      status: "Paid",
    },
  ];

  const filteredData = demoData.filter(
    (expense) =>
      expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.expense.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vatAmount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.totalAmount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const openUpdateModal = (expense) => {
      setSelectedExpense(expense)
      setIsUpdateModalOpen(true)
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false)
    setSelectedExpense(null);
  }

  return (
    <div className="border border-[#E9E9E9]  rounded-md">
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9]">
        <h1 className="expense-head">Expenses</h1>
        <div className="flex gap-[10px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 expense-search"
          />

          <div className="relative">
            <select
              name="select"
              id=""
              className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 expense-selection"
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
          <button className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-expense duration-200" onClick={openAddModal}>
            Add New Expense
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
            <th className="px-5 text-left expense-thead">ID</th>
            <th className="px-5 text-left expense-thead">DATE</th>
            <th className="pl-5 text-left expense-thead">EXPENSE</th>
            <th className="pl-5 text-left expense-thead">AMOUNT</th>
            <th className="px-5 text-left expense-thead">VAT AMOUNT</th>
            <th className="px-5 text-left expense-thead">TOTAL AMOUNT</th>
            <th className="px-5 text-left expense-thead w-[68px]">STATUS</th>
            <th className="px-5 pr-11 text-right expense-thead">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((expense, index) => (
            <tr
              key={index}
              className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-5 text-left expense-data">{expense.id}</td>
              <td className="px-5 text-left expense-data">{expense.date}</td>
              <td className="pl-5 text-left expense-data">
                {expense.expense}
              </td>
              <td className="pl-5 text-left expense-data">
                {expense.amount}
              </td>
              <td className="px-5 text-left expense-data">
                {expense.vatAmount}
              </td>
              <td className="px-5 text-left expense-data">
                {expense.totalAmount}
              </td>
              <td className="px-5 text-left expense-data">
                <span
                  className={`px-[10px] py-[5px] rounded-[4px] w-[69px] h-[28px] ${
                    expense.status === "Paid"
                      ? "bg-[#28C76F29] text-[#28C76F]"
                      : "bg-[#FFE1E1] text-[#C72828]"
                  }`}
                >
                  {expense.status}
                </span>
              </td>

              <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                <button onClick={() => openUpdateModal(expense)}>
                  <img
                    src={editicon}
                    alt="Edit"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
                <button>
                  <img
                    src={downloadactionicon}
                    alt="Edit"
                    className="w-[18px] h-[18px] action-btn duration-200"
                  />
                </button>
                <button>
                  <img
                    src={printericon}
                    alt="printer"
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
      {/* Add Expense Modal */}
      <AddExpenseModal isOpen={isAddModalOpen} onClose={closeAddModal} />

      {/* Update Expense Modal */}
      <UpdateExpenseModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} expenseData={selectedExpense} />
    </div>
  );
};

export default Expense;
