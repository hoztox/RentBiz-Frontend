import React, { useState } from "react";
import "./CreateTenancyModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/close-icon.svg";
import calendaricon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/calendar-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/delete-icon.svg";
import plusicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/plus-icon.svg";
import { ChevronDown } from "lucide-react";

const CreateTenancyModal = ({ isOpen, onClose }) => {
  const [selectOpenStates, setSelectOpenStates] = useState({});
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
      dueDate: "01-07-2025",
      status: "Pending",
      amount: "0.000",
      vat: "0",
      total: "0.000",
    },
  ]);
  const [expandedStates, setExpandedStates] = useState(
    paymentSchedule.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  const toggleSelectOpen = (selectId) => {
    setSelectOpenStates((prev) => ({
      ...prev,
      [selectId]: !prev[selectId],
    }));
  };

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

  const removeRow = (id) => {
    setAdditionalCharges(
      additionalCharges.filter((charge) => charge.id !== id)
    );
  };

  const togglePaymentSchedule = () => {
    setShowPaymentSchedule(!showPaymentSchedule);
  };

  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="tenancy-modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="tenancy-modal-container"
      >
        <div className="md:p-8 md:pt-8">
          <div className="flex justify-between items-center md:mb-8">
            <h2 className="tenancy-modal-head">Create New Tenancy</h2>
            <button
              onClick={onClose}
              className="tenancy-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="close-button" />
            </button>
          </div>

          <div className="tenancy-modal-grid gap-6">
            <div>
              <label className="block tenancy-modal-label">Tenant Name*</label>
              <div className="relative">
                <select
                  className="w-full p-2 appearance-none tenancy-input-box"
                  onFocus={() => toggleSelectOpen("tenantName")}
                  onBlur={() => toggleSelectOpen("tenantName")}
                >
                  <option>Choose</option>
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    selectOpenStates["tenantName"] ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>
            <div>
              <label className="block tenancy-modal-label">Building*</label>
              <div className="relative">
                <select
                  className="w-full p-2 appearance-none tenancy-input-box"
                  onFocus={() => toggleSelectOpen("building")}
                  onBlur={() => toggleSelectOpen("building")}
                >
                  <option>Choose</option>
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    selectOpenStates["building"] ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">Unit *</label>
                <div className="relative">
                  <select
                    className="w-full p-2 appearance-none tenancy-input-box"
                    onFocus={() => toggleSelectOpen("unit")}
                    onBlur={() => toggleSelectOpen("unit")}
                  >
                    <option>Choose</option>
                  </select>
                  <ChevronDown
                    className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                      selectOpenStates["unit"] ? "rotate-180" : "rotate-0"
                    }`}
                    width={22}
                    height={22}
                    color="#201D1E"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">
                  Rental Months*
                </label>
                <input
                  type="text"
                  placeholder="Enter Rental Months"
                  className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">Start Date*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full p-2 pr-10 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">End Date*</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full p-2 pr-10 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">
                  No. Of Payments*
                </label>
                <input
                  type="text"
                  placeholder="Enter No. Of Payments"
                  className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                />
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">
                  First Rent Due On*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full p-2 pr-10 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img src={calendaricon} alt="" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block tenancy-modal-label">
                Rent Per Frequency
              </label>
              <input
                type="text"
                placeholder="Enter Rent Per Frequency"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
              />
            </div>

            <div>
              <label className="block tenancy-modal-label">
                Total Rent Receivable
              </label>
              <input
                type="text"
                placeholder="Enter Total Rent Receivable"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">
                Deposit (If Any)
              </label>
              <input
                type="text"
                placeholder="Enter Deposit"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
              />
            </div>

            <div>
              <label className="block tenancy-modal-label">
                Commission (If Any)
              </label>
              <input
                type="text"
                placeholder="Enter Commission"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">Remarks*</label>
              <input
                type="text"
                placeholder="Enter Remarks"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
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
            <div className="mt-6 tenancy-overflow-x-auto tenancy-additional-charges-container border border-[#E9E9E9] rounded-md">
              <div className="tenancy-desktop-table">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E9E9E9] h-[57px]">
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[20px]">
                        NO
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[138px]">
                        CHARGE TYPE
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[162px]">
                        REASON
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[173px]">
                        DUE DATE
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[55px]">
                        STATUS
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[148px]">
                        AMOUNT
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[25px]">
                        VAT
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[43px]">
                        TOTAL
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[61px]">
                        REMOVE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalCharges.map((charge) => (
                      <tr key={charge.id} className="border-t border-[#E9E9E9]">
                        <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                          {charge.id}
                        </td>
                        <td className="px-[10px] py-[5px] w-[138px] relative">
                          <select
                            className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select"
                            onFocus={() =>
                              toggleSelectOpen(`charge-${charge.id}`)
                            }
                            onBlur={() =>
                              toggleSelectOpen(`charge-${charge.id}`)
                            }
                          >
                            <option value="">Choose</option>
                          </select>
                          <ChevronDown
                            className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                              selectOpenStates[`charge-${charge.id}`]
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[162px]">
                          <input
                            type="text"
                            placeholder="Enter Reason"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[173px] relative">
                          <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                          <img
                            src={calendaricon}
                            alt="Calendar"
                            className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                          Pending
                        </td>
                        <td className="px-[10px] py-[5px] w-[148px]">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[25px] text-[14px] text-[#201D1E] text-center">
                          {charge.vat}
                        </td>
                        <td className="px-[10px] py-[5px] w-[35px] text-[14px] text-[#201D1E]">
                          {Number(charge.total || 0).toFixed(4)}
                        </td>
                        <td className="px-[10px] py-[5px] w-[30px]">
                          <button onClick={() => removeRow(charge.id)}>
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
              {/* Mobile Table */}
              <div className="tenancy-mobile-table">
                {additionalCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="border-b border-[#E9E9E9] last:border-b-0"
                  >
                    {/* First Row - 3 columns */}
                    <div className="flex justify-start border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        NO
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[44%]">
                        CHARGE TYPE
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        REASON
                      </div>
                    </div>
                    <div className="flex justify-start h-[67px] border-b border-[#E9E9E9]">
                      <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                        {charge.id}
                      </div>
                      <div className="px-[10px] py-[13px] relative w-full">
                        <select
                          className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select"
                          onFocus={() =>
                            toggleSelectOpen(`charge-${charge.id}`)
                          }
                          onBlur={() => toggleSelectOpen(`charge-${charge.id}`)}
                        >
                          <option value="">Choose</option>
                        </select>
                        <ChevronDown
                          className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                            selectOpenStates[`charge-${charge.id}`]
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="px-[10px] py-[13px] w-full">
                        <input
                          type="text"
                          placeholder="Enter Reason"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                        />
                      </div>
                    </div>

                    {/* Second Row - 3 columns */}
                    <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        DUE DATE
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead w-[7%] uppercase">
                        STATUS
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead w-[41.5%] uppercase">
                        AMOUNT
                      </div>
                    </div>
                    <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                      <div className="px-[9px] py-[13px] relative w-full">
                        <input
                          type="text"
                          placeholder="mm/dd/yyyy"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                        />
                        <img
                          src={calendaricon}
                          alt="Calendar"
                          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        />
                      </div>
                      <div className="py-[10px] text-[14px] text-[#201D1E]">
                        Pending
                      </div>
                      <div className="px-[10px] py-[13px] w-full">
                        <input
                          type="text"
                          placeholder="Enter Amount"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                        />
                      </div>
                    </div>

                    {/* Third Row - 3 columns */}
                    <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead w-[20%] uppercase">
                        VAT
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        TOTAL
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        REMOVE
                      </div>
                    </div>
                    <div className="flex justify-between h-[57px]">
                      <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] text-center">
                        {charge.vat}
                      </div>
                      <div className="px-[13px] py-[13px] text-[14px] w-[5%] text-[#201D1E]">
                        {Number(charge.total || 0).toFixed(4)}
                      </div>
                      <div className="px-[10px] py-[3px] flex justify-center">
                        <button onClick={() => removeRow(charge.id)}>
                          <img
                            src={deleteicon}
                            alt="delete"
                            className="w-[60px] h-[20px]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={addRow}
              className="mt-6 bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-4 pl-6 mb-10 flex items-center tenancy-addrow-btn"
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
              className="bg-white text-[#2892CE] px-4 py-2 border border-[#E9E9E9] rounded tenancy-hidepayement-btn"
            >
              {showPaymentSchedule
                ? "Hide Payment Schedule"
                : "Show Payment Schedule"}
            </button>

            {showPaymentSchedule && (
              <div className="mt-6 tenancy-overflow-x-auto">
                <div className="tenancy-desktop-table">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#E9E9E9] h-[57px]">
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[20px]">
                          NO
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[138px]">
                          CHARGE TYPE
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[162px]">
                          REASON
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[173px]">
                          DUE DATE
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[55px]">
                          STATUS
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[148px]">
                          AMOUNT
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[25px]">
                          VAT
                        </th>
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[43px]">
                          TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-[#E9E9E9] h-[57px]"
                        >
                          <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                            {item.id}
                          </td>
                          <td className="px-[10px] py-[5px] w-[138px] text-[14px] text-[#201D1E]">
                            {item.chargeType}
                          </td>
                          <td className="px-[10px] py-[5px] w-[162px] text-[14px] text-[#201D1E]">
                            {item.reason}
                          </td>
                          <td className="px-[10px] py-[5px] w-[173px] relative">
                            {item.id === "03" ? (
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="mm/dd/yyyy"
                                  className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
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
                          <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                            {item.status}
                          </td>
                          <td className="px-[10px] py-[5px] w-[148px]">
                            {item.id === "03" ? (
                              <input
                                type="text"
                                placeholder="Enter Amount"
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                              />
                            ) : (
                              <span className="text-[14px] text-[#201D1E]">
                                {item.amount}
                              </span>
                            )}
                          </td>
                          <td className="px-[10px] py-[5px] w-[25px] text-[14px] text-[#201D1E] text-center">
                            {item.vat}
                          </td>
                          <td className="px-[10px] py-[5px] w-[35px] text-[14px] text-[#201D1E]">
                            {Number(item.total || 0).toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tenancy-mobile-table">
                  {paymentSchedule.map((item) => (
                    <div
                      key={item.id}
                      className="tenancy-mobile-payment-section"
                    >
                      {/* First Row - Header */}
                      <div
                        className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${
                          expandedStates[item.id] ? "bg-[#F2F2F2]" : "bg-white"
                        }`}
                      >
                        <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                          NO
                        </div>
                        <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                          CHARGE TYPE
                        </div>
                        <div className="px-[10px] w-[30%] flex items-center tenancy-modal-thead uppercase">
                          REASON
                        </div>
                      </div>
                      {/* First Row - Content (Clickable) */}
                      <div
                        className={`flex justify-between h-[67px] cursor-pointer ${
                          expandedStates[item.id]
                            ? "border-b border-[#E9E9E9]"
                            : ""
                        }`}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                          {item.id}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%] text-[14px] text-[#201D1E]">
                          {item.chargeType}
                        </div>
                        <div className="px-[10px] py-[13px] w-[30%] text-[14px] text-[#201D1E]">
                          {item.reason}
                        </div>
                      </div>

                      {expandedStates[item.id] && (
                        <>
                          {/* Second Row - Header */}
                          <div
                        className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${
                          expandedStates[item.id] ? "bg-[#F2F2F2]" : "bg-white"
                        }`}
                      >
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              DUE DATE
                            </div>
                            <div className="px-[10px] flex items-center w-[7%] tenancy-modal-thead uppercase">
                              STATUS
                            </div>
                            <div className="px-[10px] flex items-center w-[41.5%] tenancy-modal-thead uppercase">
                              AMOUNT
                            </div>
                          </div>
                          {/* Second Row - Content */}
                          <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                            <div className="px-[9px] py-[13px] relative w-full">
                              {item.id === "03" ? (
                                <>
                                  <input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                                  />
                                  <img
                                    src={calendaricon}
                                    alt="Calendar"
                                    className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                  />
                                </>
                              ) : (
                                <span className="text-[14px] text-[#201D1E] w-full">
                                  {item.dueDate}
                                </span>
                              )}
                            </div>
                            <div className="py-[10px] text-[14px] text-[#201D1E]">
                              {item.status}
                            </div>
                            <div className="px-[10px] py-[13px] w-full">
                              {item.id === "03" ? (
                                <input
                                  type="text"
                                  placeholder="Enter Amount"
                                  className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                                />
                              ) : (
                                <span className="text-[14px] text-[#201D1E]">
                                  {item.amount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Third Row - Header */}
                          <div
                        className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${
                          expandedStates[item.id] ? "bg-[#F2F2F2]" : "bg-white"
                        }`}
                      >
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[50%]">
                              VAT
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[50%]">
                              TOTAL
                            </div>
                          </div>
                          {/* Third Row - Content */}
                          <div className="flex justify-between h-[57px]">
                            <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] text-center">
                              {item.vat}
                            </div>
                            <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] w-[51%]">
                              {Number(item.total || 0).toFixed(4)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 mb-4">
            <button className="bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-8 py-2 tenancy-save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenancyModal;
