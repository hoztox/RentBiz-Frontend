import React, { useEffect, useState, useRef } from "react";
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
  const [selectedTaxTypes, setSelectedTaxTypes] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isTaxTypeOpen, setIsTaxTypeOpen] = useState(false);
  const [chargeCodes, setChargeCodes] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]); // State for dynamic tax types
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const taxTypeDropdownRef = useRef(null);

  // Reset form state and fetch data when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-charges-master") {
      setName("");
      setChargeCodeId("");
      setSelectedTaxTypes([]);
      setError(null);
      setFieldErrors({});
      fetchChargeCodes();
      fetchTaxTypes(); // Fetch tax types when modal opens
    }
  }, [modalState.isOpen, modalState.type]);

  // Handle clicks outside tax type dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taxTypeDropdownRef.current && !taxTypeDropdownRef.current.contains(event.target)) {
        setIsTaxTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only render for "create-charges-master" type
  if (!modalState.isOpen || modalState.type !== "create-charges-master") {
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
      setError("Failed to fetch charge codes");
    }
  };

  // Fetch tax types from API
  const fetchTaxTypes = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.get(
        `${BASE_URL}/company/taxes/${companyId}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTaxTypes(response.data || []);
      console.log('tax types:', response.data);
      
    } catch (error) {
      console.error("Error fetching tax types:", error);
      setError("Failed to fetch tax types");
    }
  };

  const handleTaxTypeToggle = (taxTypeId) => {
    setSelectedTaxTypes((prev) =>
      prev.includes(taxTypeId)
        ? prev.filter((id) => id !== taxTypeId)
        : [...prev, taxTypeId]
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Please fill the Name field";
    }
    if (!chargeCodeId) {
      errors.chargeCodeId = "Please select a Charge Code Type";
    }
    // if (selectedTaxTypes.length === 0) {
    //   errors.taxTypes = "Please select at least one Tax Type";
    // }

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

      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.post(
        `${BASE_URL}/company/charges/create/`,
        {
          name: name,
          charge_code: parseInt(chargeCodeId),
          tax_types: selectedTaxTypes,
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
        selectedTaxTypes,
        companyId,
        userId,
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
            err.response?.data?.tax_types ||
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

          <label className="block pt-2 !mb-[10px] text-[#201D1E] modal-label">
            Select Tax *
          </label>
          <div className="relative" ref={taxTypeDropdownRef}>
            <div
              className={`w-full border rounded-md mt-1 px-3 py-2 cursor-pointer focus:outline-none input-style transition-colors duration-200 flex items-center`}
              onClick={() => setIsTaxTypeOpen(!isTaxTypeOpen)}
            >
              {selectedTaxTypes.length > 0
                ? selectedTaxTypes
                    .map((id) => taxTypes.find((t) => t.id === id)?.tax_type)
                    .filter(Boolean)
                    .join(", ")
                : "Select Tax"}
            </div>
            <ChevronDown
              className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${
                isTaxTypeOpen ? "rotate-180" : "rotate-0"
              }`}
            />
            {isTaxTypeOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#E9E9E9] rounded-md shadow-lg max-h-60 overflow-y-auto">
                {taxTypes.length > 0 ? (
                  taxTypes.map((taxType) => (
                    <label
                      key={taxType.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer tax-types"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTaxTypes.includes(taxType.id)}
                        onChange={() => handleTaxTypeToggle(taxType.id)}
                        className="mr-2"
                        disabled={loading}
                      />
                      {taxType.tax_type}
                    </label>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">
                    No tax types available
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.taxTypes && (
              <span className="text-[#dc2626]">{fieldErrors.taxTypes}</span>
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