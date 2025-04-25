import React, { useEffect, useState } from "react";
import "./UpdateCurrencyModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";

const UpdateCurrencyModal = ({ isOpen, onClose, currencyData }) => {
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [minorUnit, setMinorUnit] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Update state when currencyData changes
  useEffect(() => {
    if (currencyData) {
      setCountry(currencyData.country || "");
      setCurrency(currencyData.currency || "");
      setCurrencyCode(currencyData.code || "");
      setMinorUnit(currencyData.minorUnit || "");
    }
  }, [currencyData]);

  const handleUpdate = () => {
    if (currency && currency && currencyCode && minorUnit) {
      console.log("Currency Updated Successfully: ", {
        country,
        currency,
        currencyCode,
        minorUnit,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-[523px] h-[514px] p-6 relative">
        <h2 className="currency-modal-head mt-4 mb-6">Create New Curency</h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 mt-[9px] currency-modal-close-btn"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              // Add or remove a class based on the value
              if (e.target.value === "") {
                e.target.classList.add("choose-seleted");
              } else {
                e.target.classList.remove("choose-selected");
              }
            }}
            className={`w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:border-gray-300 duration-200 create-charges-selection ${
              country === "" ? "choose-selected" : ""
            }`}
            onFocus={() => setIsSelectOpen(true)}
            onBlur={() => setIsSelectOpen(false)}
          >
            <option value="" disabled hidden>
              Choose
            </option>
            <option value="Kuwait">Kuwait</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
          </select>
          <ChevronDown
            className={`absolute right-[2.25rem] top-[133px] w-[20px] h-[20px] transition-transform duration-300 ${
              isSelectOpen ? "rotate-180" : "rotate-0"
            }`}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
            Currency
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2  focus:border-gray-300 duration-200"
            placeholder="Enter Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] create-charges-label">
            Code
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-non focus:border-gray-300 duration-200"
            placeholder="Enter Currency Code"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
          />

          <label className="block pt-2 mt-2 mb-2 text-[#201D1E] create-charges-label">
            Minor Unit
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-non focus:border-gray-300 duration-200"
            placeholder="Enter Minor Unit"
            value={minorUnit}
            onChange={(e) => setMinorUnit(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] create-charges-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCurrencyModal;
