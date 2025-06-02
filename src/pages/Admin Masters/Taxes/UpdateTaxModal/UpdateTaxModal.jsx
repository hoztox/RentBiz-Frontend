import React, { useEffect, useState } from "react";
import "./UpdateTaxModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";

const UpdateTaxModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [country, setCountry] = useState("");
  const [taxType, setTaxType] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [countries, setCountries] = useState([
    { id: 1, name: "United States" },
    { id: 2, name: "Canada" },
    { id: 3, name: "United Kingdom" },
    { id: 4, name: "India" },
    { id: 5, name: "Australia" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Populate form with existing data when modal opens
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-tax-master" &&
      modalState.data
    ) {
      const taxData = modalState.data;
      setCountry(taxData.country || "");
      setTaxType(taxData.taxType || "");
      setTaxPercentage(taxData.taxPercentage || "");
      setApplicableFrom(taxData.applicableFrom || "");
      setApplicableTo(taxData.applicableTo || "");
      setError(null);
      setFieldErrors({});
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-tax-master" type
  if (!modalState.isOpen || modalState.type !== "update-tax-master") {
    return null;
  }

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
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

    if (role === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    return null;
  };

  const validateForm = () => {
    const errors = {};

    if (!country) {
      errors.country = "Please select a Country";
    }
    if (!taxType.trim()) {
      errors.taxType = "Please fill the Tax Type field";
    }
    if (!taxPercentage || taxPercentage < 0) {
      errors.taxPercentage = "Please enter a valid Tax percentage";
    }
    if (!applicableFrom) {
      errors.applicableFrom = "Please select an Applicable From date";
    }
    if (!applicableTo) {
      errors.applicableTo = "Please select an Applicable To date";
    } else if (
      applicableFrom &&
      new Date(applicableTo) < new Date(applicableFrom)
    ) {
      errors.applicableTo =
        "Applicable To date must be after Applicable From date";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      const taxId = modalState.data?.id;

      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      if (!taxId) {
        throw new Error("Tax ID is missing or invalid");
      }

      // Simulate a successful update without API call
      console.log("Tax Updated:", {
        id: taxId,
        country,
        taxType,
        taxPercentage,
        applicableFrom,
        applicableTo,
        companyId,
        userId,
      });

      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to update tax: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 update-tax-modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-tax-modal-wrapper relative bg-white rounded-md w-full max-w-[522px] h-auto p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="update-tax-modal-head">Update Tax Master</h2>
          <button
            onClick={closeModal}
            className="update-tax-close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Country *
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                if (e.target.value === "") {
                  e.target.classList.add("update-tax-choose-selected");
                } else {
                  e.target.classList.remove("update-tax-choose-selected");
                }
              }}
              className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none update-tax-input-style transition-colors duration-200 ${
                fieldErrors.country
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500 update-tax-choose-selected"
                  : country === ""
                  ? "border-[#E9E9E9] focus:ring-gray-500 update-tax-choose-selected"
                  : "border-[#E9E9E9] focus:ring-gray-500"
              }`}
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              disabled={loading}
            >
              <option value="" disabled hidden>
                Choose
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name || `Country ${country.id}`}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${
                isSelectOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.country && (
              <span className="text-[#dc2626]">{fieldErrors.country}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Tax Type *
          </label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.taxType
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="Enter Tax Type"
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.taxType && (
              <span className="text-[#dc2626]">{fieldErrors.taxType}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Tax Percentage *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.taxPercentage
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="0.00"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.taxPercentage && (
              <span className="text-[#dc2626]">
                {fieldErrors.taxPercentage}
              </span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable From *
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.applicableFrom
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            value={applicableFrom}
            onChange={(e) => setApplicableFrom(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.applicableFrom && (
              <span className="text-[#dc2626]">
                {fieldErrors.applicableFrom}
              </span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable To *
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.applicableTo
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            value={applicableTo}
            onChange={(e) => setApplicableTo(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.applicableTo && (
              <span className="text-[#dc2626]">{fieldErrors.applicableTo}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-[-10px]">
          <button
            onClick={handleUpdate}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] update-tax-modal-save-btn duration-200`}
            aria-label="Update tax"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaxModal;
