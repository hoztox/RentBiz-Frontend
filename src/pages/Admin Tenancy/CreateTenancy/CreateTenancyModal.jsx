import React, { useState } from "react";
import "./CreateTenancyModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/close-icon.svg";
import calendaricon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/calendar-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/delete-icon.svg";
import plusicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/plus-icon.svg";
import { ChevronDown } from "lucide-react";

const CreateTenancyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [showPaymentSchedule, setShowPaymentSchedule] = useState(true);
  const [additionalCharges, setAdditionalCharges] = useState([
    {
      id: "01",
      chargeType: "",
      reason: "",
      dueDate: "",
      status: "Pending",
      amount: "",
      vat: "0",
      total: "0.000",
    },
  ]);
  const [paymentSchedule, setPaymentSchedule] = useState([
    {
      id: "01",
      chargeType: "Deposit",
      reason: "Deposit",
      dueDate: "01-07-2021",
      status: "Pending",
      amount: "0.000",
      vat: "0",
      total: "0.000",
    },
    {
      id: "02",
      chargeType: "Commission",
      reason: "Commission",
      dueDate: "01-07-2021",
      status: "Pending",
      amount: "0.000",
      vat: "0",
      total: "0.000",
    },
    {
      id: "03",
      chargeType: "Rent",
      reason: "Monthly Rent",
      dueDate: "",
      status: "Pending",
      amount: "",
      vat: "0",
      total: "0.000",
    },
  ]);

  const addRow = () => {
    const newId = (additionalCharges.length + 1).toString().padStart(2, "0");
    setAdditionalCharges([
      ...additionalCharges,
      {
        id: newId,
        chargeType: "",
        reason: "",
        dueDate: "",
        status: "Pending",
        amount: "",
        vat: "0",
        total: "0.000",
      },
    ]);
  };

  const togglePaymentSchedule = () => {
    setShowPaymentSchedule(!showPaymentSchedule);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white overflow-y-auto relative modal">
        <div className="p-8 pt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="modal-head">Create New Tenancy</h2>
            <button onClick={onClose} className="close-btn">
              <img src={closeicon} alt="close-button" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block modal-label">Tenant Name*</label>
              <div className="relative">
                <select
                  className="w-full p-2 appearance-none input-box"
                  onFocus={() => setIsSelectOpen(true)}
                  onBlur={() => setIsSelectOpen(false)}
                >
                  <option>Choose</option>
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    isSelectOpen ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>
            <div>
              <label className="block modal-label">Building*</label>
              <div className="relative">
                <select
                  className="w-full p-2 appearance-none input-box"
                  onFocus={() => setIsSelectOpen(true)}
                  onBlur={() => setIsSelectOpen(false)}
                >
                  <option>Choose</option>
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    isSelectOpen ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block modal-label">Unit *</label>
                <div className="relative">
                  <select
                    className="w-full p-2 appearance-none input-box"
                    onFocus={() => setIsSelectOpen(true)}
                    onBlur={() => setIsSelectOpen(false)}
                  >
                    <option>Choose</option>
                  </select>
                  <ChevronDown
                    className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                      isSelectOpen ? "rotate-180" : "rotate-0"
                    }`}
                    width={22}
                    height={22}
                    color="#201D1E"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block modal-label">Rental Months*</label>
                <input
                  type="text"
                  placeholder="Enter Rental Months"
                  className="w-full p-2 input-box"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block modal-label">Start Date*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full p-2 pr-10 input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block modal-label">End Date*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full p-2 pr-10 input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block modal-label">No. Of Payments*</label>
                <input
                  type="text"
                  placeholder="Enter No. Of Payments"
                  className="w-full p-2 input-box"
                />
              </div>
              <div className="w-1/2">
                <label className="block modal-label">First Rent Due On*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full p-2 pr-10 input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block modal-label">Rent Per Frequency</label>
              <input
                type="text"
                placeholder="Enter Rent Per Frequency"
                className="w-full p-2 input-box"
              />
            </div>

            <div>
              <label className="block modal-label">Total Rent Receivable</label>
              <input
                type="text"
                placeholder="Enter Total Rent Receivable"
                className="w-full p-2 input-box"
              />
            </div>
            <div>
              <label className="block modal-label">Deposit (If Any)</label>
              <input
                type="text"
                placeholder="Enter Deposit"
                className="w-full p-2 input-box"
              />
            </div>

            <div>
              <label className="block modal-label">Commission (If Any)</label>
              <input
                typesis
                type="text"
                placeholder="Enter Commission"
                className="w-full p-2 input-box"
              />
            </div>
            <div>
              <label className="block modal-label">Remarks*</label>
              <input
                type="text"
                placeholder="Enter Remarks"
                className="w-full p-2 input-box"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3
              className="text-[#2892CE] mb-3"
              style={{
                fontSize: "15px",
                fontWeight: "600",
                fontFamily: "Public Sans",
              }}
            >
              Additional Charges
            </h3>
            <div className="mt-6 overflow-x-auto border border-[#E9E9E9] rounded-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E9E9] h-[57px]">
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[20px]">
                      NO
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[138px]">
                      CHARGE TYPE
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[162px]">
                      REASON
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[173px]">
                      DUE DATE
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[55px]">
                      STATUS
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[148px]">
                      AMOUNT
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[25px]">
                      VAT
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[43px]">
                      TOTAL
                    </th>
                    <th className="px-[10px] text-left invoice-modal-thead uppercase w-[61px]">
                      REMOVE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {additionalCharges.map((charge, index) => (
                    <tr key={charge.id} className="border-t border-[#E9E9E9]">
                      {/* NO */}
                      <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                        {charge.id}
                      </td>

                      {/* CHARGE TYPE */}
                      <td className="px-[10px] py-[5px] w-[138px] relative">
                        <select
                          className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white invoice-modal-table-select"
                          onFocus={() => setIsSelectOpen(true)}
                          onBlur={() => setIsSelectOpen(false)}
                        >
                          <option value="">Choose</option>
                        </select>
                        <ChevronDown
                          className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                            isSelectOpen ? "rotate-180" : ""
                          }`}
                        />
                      </td>

                      {/* REASON */}
                      <td className="px-[10px] py-[5px] w-[162px]">
                        <input
                          type="text"
                          placeholder="Enter Reason"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                        />
                      </td>

                      {/* DUE DATE */}
                      <td className="px-[10px] py-[5px] w-[173px] relative">
                        <input
                          type="text"
                          placeholder="mm/dd/yyyy"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                        />
                        <img
                          src={calendaricon}
                          alt="Calendar"
                          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        />
                      </td>

                      {/* STATUS */}
                      <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                        Pending
                      </td>

                      {/* AMOUNT */}
                      <td className="px-[10px] py-[5px] w-[148px]">
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                        />
                      </td>

                      {/* VAT */}
                      <td className="px-[10px] py-[5px] w-[25px] text-[14px] text-[#201D1E] text-center">
                        {charge.vat}
                      </td>

                      {/* TOTAL */}
                      <td className="px-[10px] py-[5px] w-[35px] text-[14px] text-[#201D1E]">
                        {Number(charge.total || 0).toFixed(4)}
                      </td>

                      {/* REMOVE */}
                      <td className="px-[10px] py-[5px] w-[30px]">
                        <button>
                          <img
                            src={deleteicon}
                            alt="delete"
                            className="w-[60px] h-[20px] mt-1"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addRow}
              className="mt-6 bg-[#2892CE] hover:bg-[#1f6c99] text-white px-4 pl-6 mb-10 flex items-center addrow-btn"
            >
              Add Row
              <img
                src={plusicon}
                alt="add"
                className="w-[20px] h-[20px] ml-2"
              />
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={togglePaymentSchedule}
              className="bg-white text-[#2892CE] px-4 py-2 border border-[#E9E9E9] rounded hidepayement-btn"
            >
              {showPaymentSchedule
                ? "Hide Payment Schedule"
                : "Show Payment Schedule"}
            </button>

            {showPaymentSchedule && (
              <div className="mt-6 overflow-x-auto border border-[#E9E9E9] rounded-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E9E9E9] h-[57px]">
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[20px]">
                        NO
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[138px]">
                        CHARGE TYPE
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[162px]">
                        REASON
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[173px]">
                        DUE DATE
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[55px]">
                        STATUS
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[148px]">
                        AMOUNT
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[25px]">
                        VAT
                      </th>
                      <th className="px-[10px] text-left invoice-modal-thead uppercase w-[43px]">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentSchedule.map((item) => (
                      <tr key={item.id} className="border-t border-[#E9E9E9] h-[57px]">
                        {/* NO */}
                        <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                          {item.id}
                        </td>

                        {/* CHARGE TYPE */}
                        <td className="px-[10px] py-[5px] w-[138px] text-[14px] text-[#201D1E]">
                          {item.chargeType}
                        </td>

                        {/* REASON */}
                        <td className="px-[10px] py-[5px] w-[162px] text-[14px] text-[#201D1E]">
                          {item.reason}
                        </td>

                        {/* DUE DATE */}
                        <td className="px-[10px] py-[5px] w-[173px] relative">
                          {item.id === "03" ? (
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                              />
                              <img
                                src={calendaricon}
                                alt="Calendar"
                                className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                              />
                            </div>
                          ) : (
                            <span className="text-[14px] text-[#201D1E]">
                              {item.dueDate}
                            </span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                          {item.status}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-[10px] py-[5px] w-[148px]">
                          {item.id === "03" ? (
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                            />
                          ) : (
                            <span className="text-[14px] text-[#201D1E]">
                              {item.amount}
                            </span>
                          )}
                        </td>

                        {/* VAT */}
                        <td className="px-[10px] py-[5px] w-[25px] text-[14px] text-[#201D1E] text-center">
                          {item.vat}
                        </td>

                        {/* TOTAL */}
                        <td className="px-[10px] py-[5px] w-[35px] text-[14px] text-[#201D1E]">
                          {Number(item.total || 0).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 mb-4">
            <button className="bg-[#2892CE] text-white px-8 py-2 save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenancyModal;
