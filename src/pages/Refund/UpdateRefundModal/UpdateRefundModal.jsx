import React, { useEffect, useState } from "react";
import "./UpdateRefundModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Refund/close-icon.svg";
import calendaricon from "../../../assets/Images/Refund/calendar-icon.svg";
import { useModal } from "../../../context/ModalContext";

const UpdateRefundModal = () => {
  const { modalState, closeModal } = useModal();
  const [form, setForm] = useState({
    selectTenancy: "",
    buildingName: "",
    unitName: "",
    endDate: "",
    paymentDate: "",
    paymentMethod: "",
    remarks: "",
  });
  const [isSelectOpenTenancy, setIsSelectOpenTenancy] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);
  const [formData, setFormData] = useState({
    refundItems: [
      {
        charge: "",
        description: "",
        date: "",
        amount: "",
        vat: "",
        paidAmount: "",
        amountRefund: "",
        total: "0",
      },
    ],
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    charge: false,
  });

  // Reset form state when modal opens or data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.data) {
      setForm({
        selectTenancy: modalState.data.selectTenancy || "",
        buildingName: modalState.data.buildingName || "",
        unitName: modalState.data.unitName || "",
        endDate: modalState.data.endDate || "",
        paymentDate: modalState.data.paymentDate || "",
        paymentMethod: modalState.data.paymentMethod || "",
        remarks: modalState.data.remarks || "",
      });
      setFormData({
        refundItems: modalState.data.refundItems?.length
          ? modalState.data.refundItems.map((item) => ({
              charge: item.charge || "",
              description: item.description || "",
              date: item.date || "",
              amount: item.amount || "",
              vat: item.vat || "",
              paidAmount: item.paidAmount || "",
              amountRefund: item.amountRefund || "",
              total: item.total || "0",
            }))
          : [
              {
                charge: "",
                description: "",
                date: "",
                amount: "",
                vat: "",
                paidAmount: "",
                amountRefund: "",
                total: "0",
              },
            ],
      });
    } else {
      // Reset form when modal is closed
      setForm({
        selectTenancy: "",
        buildingName: "",
        unitName: "",
        endDate: "",
        paymentDate: "",
        paymentMethod: "",
        remarks: "",
      });
      setFormData({
        refundItems: [
          {
            charge: "",
            description: "",
            date: "",
            amount: "",
            vat: "",
            paidAmount: "",
            amountRefund: "",
            total: "0",
          },
        ],
      });
    }
  }, [modalState.isOpen, modalState.data]);

  // Only render for "update-refund" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-refund" ||
    !modalState.data
  ) {
    return null;
  }

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.refundItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, refundItems: updatedItems };
    });
  };

  const toggleDropdown = (field) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdate = () => {
    const {
      selectTenancy,
      buildingName,
      unitName,
      endDate,
      paymentDate,
      paymentMethod,
      remarks,
    } = form;

    if (
      selectTenancy &&
      buildingName &&
      unitName &&
      endDate &&
      paymentDate &&
      paymentMethod &&
      remarks
    ) {
      console.log("Refund Updated: ", form);
      console.log("Refund Items: ", formData.refundItems);
      closeModal();
    } else {
      console.log("Please fill all required fields");
    }
  };

  return (
    <div className="update-refund-modal-wrapper">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 update-refund-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 update-refund-modal-container">
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] update-refund-head">
              Update Refund
            </h2>
            <button
              onClick={closeModal}
              className="update-refund-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
            </button>
          </div>

          <div className="md:p-6 mt-[-15px]">
            <div className="grid gap-6 update-refund-modal-grid">
              {/* First row */}
              <div className="space-y-2">
                <label className="block update-refund-label">
                  Select Tenancy
                </label>
                <div className="relative">
                  <select
                    value={form.selectTenancy}
                    onChange={(e) => {
                      updateForm("selectTenancy", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("update-refund-selected");
                      } else {
                        e.target.classList.remove("update-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenTenancy(true)}
                    onBlur={() => setIsSelectOpenTenancy(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-selection ${
                      form.selectTenancy === "" ? "update-refund-selected" : ""
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
                <label className="block update-refund-label">
                  Building Name*
                </label>
                <input
                  type="text"
                  value={form.buildingName}
                  onChange={(e) => updateForm("buildingName", e.target.value)}
                  placeholder="Enter Building Name"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                />
              </div>

              {/* Second row */}
              <div className="space-y-2">
                <label className="block update-refund-label">
                  Unit Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.unitName}
                    onChange={(e) => updateForm("unitName", e.target.value)}
                    placeholder="Enter Unit Name"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block update-refund-label">End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center px-2">
                    <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="update-refund-modal-table-wrapper">
                <div className="mt-[10px] overflow-x-auto border border-[#E9E9E9] rounded-md update-refund-modal-overflow-x-auto">
                  {/* Desktop Table */}
                  <div className="update-refund-modal-desktop-table">
                    <table className="w-full border-collapse update-refund-modal-table">
                      <thead>
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[102px]">
                            Charge
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[130px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[136px]">
                            Date
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[113px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[42px]">
                            VAT
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[49px]">
                            Total
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[120px]">
                            Paid Amount
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[136px]">
                            Amount Refund
                          </th>
                          <th className="px-[10px] text-left refund-modal-thead uppercase w-[43px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.refundItems.map((item, index) => (
                          <tr key={index} className="h-[57px]">
                            {/* CHARGE */}
                            <td className="px-[5px] py-[5px] w-[102px] relative">
                              <select
                                value={item.charge}
                                onChange={(e) =>
                                  handleItemChange(index, "charge", e.target.value)
                                }
                                onFocus={() => toggleDropdown("charge")}
                                onBlur={() => toggleDropdown("charge")}
                                className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white refund-modal-table-select"
                              >
                                <option value="">Choose</option>
                                <option value="rent">Rent</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                              <ChevronDown
                                className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                                  openDropdowns.charge ? "rotate-180" : ""
                                }`}
                              />
                            </td>

                            {/* DESCRIPTION */}
                            <td className="px-[5px] py-[5px] w-[130px]">
                              <input
                                type="text"
                                placeholder="Enter Description"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 refund-modal-table-input"
                              />
                            </td>

                            {/* DATE */}
                            <td className="px-[5px] py-[5px] w-[136px] relative">
                              <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                value={item.date}
                                onChange={(e) =>
                                  handleItemChange(index, "date", e.target.value)
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 refund-modal-table-input"
                              />
                              <img
                                src={calendaricon}
                                alt="Calendar"
                                className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                              />
                            </td>

                            {/* AMOUNT */}
                            <td className="px-[5px] py-[5px] w-[113px]">
                              <input
                                type="text"
                                placeholder="Enter Amount"
                                value={item.amount}
                                onChange={(e) =>
                                  handleItemChange(index, "amount", e.target.value)
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 refund-modal-table-input"
                              />
                            </td>

                            {/* VAT */}
                            <td className="px-[5px] py-[5px] w-[42px] text-left text-[14px] font-normal text-[#677487]">
                              {Number(item.vat).toFixed(4)}
                            </td>

                            {/* TOTAL */}
                            <td className="px-[5px] py-[5px] w-[49px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.total).toFixed(4)}
                            </td>

                            {/* PAID AMOUNT */}
                            <td className="px-[5px] py-[5px] w-[120px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.paidAmount).toFixed(4)}
                            </td>

                            {/* AMOUNT REFUND */}
                            <td className="px-[5px] py-[5px] w-[136px]">
                              <input
                                type="text"
                                placeholder="Enter Amount"
                                value={item.amountRefund}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "amountRefund",
                                    e.target.value
                                  )
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 refund-modal-table-input"
                              />
                            </td>

                            {/* TOTAL */}
                            <td className="px-[5px] py-[5px] w-[43px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.total).toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Table */}
                  <div className="update-refund-modal-mobile-table">
                    {formData.refundItems.map((item, index) => (
                      <div
                        key={index}
                        className="update-refund-modal-mobile-section"
                      >
                        {/* First Header: Charge and Description */}
                        <div className="update-refund-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Charge
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Description
                          </div>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                          <div className="px-[10px] py-[10px] h-[57px] relative">
                            <select
                              value={item.charge}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "charge",
                                  e.target.value
                                )
                              }
                              onFocus={() => toggleDropdown("charge")}
                              onBlur={() => toggleDropdown("charge")}
                              className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white update-refund-modal-mobile-table-select"
                            >
                              <option value="">Choose</option>
                              <option value="rent">Rent</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                            <ChevronDown
                              className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                                openDropdowns.charge ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <div className="px-[10px] py-[10px]">
                            <input
                              type="text"
                              placeholder="Enter Description"
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-modal-mobile-table-input"
                            />
                          </div>
                        </div>

                        {/* Second Header: Date, Amount, VAT */}
                        <div className="update-refund-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-3">
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Date
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Amount
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            VAT
                          </div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-[#E9E9E9]">
                          <div className="px-[10px] py-[10px] relative">
                            <input
                              type="text"
                              placeholder="mm/dd/yyyy"
                              value={item.date}
                              onChange={(e) =>
                                handleItemChange(index, "date", e.target.value)
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-modal-mobile-table-input"
                            />
                            <img
                              src={calendaricon}
                              alt="Calendar"
                              className="absolute right-[10px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            />
                          </div>
                          <div className="px-[10px] py-[10px]">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              value={item.amount}
                              onChange={(e) =>
                                handleItemChange(index, "amount", e.target.value)
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-modal-mobile-table-input"
                            />
                          </div>
                          <div className="px-[10px] py-[10px] flex items-center text-[14px] font-normal text-[#677487]">
                            {Number(item.vat).toFixed(4)}
                          </div>
                        </div>

                        {/* Third Header: Total, Paid Amount, Amount Refund, Total */}
                        <div className="update-refund-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-4">
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Total
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Paid Amount
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Amount Refund
                          </div>
                          <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                            Total
                          </div>
                        </div>
                        <div className="grid grid-cols-4">
                          <div className="px-[10px] py-[10px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.total).toFixed(4)}
                          </div>
                          <div className="px-[10px] py-[10px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.paidAmount).toFixed(4)}
                          </div>
                          <div className="px-[10px] py-[10px]">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              value={item.amountRefund}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "amountRefund",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-modal-mobile-table-input"
                            />
                          </div>
                          <div className="px-[10px] py-[10px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.total).toFixed(4)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Third row */}
              <div className="space-y-2">
                <label className="block update-refund-label">
                  Payment Date*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.paymentDate}
                    onChange={(e) => updateForm("paymentDate", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center px-2">
                    <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block update-refund-label">
                  Payment Method*
                </label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => {
                      updateForm("paymentMethod", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("update-refund-selected");
                      } else {
                        e.target.classList.remove("update-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenStatus(true)}
                    onBlur={() => setIsSelectOpenStatus(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-selection ${
                      form.paymentMethod === "" ? "update-refund-selected" : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Choose
                    </option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
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

              {/* Fourth row - Remarks and Save button on same row */}
              <div className="space-y-2 mb-1">
                <label className="block update-refund-label">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => updateForm("remarks", e.target.value)}
                  placeholder="Enter Remarks"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                />
              </div>

              <div className="flex items-end justify-end mb-1">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#2892CE] text-white update-refund-save-btn duration-200"
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

export default UpdateRefundModal;