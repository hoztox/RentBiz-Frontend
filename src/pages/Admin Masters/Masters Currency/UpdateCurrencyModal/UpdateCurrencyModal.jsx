import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateCurrencyModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../../utils/config";

const UpdateCurrencyModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [minorUnit, setMinorUnit] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Function to get company ID based on user role
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

  // Function to get relevant user ID based on role
  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    return null;
  };

  // Reset form state when modal opens or currency data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-currency-master" && modalState.data) {
      setCountry(modalState.data.country || "");
      setCurrency(modalState.data.currency || "");
      setCurrencyCode(modalState.data.currency_code || "");
      setMinorUnit(modalState.data.minor_unit || "");
      setCompanyId(getUserCompanyId());
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-currency-master" type and valid data
  if (!modalState.isOpen || modalState.type !== "update-currency-master" || !modalState.data) {
    return null;
  }

  const handleUpdate = async () => {
    // Validation
    if (!country || !currency || !currencyCode || !minorUnit) {
      setFieldError("Please fill all required fields");
      return;
    }

    if (!companyId) {
      setFieldError("Company ID is missing or invalid");
      return;
    }

    const currencyId = modalState.data.id;
    if (!currencyId) {
      setFieldError("Currency ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const userId = getRelevantUserId();
      const payload = {
        country,
        currency,
        currency_code: currencyCode,
        minor_unit: minorUnit,
        company: companyId,
        user: userId,
      };
      console.log("Update payload:", payload);

      const response = await axios.put(
        `${BASE_URL}/company/currencies/${currencyId}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update currency");
      }

      console.log("Currency Updated: ", response.data);
      toast.success("Currency updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(response.data);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating currency:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.company_id ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update currency";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 currency-modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-currency-modal-container relative bg-white rounded-md w-full max-w-[523px] h-auto md:h-[514px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="currency-modal-head">Update Currency</h2>
          <button
            onClick={handleClose}
            className="currency-modal-close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-2">
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
          />

          <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
            Currency Code *
          </label>
          <input
            type="text"
            className={`w-full border transition-colors duration-200 rounded-md mt-1 mb-2 px-3 py-2 input-style ${
              fieldError && !currencyCode
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:border-gray-300"
            }`}
            placeholder="Enter Currency Code"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            disabled={loading}
          />

          <label className="block pt-2 mb-2 text-[#201D1E] currency-modal-label">
            Minor Unit *
          </label>
          <input
            type="text"
            className={`w-full border transition-colors duration-200 rounded-md mt-1 mb-2 px-3 py-2 input-style ${
              fieldError && !minorUnit
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:border-gray-300"
            }`}
            placeholder="Enter Minor Unit"
            value={minorUnit}
            onChange={(e) => setMinorUnit(e.target.value)}
            disabled={loading}
          />

          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`text-white rounded w-[150px] h-[38px] modal-save-btn duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            }`}
            aria-label="Save Currency"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCurrencyModal;