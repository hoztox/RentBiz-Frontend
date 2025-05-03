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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="update-charges-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[427px] p-6">
        <h2 className="modal-head mt-4 mb-6">Update Charges Master</h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 close-btn duration-200"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 input-style"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Charge Code Type
          </label>
          <div className="relative">
            <select
              value={chargeType}
              onChange={(e) => {
                setChargeType(e.target.value);
                if (e.target.value === "") {
                  e.target.classList.add("choose-selected");
                } else {
                  e.target.classList.remove("choose-selected");
                }
              }}
              className={`w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 input-style ${
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
              className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${
                isSelectOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Vat Percentage
          </label>
          <input
            type="number"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 input-style"
            placeholder="0"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChargesModal;
