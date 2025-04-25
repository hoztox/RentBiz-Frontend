import React, { useEffect, useState } from "react";
import "./UpdateChargesModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";

const UpdateChargesModal = ({ isOpen, onClose, charge }) => {
  const [name, setName] = useState("");
  const [chargeType, setChargeType] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (isOpen && charge) {
      setName(charge.name || "");
      setChargeType(charge.chargeType || "");
      setPercentage(charge.percentage || "");
    }
  }, [isOpen, charge]);

  const handleUpdate = () => {
    if (name && chargeType && percentage) {
      console.log("Charges Updated:", {
        name,
        chargeType,
        percentage,
      });
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-[522px] h-[427px] p-6 relative">
        <h2 className="update-charges-head mt-4 mb-6">
          Create New Charges Master
        </h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 mt-[9px] update-charges-close-btn"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] update-charges-label">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-non focus:border-gray-300 duration-200"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] update-charges-label">
            Charge Code Type
          </label>
          <select
            value={chargeType}
            onChange={(e) => {
              setChargeType(e.target.value);
              // Add or remove a class based on the value
              if (e.target.value === "") {
                e.target.classList.add("choose-selected");
              } else {
                e.target.classList.remove("choose-selected");
              }
            }}
            className={`w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:border-gray-300 duration-200 update-charges-selection ${
              chargeType === "" ? "choose-selected" : ""
            }`}
            onFocus={() => setIsSelectOpen(true)}
            onBlur={() => setIsSelectOpen(false)}
          >
            <option value="" disabled hidden>
              Choose
            </option>
            <option value="All">All</option>
            <option value="Deposit">Deposit</option>
          </select>
          <ChevronDown
            className={`absolute right-[2.25rem] top-[216px] w-[20px] h-[20px] transition-transform duration-300 ${
              isSelectOpen ? "rotate-180" : "rotate-0"
            }`}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] update-charges-label">
            Vat Percentage
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-non focus:border-gray-300 duration-200"
            placeholder="0"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] update-charges-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChargesModal;
