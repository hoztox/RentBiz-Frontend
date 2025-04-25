import React, { useState } from "react";
import "./AddExpenseModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Expense/close-icon.svg";
import calendaricon from "../../../assets/Images/Expense/calendar-icon.svg";

const AddExpenseModal = ({ isOpen, onClose }) => {
  const initialFormData = {
    tenant: "",
    building: "",
    units: "",
    expense: "",
    date: "",
    amount: "",
    vatAmount: "",
    totalAmount: "",
    description: "",
    status: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSelectOpenTenant, setIsSelectOpenTenant] = useState(false);
  const [isSelectOpenExpense, setIsSelectOpenExpense] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    const {
      tenant,
      building,
      units,
      expense,
      date,
      amount,
      vatAmount,
      totalAmount,
      description,
      status,
    } = formData;
    if (
      tenant &&
      building &&
      units &&
      expense &&
      date &&
      amount &&
      vatAmount &&
      totalAmount &&
      description &&
      status
    ) {
      console.log("New Charge Added: ", formData);
      onClose();
    } else {
      console.log("Please fill all required fields");
    }
  };

  const handleClose = () => {
    setFormData(initialFormData); // Reset form data
    onClose(); // Call the original onClose prop
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center p-6 mt-2">
          <h2 className="text-[#201D1E] add-expense-head">
            Create New Additional Charge
          </h2>
          <button
            onClick={handleClose}
            className="add-expense-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="p-6 mt-[-15px]">
          <div className="grid grid-cols-2 gap-6">
            {/* Tenant */}
            <div className="space-y-2">
              <label className="block add-expense-label">Tenant*</label>
              <div className="relative">
                <select
                  value={formData.tenant}
                  onChange={handleChange("tenant")}
                  onFocus={() => setIsSelectOpenTenant(true)}
                  onBlur={() => setIsSelectOpenTenant(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-selection ${
                    formData.tenant === "" ? "add-expense-selected" : ""
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
              <label className="block add-expense-label">Building*</label>
              <input
                type="text"
                value={formData.building}
                onChange={handleChange("building")}
                placeholder="Enter Building"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
              />
            </div>

            {/* Units */}
            <div className="space-y-2">
              <label className="block add-expense-label">Units*</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.units}
                  onChange={handleChange("units")}
                  placeholder="Enter Units"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
                />
              </div>
            </div>

            {/* Expense */}
            <div className="space-y-2">
              <label className="block add-expense-label">Expense*</label>
              <div className="relative">
                <select
                  value={formData.expense}
                  onChange={handleChange("expense")}
                  onFocus={() => setIsSelectOpenExpense(true)}
                  onBlur={() => setIsSelectOpenExpense(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-selection ${
                    formData.expense === "" ? "add-expense-selected" : ""
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
              <label className="block add-expense-label">Date*</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.date}
                  onChange={handleChange("date")}
                  placeholder="dd/mm/yyyy"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block add-expense-label">Amount</label>
              <input
                type="text"
                value={formData.amount}
                onChange={handleChange("amount")}
                placeholder="Enter Amount"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
              />
            </div>

            {/* VAT Amount */}
            <div className="space-y-2">
              <label className="block add-expense-label">Vat Amount*</label>
              <input
                type="text"
                value={formData.vatAmount}
                onChange={handleChange("vatAmount")}
                placeholder="Enter Vat Amount"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
              />
            </div>

            {/* Total Amount */}
            <div className="space-y-2">
              <label className="block add-expense-label">Total Amount</label>
              <input
                type="text"
                value={formData.totalAmount}
                onChange={handleChange("totalAmount")}
                placeholder="Enter Total Amount"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block add-expense-label">Description</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Enter Description"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-input"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block add-expense-label">Status*</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={handleChange("status")}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-expense-selection ${
                    formData.status === "" ? "add-expense-selected" : ""
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
            <div className="flex items-end justify-end col-span-2 mt-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#2892CE] text-white add-expense-save-btn duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
