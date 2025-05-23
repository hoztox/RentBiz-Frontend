import React, { useEffect, useState } from "react";
import "./AddInvoiceModal.css";
import { ChevronDown } from "lucide-react";
import calendaricon from "../../../assets/Images/Invoice/calendar-icon.svg";
import closeicon from "../../../assets/Images/Invoice/close-icon.svg";
import { useModal } from "../../../context/ModalContext";

const AddInvoiceModal = () => {
  const { modalState, closeModal } = useModal();
  const [formData, setFormData] = useState({
    tenancy: "",
    inDate: "",
    buildingName: "",
    unitName: "",
    endDate: "",
    invoiceItems: [
      {
        charge: "",
        description: "",
        date: "",
        amount: "",
        select: "",
        total: "0.0000",
      },
    ],
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    tenancy: false,
    charge: false,
    select: false,
  });

  useEffect(() => {
    if (modalState.isOpen) {
      setFormData({
        tenancy: "",
        inDate: "",
        buildingName: "",
        unitName: "",
        endDate: "",
        invoiceItems: [
          {
            charge: "",
            description: "",
            date: "",
            amount: "",
            select: "",
            total: "0.0000",
          },
        ],
      });
    }
  }, [modalState.isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.invoiceItems];
    updatedItems[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      invoiceItems: updatedItems,
    }));
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = () => {
    console.log("Invoice Data Saved: ", formData);
    closeModal();
  };

  // Only render for "create-invoice" type
  if (!modalState.isOpen || modalState.type !== "create-invoice") {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="invoice-modal-container bg-white rounded-md w-[1006px] p-6">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="text-[#201D1E] invoice-modal-head">
            Create New Invoice
          </h2>
          <button
            onClick={closeModal}
            className="invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="invoice-modal-grid gap-6">
          <div>
            <label className="block mb-3 invoice-modal-label">
              Select Tenancy
            </label>
            <div className="relative">
              <select
                name="tenancy"
                value={formData.tenancy}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === "") {
                    e.target.classList.add("invoice-modal-selected");
                  } else {
                    e.target.classList.remove("invoice-modal-selected");
                  }
                }}
                onFocus={() => toggleDropdown("tenancy")}
                onBlur={() => toggleDropdown("tenancy")}
                className={`block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none invoice-modal-select ${
                  formData.tenancy === "" ? "invoice-modal-selected" : ""
                }`}
              >
                <option value="" disabled hidden>
                  Choose
                </option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-gray-700">
                <ChevronDown
                  className={`h-4 w-4 text-[#201D1E] transition-transform duration-200 ${
                    openDropdowns.tenancy ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-3 invoice-modal-label">In Date*</label>
            <div className="relative">
              <input
                type="text"
                name="inDate"
                placeholder="dd/mm/yyyy"
                value={formData.inDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-input"
              />
              <div className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
                <img src={calendaricon} alt="Calendar" className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-3 invoice-modal-label">
              Building Name*
            </label>
            <input
              type="text"
              name="buildingName"
              placeholder="Enter Building Name"
              value={formData.buildingName}
              onChange={handleChange}
              className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-input"
            />
          </div>

          <div>
            <label className="block mb-3 invoice-modal-label">Unit Name*</label>
            <input
              type="text"
              name="unitName"
              placeholder="Enter Unit Name"
              value={formData.unitName}
              onChange={handleChange}
              className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-input"
            />
          </div>

          <div>
            <label className="block mb-3 invoice-modal-label">End Date</label>
            <div className="relative">
              <input
                type="text"
                name="endDate"
                placeholder="dd/mm/yyyy"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-input"
              />
              <div className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
                <img src={calendaricon} alt="Calendar" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-6 invoice-modal-overflow-x-auto border border-[#E9E9E9] rounded-md">
          <div className="invoice-modal-desktop-table">
            <table className="invoice-modal-table border-collapse">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[50px]">
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[110px]">
                    Charge
                  </th>
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[160px]">
                    Description
                  </th>
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                    Date
                  </th>
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                    Amount
                  </th>
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[110px]">
                    Select
                  </th>
                  <th className="px-[10px] text-left invoice-modal-thead uppercase w-[60px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-[10px] py-[5px] w-[110px] h-[57px] relative">
                      <select
                        value={item.charge}
                        onChange={(e) =>
                          handleItemChange(index, "charge", e.target.value)
                        }
                        onFocus={() => toggleDropdown("charge")}
                        onBlur={() => toggleDropdown("charge")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.charge ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[160px]">
                      <input
                        type="text"
                        placeholder="Enter Reason"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[120px] relative">
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        value={item.date}
                        onChange={(e) =>
                          handleItemChange(index, "date", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                      />
                      <img
                        src={calendaricon}
                        alt="Calendar"
                        className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[120px]">
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        value={item.amount}
                        onChange={(e) =>
                          handleItemChange(index, "amount", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[110px] relative">
                      <select
                        value={item.select}
                        onChange={(e) =>
                          handleItemChange(index, "select", e.target.value)
                        }
                        onFocus={() => toggleDropdown("select")}
                        onBlur={() => toggleDropdown("select")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.select ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[60px] text-left text-[14px] font-normal text-[#201D1E]">
                      {Number(item.total).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="invoice-modal-mobile-table">
            {formData.invoiceItems.map((item, index) => (
              <div key={index} className="invoice-modal-mobile-section">
                {/* First Header: Charge and Description */}
                <div className="invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase">
                    Charge
                  </div>
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase">
                    Description
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                  <div className="px-[10px] py-[10px] h-[57px] relative">
                    <select
                      value={item.charge}
                      onChange={(e) =>
                        handleItemChange(index, "charge", e.target.value)
                      }
                      onFocus={() => toggleDropdown("charge")}
                      onBlur={() => toggleDropdown("charge")}
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
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
                      placeholder="Enter Reason"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                    />
                  </div>
                </div>

                {/* Second Header: Date and Amount */}
                <div className="invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase">
                    Date
                  </div>
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase">
                    Amount
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                  <div className="px-[10px] py-[10px] relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={item.date}
                      onChange={(e) =>
                        handleItemChange(index, "date", e.target.value)
                      }
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                    />
                    <img
                      src={calendaricon}
                      alt="Calendar"
                      className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-table-input"
                    />
                  </div>
                </div>

                {/* Third Header: Select and Total */}
                <div className="invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase">
                    Select
                  </div>
                  <div className="px-[10px] flex items-center invoice-modal-thead uppercase ml-[70px]">
                    Total
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-[10px] py-[10px] relative">
                    <select
                      value={item.select}
                      onChange={(e) =>
                        handleItemChange(index, "select", e.target.value)
                      }
                      onFocus={() => toggleDropdown("select")}
                      onBlur={() => toggleDropdown("select")}
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                        openDropdowns.select ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="px-[10px] py-[5px] text-left text-[14px] font-normal text-[#201D1E] ml-[70px]">
                    {Number(item.total).toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#076094] duration-200 text-white py-2 px-6 invoice-modal-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;