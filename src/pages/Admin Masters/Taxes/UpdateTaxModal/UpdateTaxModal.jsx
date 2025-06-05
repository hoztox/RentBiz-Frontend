import React, { useEffect, useState } from "react";
import "./UpdateTaxModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import { toast } from "react-hot-toast";
import { locationApi, taxesApi, getUserCompanyId } from "../../MastersApi";

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

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedCountries = await locationApi.fetchCountries();
        setCountries(fetchedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        toast.error(err.message);
      }
    };

    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (!country) {
        setStates([]);
        setState("");
        return;
      }

      try {
        const fetchedStates = await locationApi.fetchStates(country);
        setStates(fetchedStates);
      } catch (err) {
        console.error("Error fetching states:", err);
        toast.error(err.message);
        setStates([]);
      }
    };

    loadStates();
  }, [country]);

  // Populate form with initial data from modalState
  useEffect(() => {
    console.log("Modal State:", modalState);
    if (modalState.isOpen && modalState.type === "update-tax-master") {
      const modalTaxData = modalState.data || {};
      const initialData = modalTaxData.initialData || {};

      // Populate form fields even if company_id is missing
      setCountry(initialData.country ? String(initialData.country) : "");
      setState(initialData.state ? String(initialData.state) : "");
      setTaxType(initialData.taxType || "");
      setTaxPercentage(
        initialData.taxPercentage !== undefined && initialData.taxPercentage !== null
          ? String(initialData.taxPercentage)
          : ""
      );
      setApplicableFrom(initialData.applicableFrom || "");
      setApplicableTo(initialData.applicableTo || "");
      setFieldErrors({});

      // Only set error if company_id is missing (for update operation)
      if (!getUserCompanyId()) {
        const errorMessage = "Company ID is missing. Updates may not be saved.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError(null);
      }
    } else {
      // Reset form when modal is closed
      setCountry("");
      setState("");
      setTaxType("");
      setTaxPercentage("");
      setApplicableFrom("");
      setApplicableTo("");
      setFieldErrors({});
      setError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  if (!modalState.isOpen || modalState.type !== "update-tax-master") {
    return null;
  }

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
      errors.applicableTo = "Applicable To date must be after Applicable From date";
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

    const modalTaxData = modalState.data || {};
    const companyId = getUserCompanyId();
    const taxId = modalTaxData.tax_id;

    if (!companyId) {
      const errorMessage = "Company ID is missing or invalid. Please log in again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    if (!taxId) {
      const errorMessage = "Tax ID is missing or invalid.";
      setError(errorMessage);
      toast.error(errorMessage);
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
        ...(applicableTo && { applicable_to: applicableTo }),
      };
      console.log("Tax ID:", taxId);
      console.log("Company ID:", companyId);
      console.log("FormData:", {
        taxType,
        taxPercentage,
        country,
        state,
        applicableFrom,
        applicableTo
      });
      console.log("API Payload:", payload);

      const response = await taxesApi.update(taxId, payload);
      console.log("Response:", response);

      toast.success("Tax record updated successfully");
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating tax:", err);
      let errorMessage = err.message;
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
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
      toast.error(errorMessage || error);
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
                    setState("");
                    if (e.target.value === "") {
                      e.target.classList.add("update-tax-choose-selected");
                    } else {
                      e.target.classList.remove("update-tax-choose-selected");
                    }
                  }}
                  className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.country
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
                    <option key={country.id} value={String(country.id)}>
                      {country.name || `Country ${country.id}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${isCountrySelectOpen ? "rotate-180" : "rotate-0"
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
                  className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.state
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
                    <option key={state.id} value={String(state.id)}>
                      {state.name || `State ${state.id}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-3 w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform duration-300 ${isStateSelectOpen ? "rotate-180" : "rotate-0"
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
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.tax_type
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
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.tax_percentage
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
              <span className="text-[#dc2626]">{fieldErrors.tax_percentage}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable From *
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.applicable_from
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500"
              }`}
            value={applicableFrom}
            onChange={(e) => setApplicableFrom(e.target.value)}
            disabled={loading}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldErrors.applicable_from && (
              <span className="text-[#dc2626]">{fieldErrors.applicable_from}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] update-tax-modal-label">
            Applicable To
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none update-tax-input-style transition-colors duration-200 ${fieldErrors.applicable_to
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
            className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2892CE] hover:bg-[#2276a7]"
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