import React, { useEffect, useState } from "react";
import "./UpdateRefundModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Refund/close-icon.svg";
import calendaricon from "../../../assets/Images/Refund/calendar-icon.svg";

const UpdateRefundModal = ({ isOpen, onClose, selectedRow }) => {
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
      onClose();
    } else {
      console.log("Please fill all required fields");
    }
  };

  useEffect(() => {
    if (isOpen && selectedRow) {
      setForm({
        selectTenancy: selectedRow.selectTenancy || "",
        buildingName: selectedRow.buildingName || "",
        unitName: selectedRow.unitName || "",
        endDate: selectedRow.endDate || "",
        paymentDate: selectedRow.paymentDate || "",
        paymentMethod: selectedRow.paymentMethod || "",
        remarks: selectedRow.remarks || "",
      });
      setFormData({
        refundItems: selectedRow.refundItems?.length
          ? selectedRow.refundItems.map((item) => ({
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
    }
  }, [isOpen, selectedRow]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center p-6 mt-2">
          <h2 className="text-[#201D1E] update-refund-head">
            Update Refund
          </h2>
          <button
            onClick={onClose}
            className="update-refund-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="p-6 mt-[-15px]">
          <div className="grid grid-cols-2 gap-6">
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
                      e.target.classList.update("update-refund-selected");
                    } else {
                      e.target.classList.remove("update-refund-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenTenancy(true)}
                  onBlur={() => setIsSelectOpenTenancy(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-selection ${
                    form.selectTenancy === ""
                      ? "update-refund-selected"
                      : ""
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
            <div className="col-span-2">
              <div className="mt-[10px] overflow-x-auto border border-[#E9E9E9] rounded-md">
                <table className="w-full border-collapse">
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
                        {/* CHARGE TYPE */}
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
                            <option value="maintanence">Maintanence</option>
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
                        <td className="px-[5px] py-[5px] w-[130px] relative">
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
                          0000
                        </td>

                        {/* TOTAL */}
                        <td className="px-[5px] py-[5px] w-[44px] text-left text-[14px] font-normal text-[#201D1E]">
                          {Number(item.total).toFixed(4)}
                        </td>

                        {/* PAID AMOUNT */}
                        <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] font-normal text-[#201D1E]">
                          {Number(item.paidAmount).toFixed(4)}
                        </td>

                        {/* AMOUNT REFUND */}
                        <td className="px-[5px] py-[5px] w-[120px]">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            value={item.amountPaid}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "amountPaid",
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
                      e.target.classList.update("update-refund-selected");
                    } else {
                      e.target.classList.remove("update-refund-selected");
                    }
                  }}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-selection ${
                    form.paymentMethod === ""
                      ? "update-refund-selected"
                      : ""
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

            {/* Sixth row - Remarks and Save button on same row */}
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
  );
};

export default UpdateRefundModal;
