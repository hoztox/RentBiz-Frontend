import React, { useEffect, useState, useRef } from "react";
import "./UpdateTaxModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import { toast } from "react-hot-toast";

const UpdateTaxModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [taxType, setTaxType] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");
  const [applicableFrom, setApplicableFrom] = useState("");
  const [applicableTo, setApplicableTo] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedCountries = await locationApi.fetchCountries();
        setCountries(fetchedCountries);
        setFilteredCountries(fetchedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        toast.error(err.message);
      }
    };

    loadCountries();
  }, []);

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

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-tax-master") {
      const modalTaxData = modalState.data;
      
      if (!modalTaxData?.tax_id || !modalTaxData?.company_id) {
        setError("Tax ID or Company ID is missing.");
        toast.error("Tax ID or Company ID is missing.");
        setFetchLoading(false);
        return;
      }

      const fetchTaxData = async () => {
        setFetchLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${BASE_URL}/company/taxes/${modalTaxData.company_id}/${modalTaxData.tax_id}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const fetchedTaxData = response.data;
          setCountry(fetchedTaxData.country ? String(fetchedTaxData.country) : "");
          setState(fetchedTaxData.state ? String(fetchedTaxData.state) : "");
          setTaxType(fetchedTaxData.tax_type || "");
          setTaxPercentage(
            fetchedTaxData.tax_percentage !== undefined && fetchedTaxData.tax_percentage !== null
              ? String(fetchedTaxData.tax_percentage)
              : ""
          );
          setApplicableFrom(fetchedTaxData.applicable_from || "");
          setApplicableTo(fetchedTaxData.applicable_to || "");
          setFieldErrors({});
        } catch (err) {
          console.error("Error fetching tax data:", err);
          const errorMessage =
            err.response?.data?.detail || "Failed to load tax data";
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setFetchLoading(false);
        }
      };

      fetchTaxData();
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
      errors.applicableTo =
        "Applicable To date must be after Applicable From date";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasCriticalFieldsChanged = async () => {
    const modalTaxData = modalState.data;
    if (!modalTaxData?.company_id || !modalTaxData?.tax_id) {
      return false;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/company/taxes/${modalTaxData.company_id}/${modalTaxData.tax_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const originalData = response.data;
      return (
        parseFloat(taxPercentage) !== parseFloat(originalData.tax_percentage) ||
        applicableFrom !== originalData.applicable_from ||
        applicableTo !== originalData.applicable_to
      );
    } catch (err) {
      console.error("Error checking critical fields:", err);
      return false;
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const modalTaxData = modalState.data;
    const companyId = modalTaxData?.company_id;
    const taxId = modalTaxData?.tax_id;

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

      const isNewVersion = await hasCriticalFieldsChanged();
      toast.success(
        isNewVersion
          ? "New tax version created successfully"
          : "Tax record updated successfully"
      );
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
    if (!isCountryDropdownOpen) {
      setCountryFilter("");
      setFilteredCountries(countries);
    }
  };

  const toggleStateDropdown = () => {
    setIsStateDropdownOpen(!isStateDropdownOpen);
  };

  const selectCountry = (countryId) => {
    setCountry(countryId);
    setState("");
    setIsCountryDropdownOpen(false);
    setCountryFilter("");
    setFilteredCountries(countries);
  };

  const selectState = (stateId) => {
    setState(stateId);
    setIsStateDropdownOpen(false);
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
            disabled={loading || fetchLoading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {fetchLoading ? (
          <div className="p-5 text-center">Loading tax data...</div>
        ) : (
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
                    className={`w-full border rounded-md mt-1 px-3 py-2 appearance-none bg-transparent cursor-pointer focus:outline-none update-tax-input-style transition-colors duration-200 ${
                      fieldErrors.country
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500 update-tax-choose-selected"
                        : country === ""
                        ? "border-[#E9E9E9] focus:ring-gray-500 update-tax-choose-selected"
                        : "border-[#E9E9E9] focus:ring-gray-500"
                    }`}
                    onFocus={() => setIsCountrySelectOpen(true)}
                    onBlur={() => setIsCountrySelectOpen(false)}
                    disabled={loading || fetchLoading || countries.length === 0}
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
                    disabled={loading || fetchLoading || !country || states.length === 0}
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
              disabled={loading || fetchLoading}
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
              disabled={loading || fetchLoading}
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
              disabled={loading || fetchLoading}
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
              disabled={loading || fetchLoading}
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
        )}

        <div className="flex justify-end mt-[-10px]">
          <button
            onClick={handleUpdate}
            className={`${
              loading || fetchLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] update-tax-modal-save-btn duration-200`}
            aria-label="Save tax changes"
            disabled={loading || fetchLoading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaxModal;