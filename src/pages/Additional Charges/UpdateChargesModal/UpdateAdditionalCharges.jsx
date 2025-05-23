import React, { useEffect, useState } from "react";
import "./UpdateChargesModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Additional Charges/close-icon.svg";
import calendaricon from "../../../assets/Images/Additional Charges/calendar-icon.svg";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";
import { useModal } from "../../../context/ModalContext";

const UpdateAdditionalCharges = () => {
  const { modalState, closeModal } = useModal();
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

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.data) {
      setId(modalState.data.id || "");
      setTenancyContract(modalState.data.tenancyContract || "");
      setDate(modalState.data.date || "");
      setChargeCode(modalState.data.chargeCode || "");
      setReason(modalState.data.reason || "");
      setAmountDue(modalState.data.amountDue || "");
      setVatAmount(modalState.data.vatAmount || "");
      setTotalAmount(modalState.data.totalAmount || "");
      setDueDate(modalState.data.dueDate || "");
      setStatus(modalState.data.status || "");
      setRemarks(modalState.data.remarks || "");
    }
  }, [modalState.isOpen, modalState.data]);

  // Only render for "update-additional-charges" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-additional-charges" ||
    !modalState.data
  ) {
    return null;
  }

  const handleUpdate = () => {
    const updatedData = {
      id,
      tenancyContract,
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
    console.log("Updated Data:", updatedData);
    closeModal();
  };

  return (
    <div className="additional-charges-modal-overlay">
      <div className="update-charges-modal-container bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center md:p-6 mt-2">
          <h2 className="text-[#201D1E] update-charges-head">
            Update Additional Charge
          </h2>
          <button
            onClick={closeModal}
            className="update-charges-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="md:p-6 mt-[-15px]">
          <div className="grid uc-grid-cols-2 gap-6">
            {/* First row */}
            <div className="space-y-2">
              <label className="block update-charges-label">
                Tenancy Contract
              </label>
              <div className="relative">
                <select
                  value={tenancyContract}
                  onChange={(e) => {
                    setTenancyContract(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("update-charges-selected");
                    } else {
                      e.target.classList.remove("update-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenTenancy(true)}
                  onBlur={() => setIsSelectOpenTenancy(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    tenancyContract === "" ? "update-charges-selected" : ""
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
              <label className="block update-charges-label">ID*</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter ID"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            {/* Second row */}
            <div className="space-y-2">
              <label className="block update-charges-label">Date*</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Charge Code*</label>
              <div className="relative">
                <select
                  value={chargeCode}
                  onChange={(e) => {
                    setChargeCode(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("update-charges-selected");
                    } else {
                      e.target.classList.remove("update-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenChargeCode(true)}
                  onBlur={() => setIsSelectOpenChargeCode(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    chargeCode === "" ? "update-charges-selected" : ""
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
              <label className="block update-charges-label">Reason*</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter The Reason"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Amount Due</label>
              <input
                type="text"
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                placeholder="Enter Amount Due"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            {/* Fourth row */}
            <div className="space-y-2">
              <label className="block update-charges-label">Vat Amount*</label>
              <div className="relative">
                <input
                  type="text"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(e.target.value)}
                  placeholder="Enter Vat Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={plusicon} alt="plus-icon" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Total Amount</label>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Enter Total Amount"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            {/* Fifth row */}
            <div className="space-y-2">
              <label className="block update-charges-label">Due Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Status*</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("update-charges-selected");
                    } else {
                      e.target.classList.remove("update-charges-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    status === "" ? "update-charges-selected" : ""
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
              <label className="block update-charges-label">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter Remarks"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="flex items-end justify-end mb-1">
              <button
                type="button"
                onClick={handleUpdate}
                className="bg-[#2892CE] text-white update-charges-save-btn duration-200"
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

export default UpdateAdditionalCharges;
