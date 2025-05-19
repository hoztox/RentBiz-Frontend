import React, { useState, useEffect } from "react";
import "./UpdateExpenseModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Expense/close-icon.svg";
import calendaricon from "../../../assets/Images/Expense/calendar-icon.svg";
import { useModal } from "../../../context/ModalContext";

const UpdateExpenseModal = () => {
  const { modalState, closeModal } = useModal();
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    tenant: "",
    building: "",
    units: "",
    expense: "",
    amount: "",
    vatAmount: "",
    totalAmount: "",
    description: "",
    status: "",
  });
  const [isSelectOpenTenant, setIsSelectOpenTenant] = useState(false);
  const [isSelectOpenExpense, setIsSelectOpenExpense] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);

  // Reset form state when modal opens or data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.data) {
      setFormData({
        id: modalState.data.id || "",
        date: modalState.data.date || "",
        tenant: modalState.data.tenant || "",
        building: modalState.data.building || "",
        units: modalState.data.units || "",
        expense: modalState.data.expense || "",
        amount: modalState.data.amount || "",
        vatAmount: modalState.data.vatAmount || "",
        totalAmount: modalState.data.totalAmount || "",
        description: modalState.data.description || "",
        status: modalState.data.status || "",
      });
    } else {
      // Reset form when modal is closed
      setFormData({
        id: "",
        date: "",
        tenant: "",
        building: "",
        units: "",
        expense: "",
        amount: "",
        vatAmount: "",
        totalAmount: "",
        description: "",
        status: "",
      });
    }
  }, [modalState.isOpen, modalState.data]);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (e.target.tagName === "SELECT") {
      if (value === "") {
        e.target.classList.add("financial-expense-update-selected");
      } else {
        e.target.classList.remove("financial-expense-update-selected");
      }
    }
  };

  // Only render for "update-expense" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-expense" ||
    !modalState.data
  ) {
    return null;
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    const { tenant, building, units, expense, date, vatAmount, status } =
      formData;
    if (tenant && building && units && expense && date && vatAmount && status) {
      console.log("Expense Updated: ", formData);
      closeModal();
    } else {
      console.log("Please fill all required fields");
    }
  };

  return (
    <div className="financial-expense-update-modal-wrapper">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 financial-expense-update-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 financial-expense-update-modal-container">
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] financial-expense-update-head">
              Update Expense
            </h2>
            <button
              onClick={closeModal}
              className="financial-expense-update-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
            </button>
          </div>

          <div className="md:p-6 md:mt-[-15px]">
            <div className="grid gap-6 financial-expense-update-modal-grid">
              {/* Tenant */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Tenant*
                </label>
                <div className="relative">
                  <select
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleChange}
                    onFocus={() => setIsSelectOpenTenant(true)}
                    onBlur={() => setIsSelectOpenTenant(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.tenant === ""
                        ? "financial-expense-update-selected"
                        : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Choose
                    </option>
                    <option value="FurnitureShop">Furniture Shop</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpenTenant ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Building */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Building*
                </label>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  placeholder="Enter Building"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* Units */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Units*
                </label>
                <input
                  name="units"
                  type="text"
                  value={formData.units}
                  onChange={handleChange}
                  placeholder="Enter Units"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* Expense */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Expense*
                </label>
                <div className="relative">
                  <select
                    name="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    onFocus={() => setIsSelectOpenExpense(true)}
                    onBlur={() => setIsSelectOpenExpense(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.expense === ""
                        ? "financial-expense-update-selected"
                        : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Choose
                    </option>
                    <option value="rent">Rent</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpenExpense ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Date*
                </label>
                <div className="relative">
                  <input
                    name="date"
                    type="text"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center px-2">
                    <img
                      src={calendaricon}
                      alt="calendar"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Amount
                </label>
                <input
                  name="amount"
                  type="text"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* VAT Amount */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Vat Amount*
                </label>
                <input
                  name="vatAmount"
                  type="text"
                  value={formData.vatAmount}
                  onChange={handleChange}
                  placeholder="Enter Vat Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* Total Amount */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Total Amount
                </label>
                <input
                  name="totalAmount"
                  type="text"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  placeholder="Enter Total Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Description
                </label>
                <input
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Status*
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onFocus={() => setIsSelectOpenStatus(true)}
                    onBlur={() => setIsSelectOpenStatus(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.status === ""
                        ? "financial-expense-update-selected"
                        : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Choose
                    </option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpenStatus ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-end justify-end financial-expense-update-modal-save-wrapper">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#2892CE] text-white financial-expense-update-save-btn duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateExpenseModal;
