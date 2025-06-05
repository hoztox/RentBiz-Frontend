import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddCurrencyModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { BASE_URL } from "../../../../utils/config";

const AddCurrencyModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [minorUnit, setMinorUnit] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "add-currency-master") {
      setCountry("");
      setCurrency("");
      setCurrencyCode("");
      setMinorUnit("");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type]);

  // Only render for "add-currency-master" type
  if (!modalState.isOpen || modalState.type !== "add-currency-master") {
    return null;
  }

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }

    return null;
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!country || !currency || !currencyCode || !minorUnit) {
      setFieldError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      console.log("Request payload:", { country, currency, currencyCode, minorUnit, companyId, userId });

      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.post(
        `${BASE_URL}/company/currency/create/`,
        {
          country,
          currency,
          currency_code: currencyCode,
          minor_unit: minorUnit,
          company: companyId,
          user: userId, 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create currency");
      }

      console.log("New Currency Created: ", response.data);
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        "Failed to save currency: " +
          (err.response?.data?.detail ||
            err.response?.data?.company ||
            err.response?.data?.user ||
            err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 currency-modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="add-currency-modal-container relative bg-white rounded-md w-full max-w-[523px] h-auto md:h-[514px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="currency-modal-head">Create New Currency</h2>
          <button
            onClick={closeModal}
            className="currency-modal-close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Country *
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
                className={`w-full border transition-colors duration-200 rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer input-style ${
                  fieldError && !country
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#E9E9E9] focus:border-gray-300"
                } ${country === "" ? "choose-selected" : ""}`}
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
                disabled={loading}
              >
                <option value="" disabled hidden>
                  Choose
                </option>
                <option value="Kuwait">Kuwait</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Qatar">Qatar</option>
              </select>
              <ChevronDown
                className={`absolute right-[11px] top-[13px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
                width={22}
                height={22}
                color="#201D1E"
              />
            </div>

            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Currency *
            </label>
            <input
              type="text"
              className={`w-full border transition-colors duration-200 rounded-md mt-1 mb-2 px-3 py-2 input-style ${
                fieldError && !currency
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#E9E9E9] focus:border-gray-300"
              }`}
              placeholder="Enter Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={loading}
              maxLength={100} // Matches backend max_length
            />

            <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
              Code *
            </label>
            <input
              type="text"
              className={`w-full border transition-colors duration-200 rounded-md mt-1 px-3 py-2 input-style ${
                fieldError && !currencyCode
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#E9E9E9] focus:border-gray-300"
              }`}
              placeholder="Enter Currency Code"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              disabled={loading}
              maxLength={100} // Matches backend max_length
            />

            <label className="block pt-2 mt-2 mb-2 text-[#201D1E] currency-modal-label">
              Minor Unit *
            </label>
            <input
              type="text"
              className={`w-full border transition-colors duration-200 rounded-md mt-1 px-3 py-2 input-style ${
                fieldError && !minorUnit
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#E9E9E9] focus:border-gray-300"
              }`}
              placeholder="Enter Minor Unit"
              value={minorUnit}
              onChange={(e) => setMinorUnit(e.target.value)}
              disabled={loading}
              maxLength={100} // Matches backend max_length
            />

            <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
              {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
              {error && <span className="text-[#dc2626]">{error}</span>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Save Currency"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCurrencyModal;