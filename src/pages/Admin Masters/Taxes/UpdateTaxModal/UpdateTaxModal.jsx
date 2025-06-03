import React, { useEffect, useState } from "react";
import "./UpdateTaxModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";
import { toast } from "react-hot-toast";

/**
 * UpdateTaxModal Component
 * A modal for updating an existing tax record, with dynamic country and state dropdowns fetched from the backend.
 * Integrates with the /taxes/<company_id>/<tax_id>/ endpoint to either create a new tax version (if tax_percentage,
 * applicable_from, or applicable_to changes) or update the existing record (for non-critical fields like tax_type,
 * country, or state). The `applicable_to` field is optional, as the backend allows null for active taxes.
 */
const UpdateTaxModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [taxType, setTaxType] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
  const [isStateSelectOpen, setIsStateSelectOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Retrieves the company ID from localStorage based on the user's role.
   * @returns {string|null} The company ID or null if not found/invalid.
   */
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

  /**
   * Fetches countries from the backend.
   * Request: GET /accounts/countries/
   * Response: Array of country objects [{ id, name }, ...]
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accounts/countries/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setCountries(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching countries:", err);
        toast.error("Failed to load countries");
      }
    };

    fetchCountries();
  }, []);

  /**
   * Fetches states based on the selected country.
   * Request: GET /accounts/countries/<country_id>/states/
   * Response: Array of state objects [{ id, name }, ...]
   */
  useEffect(() => {
    const fetchStates = async () => {
      if (!country) {
        setStates([]);
        setState("");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/accounts/countries/${country}/states/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setStates(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching states:", err);
        toast.error("Failed to load states");
        setStates([]);
      }
    };

    fetchStates();
  }, [country]);

  /**
   * Populates form with existing tax data when the modal opens.
   */
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-tax-master" &&
      modalState.data
    ) {
      const taxData = modalState.data;
      setCountry(taxData.country || "");
      setState(taxData.state || "");
      setTaxType(taxData.tax_type || "");
      setTaxPercentage(taxData.tax_percentage || "");
      setApplicableFrom(taxData.applicable_from || "");
      setApplicableTo(taxData.applicable_to || "");
      setError(null);
      setFieldErrors({});
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-tax-master" type
  if (!modalState.isOpen || modalState.type !== "update-tax-master") {
    return null;
  }

  /**
   * Validates form fields before submission.
   * @returns {boolean} True if valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};

    if (!country) {
      errors.country = "Please select a Country";
    }
    if (!taxType.trim()) {
      errors.taxType = "Please fill the Tax Type field";
    }
    if (!taxPercentage || taxPercentage < 0 || taxPercentage > 100) {
      errors.taxPercentage = "Please enter a valid Tax percentage (0-100)";
    }
    if (!applicableFrom) {
      errors.applicableFrom = "Please select an Applicable From date";
    }
    if (applicableTo && new Date(applicableTo) < new Date(applicableFrom)) {
      errors.applicableTo =
        "Applicable To date must be after Applicable From date";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Checks if critical fields have changed compared to the original data.
   * @returns {boolean} True if tax_percentage, applicable_from, or applicable_to has changed.
   */
  const hasCriticalFieldsChanged = () => {
    const originalData = modalState.data;
    return (
      parseFloat(taxPercentage) !== parseFloat(originalData.tax_percentage) ||
      applicableFrom !== originalData.applicable_from ||
      applicableTo !== originalData.applicable_to
    );
  };

  /**
   * Handles form submission by sending a PUT request to either create a new tax version
   * or update the existing tax record.
   * Request: PUT /company/taxes/<company_id>/<tax_id>/
   * Body: { tax_type, tax_percentage, country, state, applicable_from, applicable_to }
   * Response:
   * - Success (200): { id, tax_type, tax_percentage, country, state, applicable_from, applicable_to, is_active }
   * - Error (400): { tax_type: ["Error"], ... }
   * - Error (404): { detail: "Company not found." } or { detail: "Tax record not found." }
   */
  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const companyId = getUserCompanyId();
    const taxId = modalState.data?.id;

    if (!companyId) {
      setError("Company ID is missing or invalid. Please log in again.");
      toast.error("Company ID is missing or invalid. Please log in again.");
      setLoading(false);
      return;
    }

    if (!taxId) {
      setError("Tax ID is missing or invalid.");
      toast.error("Tax ID is missing or invalid.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        tax_type: taxType,
        tax_percentage: parseFloat(taxPercentage),
        country: parseInt(country),
        state: state ? parseInt(state) : null,
        applicable_from: applicableFrom,
      };
      if (applicableTo) {
        payload.applicable_to = applicableTo;
      }

      const response = await axios.put(
        `${BASE_URL}/company/taxes/${companyId}/${taxId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Determine if a new version was created or existing record was updated
      const isNewVersion = hasCriticalFieldsChanged();
      toast.success(
        isNewVersion
          ? response.data.applicable_to
            ? "New tax version created successfully"
            : "New tax version created and set as active. Previous version was closed."
          : "Tax record updated successfully"
      );
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating tax:", err);
      let errorMessage = "Failed to update tax";
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
          // Handle field-specific errors
          const fieldErrorsFromBackend = {};
          Object.keys(err.response.data).forEach((key) => {
            fieldErrorsFromBackend[key] = Array.isArray(err.response.data[key])
              ? err.response.data[key].join(", ")
              : err.response.data[key];
          });
          setFieldErrors(fieldErrorsFromBackend);
          errorMessage = "Please correct the errors in the form.";
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
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
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex-1">
              <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
                Country *
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState(""); // Reset state when country changes
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
                  onFocus={() => setIsCountrySelectOpen(true)}
                  onBlur={() => setIsCountrySelectOpen(false)}
                  disabled={loading || countries.length === 0}
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
                    isCountrySelectOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
                {fieldErrors.country && (
                  <span className="text-[#dc2626]">{fieldErrors.country}</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
                State
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (e.target.value === "") {
                      e.target.classList.add("update-tax-choose-selected");
                    } else {
                      e.target.classList.remove("update-tax-choose-selected");
                    }
                  }}
                  className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none update-tax-input-style transition-colors duration-200 ${
                    fieldErrors.state
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 update-tax-choose-selected"
                      : state === ""
                      ? "border-[#E9E9E9] focus:ring-gray-500 update-tax-choose-selected"
                      : "border-[#E9E9E9] focus:ring-gray-500"
                  }`}
                  onFocus={() => setIsStateSelectOpen(true)}
                  onBlur={() => setIsStateSelectOpen(false)}
                  disabled={loading || !country || states.length === 0}
                >
                  <option value="" disabled hidden>
                    Choose
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name || `State ${state.id}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${
                    isStateSelectOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
                {fieldErrors.state && (
                  <span className="text-[#dc2626]">{fieldErrors.state}</span>
                )}
              </div>
            </div>
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Tax Type *
          </label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.tax_type
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="Enter Tax Type (e.g., GST, VAT)"
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.tax_type && (
              <span className="text-[#dc2626]">{fieldErrors.tax_type}</span>
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
              fieldErrors.tax_percentage
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            placeholder="0.00"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.tax_percentage && (
              <span className="text-[#dc2626]">
                {fieldErrors.tax_percentage}
              </span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable From *
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.applicable_from
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            value={applicableFrom}
            onChange={(e) => setApplicableFrom(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.applicable_from && (
              <span className="text-[#dc2626]">
                {fieldErrors.applicable_from}
              </span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable To
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${
              fieldErrors.applicable_to
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
            }`}
            value={applicableTo}
            onChange={(e) => setApplicableTo(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.applicable_to && (
              <span className="text-[#dc2626]">{fieldErrors.applicable_to}</span>
            )}
            <span className="text-gray-500">
              Leave blank to keep the tax active until superseded.
            </span>
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
            aria-label="Save tax changes"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaxModal;