import React, { useEffect, useState, useRef } from "react";
import "./UpdateChargesModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";

const UpdateChargesModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [name, setName] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [selectedTaxTypes, setSelectedTaxTypes] = useState([]);
  const [chargeCodeOptions, setChargeCodeOptions] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isTaxTypeOpen, setIsTaxTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const taxTypeDropdownRef = useRef(null);

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

  // Fetch charge codes for dropdown
  const fetchChargeCodeOptions = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) return;

      const response = await axios.get(
        `${BASE_URL}/company/charge_code/company/${companyId}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        const options = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setChargeCodeOptions(options);
      }
    } catch (err) {
      console.error("Error fetching charge codes:", err);
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
    } catch (error) {
      console.error("Error fetching tax types:", error);
      setError("Failed to fetch tax types");
    }
  };

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

  // Reset form state when modal opens or charges data changes
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-charges-master" &&
      modalState.data
    ) {
      setName(modalState.data.name || "");
      setChargeCode(
        typeof modalState.data.charge_code === "object"
          ? modalState.data.charge_code.id
          : modalState.data.charge_code || ""
      );
      setSelectedTaxTypes(modalState.data.tax_types || []);
      setError(null);
      setFieldErrors({});
      fetchChargeCodeOptions();
      fetchTaxTypes();
    } else {
      setName("");
      setChargeCode("");
      setSelectedTaxTypes([]);
      setError(null);
      setFieldErrors({});
      setChargeCodeOptions([]);
      setTaxTypes([]);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-charges-master" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-charges-master" ||
    !modalState.data
  ) {
    return null;
  }

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

    if (!chargeCode) {
      errors.chargeCode = "Please select a Charge Code";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    const chargesId = modalState.data.id;
    const companyId = getUserCompanyId();

    if (!companyId) {
      setError("Company ID is missing or invalid");
      toast.error("Company ID is missing or invalid");
      return;
    }

    if (!chargesId) {
      setError("Charges ID is missing");
      toast.error("Charges ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const userId = getRelevantUserId();
      const response = await axios.put(
        `${BASE_URL}/company/charges/${chargesId}/`,
        {
          name: name,
          charge_code: chargeCode,
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
        throw new Error("Failed to update charges");
      }
      triggerRefresh();
      toast.success("Charges updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(response.data);
      }

      closeModal();
    } catch (err) {
      console.error("Error updating charges:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.name ||
        err.response?.data?.charge_code ||
        err.response?.data?.tax_types ||
        err.response?.data?.company ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update charges";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-masters-charges-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[460px] p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="modal-head">Update Charges Master</h2>
          <button
            onClick={handleClose}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Name *
          </label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 mb-2 px-3 py-2 focus:outline-none focus:ring-2 input-style transition-colors duration-200 ${
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
          <div className="text-sm" style={{ minHeight: "20px" }}>
            {fieldErrors.name && (
              <span className="text-[#dc2626]">{fieldErrors.name}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Charge Code *
          </label>
          <div className="relative">
            <select
              value={chargeCode}
              onChange={(e) => {
                setChargeCode(e.target.value);
                if (e.target.value === "") {
                  e.target.classList.add("choose-selected");
                } else {
                  e.target.classList.remove("choose-selected");
                }
              }}
              className={`w-full border rounded-md mt-1 mb-2 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none focus:ring-2 input-style transition-colors duration-200 ${
                fieldErrors.chargeCode
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#E9E9E9] focus:ring-gray-500"
              } ${chargeCode === "" ? "choose-selected" : ""}`}
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              disabled={loading}
            >
              <option value="" disabled hidden>
                Choose Charge Code
              </option>
              {chargeCodeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${
                isSelectOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          <div className="text-sm" style={{ minHeight: "20px" }}>
            {fieldErrors.chargeCode && (
              <span className="text-[#dc2626]">{fieldErrors.chargeCode}</span>
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
          <div className="text-sm" style={{ minHeight: "20px" }}>
            {fieldErrors.taxTypes && (
              <span className="text-[#dc2626]">{fieldErrors.taxTypes}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] modal-save-btn duration-200`}
            aria-label="Save charges"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChargesModal;