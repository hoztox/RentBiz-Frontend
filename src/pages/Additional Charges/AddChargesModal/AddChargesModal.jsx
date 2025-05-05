import React, { useEffect, useState } from "react";
import "./AddChargesModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Additional Charges/close-icon.svg";
import calendaricon from "../../../assets/Images/Additional Charges/calendar-icon.svg";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";

const AddChargesModal = ({ isOpen, onClose }) => {
  const [tenancyContract, setTenancyContract] = useState("");
  const [id, setId] = useState("");
  const [date, setDate] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [reason, setReason] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [vatAmount, setVatAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSelectOpenTenancy, setIsSelectOpenTenancy] = useState(false);
  const [isSelectOpenChargeCode, setIsSelectOpenChargeCode] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);

  const handleSave = () => {
    // Validate required fields (marked with *)
    if (id && date && chargeCode && reason && vatAmount && status) {
      const formData = {
        tenancyContract,
        id,
        date,
        chargeCode,
        reason,
        amountDue,
        vatAmount,
        totalAmount,
        dueDate,
        status,
        remarks,
      };
      console.log("New Charge Added: ", formData);
      // Add actual save logic here (e.g., API call)
      onClose();
    } else {
      console.log("Please fill all required fields");
      // Optionally, show an error message to the user
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Reset form fields when modal opens
      setTenancyContract("");
      setId("");
      setDate("");
      setChargeCode("");
      setReason("");
      setAmountDue("");
      setVatAmount("");
      setTotalAmount("");
      setDueDate("");
      setStatus("");
      setRemarks("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-charges-modal-container bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center md:p-6 mt-2">
          <h2 className="text-[#201D1E] add-charges-head">
            Create New Additional Charge
          </h2>
          <button
            onClick={onClose}
            className="add-charges-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="md:p-6 mt-[-15px]">
          <div className="grid ac-grid-cols-2 gap-6">
            {/* First row */}
            <div className="space-y-2">
              <label className="block add-charges-label">
                Tenancy Contract
              </label>
              <div className="relative">
                <select
                  value={tenancyContract}
                  onChange={(e) => {
                    setTenancyContract(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("add-charges-selected");
                    } else {
                      e.target.classList.remove("add-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenTenancy(true)}
                  onBlur={() => setIsSelectOpenTenancy(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    tenancyContract === "" ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>
                    Choose
                  </option>
                  <option value="contract1">Contract 1</option>
                  <option value="contract2">Contract 2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenTenancy ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">ID*</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter ID"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            {/* Second row */}
            <div className="space-y-2">
              <label className="block add-charges-label">Date*</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Charge Code*</label>
              <div className="relative">
                <select
                  value={chargeCode}
                  onChange={(e) => {
                    setChargeCode(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("add-charges-selected");
                    } else {
                      e.target.classList.remove("add-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenChargeCode(true)}
                  onBlur={() => setIsSelectOpenChargeCode(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    chargeCode === "" ? "add-charges-selected" : ""
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
                      isSelectOpenChargeCode ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Third row */}
            <div className="space-y-2">
              <label className="block add-charges-label">Reason*</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter The Reason"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Amount Due</label>
              <input
                type="text"
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                placeholder="Enter Amount Due"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            {/* Fourth row */}
            <div className="space-y-2">
              <label className="block add-charges-label">Vat Amount*</label>
              <div className="relative">
                <input
                  type="text"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(e.target.value)}
                  placeholder="Enter Vat Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={plusicon} alt="plus-icon" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Total Amount</label>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Enter Total Amount"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            {/* Fifth row */}
            <div className="space-y-2">
              <label className="block add-charges-label">Due Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Status*</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("add-charges-selected");
                    } else {
                      e.target.classList.remove("add-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    status === "" ? "add-charges-selected" : ""
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

            {/* Sixth row - Remarks and Save button on same row */}
            <div className="space-y-2 mb-1">
              <label className="block add-charges-label">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter Remarks"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="flex items-end justify-end mb-1">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#2892CE] text-white add-charges-save-btn duration-200"
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

export default AddChargesModal;