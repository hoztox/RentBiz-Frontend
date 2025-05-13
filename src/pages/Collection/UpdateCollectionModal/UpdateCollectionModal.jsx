import React, { useEffect, useState } from "react";
import "./UpdateCollectionModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Collection/close-icon.svg";
import calendaricon from "../../../assets/Images/Collection/calendar-icon.svg";

const UpdateCollectionModal = ({ isOpen, onClose, selectedRow }) => {
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
    collectionItems: [
      {
        chargeType: "",
        description: "",
        date: "",
        amount: "",
        vat: "",
        balance: "",
        amountPaid: "",
        total: "0",
      },
    ],
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    chargeType: false,
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.collectionItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, collectionItems: updatedItems };
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
      console.log("Collection Updated: ", form);
      console.log("Collection Items: ", formData.collectionItems);
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
        collectionItems: selectedRow.collectionItems?.length
          ? selectedRow.collectionItems.map((item) => ({
              chargeType: item.chargeType || "",
              description: item.description || "",
              date: item.date || "",
              amount: item.amount || "",
              vat: item.vat || "",
              balance: item.balance || "",
              amountPaid: item.amountPaid || "",
              total: item.total || "0",
            }))
          : [
              {
                chargeType: "",
                description: "",
                date: "",
                amount: "",
                vat: "",
                balance: "",
                amountPaid: "",
                total: "0",
              },
            ],
      });
    }
  }, [isOpen, selectedRow]);

  if (!isOpen) return null;

  return (
    <div className="financial-collection-update-modal-wrapper">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 financial-collection-update-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 financial-collection-update-modal-container">
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] financial-collection-update-head">
              Update Collection
            </h2>
            <button
              onClick={onClose}
              className="financial-collection-update-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
            </button>
          </div>

          <div className="md:p-6 md:mt-[-15px]">
            <div className="grid gap-6 financial-collection-update-modal-grid">
              {/* First row */}
              <div className="space-y-2">
                <label className="block financial-collection-update-label">
                  Select Tenancy
                </label>
                <div className="relative">
                  <select
                    value={form.selectTenancy}
                    onChange={(e) => {
                      updateForm("selectTenancy", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add(
                          "financial-collection-update-selected"
                        );
                      } else {
                        e.target.classList.remove(
                          "financial-collection-update-selected"
                        );
                      }
                    }}
                    onFocus={() => setIsSelectOpenTenancy(true)}
                    onBlur={() => setIsSelectOpenTenancy(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-selection ${
                      form.selectTenancy === ""
                        ? "financial-collection-update-selected"
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
                <label className="block financial-collection-update-label">
                  Building Name*
                </label>
                <input
                  type="text"
                  value={form.buildingName}
                  onChange={(e) => updateForm("buildingName", e.target.value)}
                  placeholder="Enter Building Name"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-input"
                />
              </div>

              {/* Second row */}
              <div className="space-y-2">
                <label className="block financial-collection-update-label">
                  Unit Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.unitName}
                    onChange={(e) => updateForm("unitName", e.target.value)}
                    placeholder="Enter Unit Name"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-update-label">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-input"
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

              {/* Table Section */}
              <div className="financial-collection-update-modal-table-wrapper">
                <div className="mt-[10px] overflow-x-auto border border-[#E9E9E9] rounded-md financial-collection-update-modal-overflow-x-auto">
                  {/* Desktop Table */}
                  <div className="financial-collection-update-modal-desktop-table">
                    <table className="w-full border-collapse financial-collection-update-modal-table">
                      <thead>
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[117px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[132px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[137px]">
                            Date
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[117px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[42px]">
                            VAT
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[50px]">
                            Total
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[66px]">
                            Balance
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[118px]">
                            Amount Paid
                          </th>
                          <th className="px-[10px] text-left financial-collection-update-modal-thead uppercase w-[43px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.collectionItems.map((item, index) => (
                          <tr key={index} className="h-[57px]">
                            {/* CHARGE TYPE */}
                            <td className="px-[5px] py-[5px] w-[116px] relative">
                              <select
                                value={item.chargeType}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "chargeType",
                                    e.target.value
                                  )
                                }
                                onFocus={() => toggleDropdown("chargeType")}
                                onBlur={() => toggleDropdown("chargeType")}
                                className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white financial-collection-update-modal-table-select"
                              >
                                <option value="">Choose</option>
                                <option value="rent">Rent</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                              <ChevronDown
                                className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                                  openDropdowns.chargeType ? "rotate-180" : ""
                                }`}
                              />
                            </td>

                            {/* DESCRIPTION */}
                            <td className="px-[5px] py-[5px] w-[150px]">
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
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-modal-table-input"
                              />
                            </td>

                            {/* DATE */}
                            <td className="px-[5px] py-[5px] w-[136px] relative">
                              <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                value={item.date}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-modal-table-input"
                              />
                              <img
                                src={calendaricon}
                                alt="Calendar"
                                className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                              />
                            </td>

                            {/* AMOUNT */}
                            <td className="px-[5px] py-[5px] w-[129px]">
                              <input
                                type="text"
                                placeholder="Enter Amount"
                                value={item.amount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-modal-table-input"
                              />
                            </td>

                            {/* VAT */}
                            <td className="px-[5px] py-[5px] w-[42px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.vat).toFixed(4)}
                            </td>

                            {/* TOTAL */}
                            <td className="px-[5px] py-[5px] w-[44px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.total).toFixed(4)}
                            </td>

                            {/* BALANCE */}
                            <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.balance).toFixed(4)}
                            </td>

                            {/* AMOUNT PAID */}
                            <td className="px-[5px] py-[5px] w-[126px]">
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
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-modal-table-input"
                              />
                            </td>

                            {/* TOTAL */}
                            <td className="px-[5px] py-[5px] w-[35px] text-left text-[14px] font-normal text-[#201D1E]">
                              {Number(item.total).toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Table */}
                  <div className="financial-collection-modal-mobile-table">
                    {formData.collectionItems.map((item, index) => (
                      <div
                        key={index}
                        className="financial-collection-modal-mobile-section"
                      >
                        {/* First Header: Charge Type and Description */}
                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Charge Type
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Description
                          </div>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                          <div className="px-[10px] py-[10px] h-[57px] relative w-[100%]">
                            <select
                              value={item.chargeType}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "chargeType",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white financial-collection-modal-table-select"
                            >
                              <option value="">Choose</option>
                              <option value="rent">Rent</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                            <ChevronDown
                              className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none`}
                            />
                          </div>
                          <div className="px-[10px] py-[10px] w-[100%]">
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
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-modal-table-input"
                            />
                          </div>
                        </div>

                        {/* Second Header: Date, Amount, VAT (3 columns) */}
                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-3">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Date
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Amount
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
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
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-modal-table-input"
                            />
                            <img
                              src={calendaricon}
                              alt="Calendar"
                              className="absolute right-[15px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            />
                          </div>
                          <div className="px-[10px] py-[10px]">
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              value={item.amount}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-modal-table-input"
                            />
                          </div>
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.vat).toFixed(4)}
                          </div>
                        </div>

                        {/* Third Header: Total, Balance, Amount Paid, Total (4 columns) */}
                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-4">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Total
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Balance
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Amount Paid
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Total
                          </div>
                        </div>
                        <div className="grid grid-cols-4">
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.total).toFixed(4)}
                          </div>
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                            {Number(item.balance).toFixed(4)}
                          </div>
                          <div className="px-[10px] py-[10px]">
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
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-modal-table-input"
                            />
                          </div>
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
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
                <label className="block financial-collection-update-label">
                  Payment Date*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.paymentDate}
                    onChange={(e) => updateForm("paymentDate", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-input"
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

              <div className="space-y-2">
                <label className="block financial-collection-update-label">
                  Payment Method*
                </label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => {
                      updateForm("paymentMethod", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add(
                          "financial-collection-update-selected"
                        );
                      } else {
                        e.target.classList.remove(
                          "financial-collection-update-selected"
                        );
                      }
                    }}
                    onFocus={() => setIsSelectOpenStatus(true)}
                    onBlur={() => setIsSelectOpenStatus(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-selection ${
                      form.paymentMethod === ""
                        ? "financial-collection-update-selected"
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
                <label className="block financial-collection-update-label">
                  Remarks
                </label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => updateForm("remarks", e.target.value)}
                  placeholder="Enter Remarks"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-update-input"
                />
              </div>

              <div className="flex items-end justify-end mb-1">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#2892CE] text-white financial-collection-update-save-btn duration-200"
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

export default UpdateCollectionModal;
