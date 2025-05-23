import React, { useEffect, useState } from "react";
import "./AddCurrencyModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";

const AddCurrencyModal = () => {
  const { modalState, closeModal } = useModal();
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [minorUnit, setMinorUnit] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (modalState.isOpen) {
      setCountry("");
      setCurrency("");
      setCurrencyCode("");
      setMinorUnit("");
    }
  }, [modalState.isOpen]);

  if (!modalState.isOpen || modalState.type !== "add-currency-master") {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (country && currency && currencyCode && minorUnit) {
      console.log("New Currency Added: ", {
        country,
        currency,
        currencyCode,
        minorUnit,
      });
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 currency-modal-overlay">
      <div className="add-currency-modal-container relative bg-white rounded-md w-full max-w-[523px] h-auto md:h-[514px] p-6">
        <h2 className="currency-modal-head mt-4 mb-6">Create New Currency</h2>
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 currency-modal-close-btn hover:bg-gray-100 duration-200"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Country
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (e.target.value === "") {
                    e.target.classList.add("choose-selected");
                  } else {
                    e.target.classList.remove("choose-selected");
                  }
                }}
                className={`w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:border-gray-300 duration-200 create-charges-selection input-style ${
                  country === "" ? "choose-selected" : ""
                }`}
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
                required // Add required to select if needed
              >
                <option value="" disabled hidden>
                  Choose
                </option>
                <option value="Kuwait">Kuwait</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
              </select>
              <ChevronDown
                className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
                width={22}
                height={22}
                color="#201D1E"
              />
            </div>

            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Currency
            </label>
            <input
              type="text"
              className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:border-gray-300 duration-200 input-style"
              placeholder="Enter Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />

            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Code
            </label>
            <input
              type="text"
              className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:border-gray-300 duration-200 input-style"
              placeholder="Enter Currency Code"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              required
            />

            <label className="block pt-2 mt-2 mb-2 text-[#201D1E] currency-modal-label">
              Minor Unit
            </label>
            <input
              type="text"
              className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:border-gray-300 duration-200 input-style"
              placeholder="Enter Minor Unit"
              value={minorUnit}
              onChange={(e) => setMinorUnit(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCurrencyModal;