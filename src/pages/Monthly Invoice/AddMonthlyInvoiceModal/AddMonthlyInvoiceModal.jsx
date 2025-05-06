import React, { useEffect, useState } from "react";
import "./AddMonthlyInvoiceModal.css";
import { ChevronDown } from "lucide-react";
import calendaricon from "../../../assets/Images/Monthly Invoice/calendar-icon.svg";
import closeicon from "../../../assets/Images/Monthly Invoice/close-icon.svg";

const AddMonthlyInvoiceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dueDate: "",
    invoiceDate: "",
    invoiceItems: [
      {
        tenancy: "",
        tenant: "",
        charges: "",
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
    tenant: false,
    charges: false,
    select: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        dueDate: "",
        invoiceDate: "",
        invoiceItems: [
          {
            tenancy: "",
            tenant: "",
            charges: "",
            description: "",
            date: "",
            amount: "",
            select: "",
            total: "0.0000",
          },
        ],
      });
    }
  }, [isOpen]);

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-md w-[1006px] p-6 monthly-invoice-modal-container">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="text-[#201D1E] monthly-invoice-modal-head">
            Create New Monthly Invoice
          </h2>
          <button
            onClick={onClose}
            className="monthly-invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        <div className="monthly-invoice-modal-grid gap-6">
          <div>
            <label className="block mb-3 monthly-invoice-modal-label">Due Date</label>
            <div className="relative">
              <input
                type="date"
                name="dueDate"
                placeholder="dd/mm/yyyy"
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-input"
              />
              <div className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
                {/* <img src={calendaricon} alt="Calendar" className="w-5 h-5" /> */}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-3 monthly-invoice-modal-label">
              Invoice Date*
            </label>
            <div className="relative">
              <input
                type="date"
                name="invoiceDate"
                placeholder="mm/dd/yyyy"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-input appearance-none"
              />
              <div className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
                {/* <img src={calendaricon} alt="Calendar" className="w-5 h-5" /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 monthly-invoice-modal-overflow-x-auto border border-[#E9E9E9] rounded-md">
          <div className="monthly-invoice-modal-desktop-table">
            <table className="w-full border-collapse monthly-invoice-modal-table">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[50px]">
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[105px]">
                    Tenancy
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[105px]">
                    Tenant
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[106px]">
                    Charges
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[123px]">
                    Description
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[136px]">
                    Date
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[118px]">
                    Amount
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[105px]">
                    Select
                  </th>
                  <th className="px-[10px] text-left monthly-invoice-modal-thead uppercase w-[44px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-[10px] py-[5px] w-[105px] h-[57px] relative">
                      <select
                        value={item.tenancy}
                        onChange={(e) =>
                          handleItemChange(index, "tenancy", e.target.value)
                        }
                        onFocus={() => toggleDropdown("tenancy")}
                        onBlur={() => toggleDropdown("tenancy")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.tenancy ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[105px] h-[57px] relative">
                      <select
                        value={item.tenant}
                        onChange={(e) =>
                          handleItemChange(index, "tenant", e.target.value)
                        }
                        onFocus={() => toggleDropdown("tenant")}
                        onBlur={() => toggleDropdown("tenant")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.tenant ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[106px] h-[57px] relative">
                      <select
                        value={item.charges}
                        onChange={(e) =>
                          handleItemChange(index, "charges", e.target.value)
                        }
                        onFocus={() => toggleDropdown("charges")}
                        onBlur={() => toggleDropdown("charges")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.charges ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[123px]">
                      <input
                        type="text"
                        placeholder="Enter Reason"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[136px] relative">
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        value={item.date}
                        onChange={(e) =>
                          handleItemChange(index, "date", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
                      />
                      <img
                        src={calendaricon}
                        alt="Calendar"
                        className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[118px]">
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        value={item.amount}
                        onChange={(e) =>
                          handleItemChange(index, "amount", e.target.value)
                        }
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[105px] relative">
                      <select
                        value={item.select}
                        onChange={(e) =>
                          handleItemChange(index, "select", e.target.value)
                        }
                        onFocus={() => toggleDropdown("select")}
                        onBlur={() => toggleDropdown("select")}
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                      >
                        <option value="">Choose</option>
                      </select>
                      <ChevronDown
                        className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                          openDropdowns.select ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] font-normal text-[#201D1E]">
                      {Number(item.total).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="monthly-invoice-modal-mobile-table">
            {formData.invoiceItems.map((item, index) => (
              <div key={index} className="monthly-invoice-modal-mobile-section">
                <div className="monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Tenancy
                  </div>
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Tenant
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                  <div className="px-[10px] py-[10px] h-[57px] relative">
                    <select
                      value={item.tenancy}
                      onChange={(e) =>
                        handleItemChange(index, "tenancy", e.target.value)
                      }
                      onFocus={() => toggleDropdown("tenancy")}
                      onBlur={() => toggleDropdown("tenancy")}
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                        openDropdowns.tenancy ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="px-[10px] py-[10px] h-[57px] relative">
                    <select
                      value={item.tenant}
                      onChange={(e) =>
                        handleItemChange(index, "tenant", e.target.value)
                      }
                      onFocus={() => toggleDropdown("tenant")}
                      onBlur={() => toggleDropdown("tenant")}
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                        openDropdowns.tenant ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Charges
                  </div>
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Description
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                  <div className="px-[10px] py-[10px] h-[57px] relative">
                    <select
                      value={item.charges}
                      onChange={(e) =>
                        handleItemChange(index, "charges", e.target.value)
                      }
                      onFocus={() => toggleDropdown("charges")}
                      onBlur={() => toggleDropdown("charges")}
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                        openDropdowns.charges ? "rotate-180" : ""
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
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
                    />
                  </div>
                </div>

                <div className="monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Date
                  </div>
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
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
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
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
                      className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-500 focus:border-gray-500 monthly-invoice-modal-table-input"
                    />
                  </div>
                </div>

                <div className="monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase">
                    Select
                  </div>
                  <div className="px-[10px] flex items-center monthly-invoice-modal-thead uppercase ml-[70px]">
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
                      className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 bg-white monthly-invoice-modal-table-select"
                    >
                      <option value="">Choose</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                        openDropdowns.select ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="px-[10px] py-[10px] text-left text-[14px] font-normal text-[#201D1E] ml-[70px]">
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
            className="bg-[#2892CE] hover:bg-[#076094] duration-200 text-white py-2 px-6 monthly-invoice-modal-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMonthlyInvoiceModal;