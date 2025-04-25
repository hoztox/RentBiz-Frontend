import React, { useEffect, useState } from "react";
import "./CreateChargesModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";

const CreateChargesModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [chargeType, setChargeType] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSave = () => {
    if (name && chargeType && percentage) {
      console.log("New Charges Created:", {
        name,
        chargeType,
        percentage,
      });
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName("");
      setChargeType("");
      setPercentage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-[522px] h-[427px] p-6 relative">
        <h2 className="create-charges-head mt-4 mb-6">
          Create New Charges Master
        </h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 mt-[9px] create-charges-close-btn"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] create-charges-label">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:border-gray-300 duration-200"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] create-charges-label">
            Charge Code Type
          </label>
          <select
            value={chargeType}
            onChange={(e) => {
              setChargeType(e.target.value);
              // Add or remove a class based on the value
              if (e.target.value === "") {
                e.target.classList.add("choose-seleted");
              } else {
                e.target.classList.remove("choose-selected");
              }
            }}
            className={`w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:border-gray-300 duration-200 create-charges-selection ${
              chargeType === "" ? "choose-selected" : ""
            }`}
            onFocus={() => setIsSelectOpen(true)}
            onBlur={() => setIsSelectOpen(false)}
          >
            <option value="" disabled hidden>
              Choose
            </option>
            <option value="all">All</option>
            <option value="deposit">Deposit</option>
          </select>
          <ChevronDown
            className={`absolute right-[2.25rem] top-[216px] w-[20px] h-[20px] transition-transform duration-300 ${
              isSelectOpen ? "rotate-180" : "rotate-0"
            }`}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] create-charges-label">
            Vat Percentage
          </label>
          <input
            type="number"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-non focus:border-gray-300 duration-200"
            placeholder="0"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] create-charges-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChargesModal;
