import React, { useEffect, useState } from "react";
import "./CreateChargesModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";

const CreateChargesModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [name, setName] = useState("");
  const [chargeCodeId, setChargeCodeId] = useState("");
  const [vatPercentage, setVatPercentage] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [chargeCodes, setChargeCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-charges-master") {
      setName("");
      setChargeCodeId("");
      setVatPercentage("");
      setError(null);
      setFieldErrors({});
      fetchChargeCodes();
    }
  }, [modalState.isOpen, modalState.type]);

  // Only render for "create-charges-master" type
  if (!modalState.isOpen || modalState.type !== "create-charges-master") {
    return null;
  }

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      // When a company logs in, their own ID is stored as company_id
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      // When a user logs in, company_id is directly stored
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

  const fetchChargeCodes = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.get(
        `${BASE_URL}/company/charge_code/company/${companyId}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setChargeCodes(response.data || []);
    } catch (error) {
      console.error("Error fetching charge codes:", error);
      // setError("Failed to load charge codes");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Please fill the Name field";
    }
    if (!chargeCodeId) {
      errors.chargeCodeId = "Please select a Charge Code Type";
    }
    if (!vatPercentage || vatPercentage < 0) {
      errors.vatPercentage = "Please enter a valid VAT percentage";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      
      console.log("Request payload:", { 
        name, 
        chargeCodeId, 
        vatPercentage, 
        companyId, 
        userId 
      });

      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.post(
        `${BASE_URL}/company/charges/create/`,
        {
          name: name,
          charge_code: parseInt(chargeCodeId),
          vat_percentage: parseFloat(vatPercentage),
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
        throw new Error("Failed to create charges");
      }

      console.log("New Charges Created:", { 
        name, 
        chargeCodeId, 
        vatPercentage, 
        companyId, 
        userId 
      });
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        "Failed to save charges: " +
          (err.response?.data?.detail ||
            err.response?.data?.company_id ||
            err.response?.data?.name ||
            err.response?.data?.charge_code ||
            err.response?.data?.vat_percentage ||
            err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="create-charges-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[460px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="modal-head">Create New Charges Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
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
          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Name *
          </label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none input-style transition-colors duration-200 ${
              fieldErrors.name
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.name && (
              <span className="text-[#dc2626]">{fieldErrors.name}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Charge Code *
          </label>
          <div className="relative">
            <select
              value={chargeCodeId}
              onChange={(e) => {
                setChargeCodeId(e.target.value);
                if (e.target.value === "") {
                  e.target.classList.add("choose-selected");
                } else {
                  e.target.classList.remove("choose-selected");
                }
              }}
              className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none input-style transition-colors duration-200 ${
                fieldErrors.chargeCodeId
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500 choose-selected"
                  : chargeCodeId === ""
                  ? "border-[#E9E9E9] focus:ring-gray-500 choose-selected"
                  : "border-[#E9E9E9] focus:ring-gray-500"
              }`}
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              disabled={loading}
            >
              <option value="" disabled hidden>
                Choose
              </option>
              {chargeCodes.map((code) => (
                <option key={code.id} value={code.id}>
                  {code.title || code.name || `Code ${code.id}`}
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
            {fieldErrors.chargeCodeId && (
              <span className="text-[#dc2626]">{fieldErrors.chargeCodeId}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            VAT Percentage *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none input-style transition-colors duration-200 ${
              fieldErrors.vatPercentage
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="0.00"
            value={vatPercentage}
            onChange={(e) => setVatPercentage(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.vatPercentage && (
              <span className="text-[#dc2626]">{fieldErrors.vatPercentage}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-[-10px]">
          <button
            onClick={handleSave}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] modal-save-btn duration-200`}
            aria-label="Save charges"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChargesModal;