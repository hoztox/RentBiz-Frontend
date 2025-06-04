import React, { useEffect, useState, useRef } from "react";
import "./CreateTaxModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { ChevronDown } from "lucide-react";
import { useModal } from "../../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";
import { toast } from "react-hot-toast";

const CreateTaxModal = () => {
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
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);

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
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accounts/countries/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const fetchedCountries = Array.isArray(response.data) ? response.data : [];
        setCountries(fetchedCountries);
        setFilteredCountries(fetchedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        toast.error("Failed to load countries");
      }
    };

    fetchCountries();
  }, []);

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

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-tax-master") {
      setCountry("");
      setState("");
      setTaxType("");
      setTaxPercentage("");
      setApplicableFrom("");
      setApplicableTo("");
      setCountryFilter("");
      setFilteredCountries(countries);
      setError(null);
      setFieldErrors({});
    }
  }, [modalState.isOpen, modalState.type, countries]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryDropdownOpen(false);
        setCountryFilter("");
        setFilteredCountries(countries);
      }
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target)
      ) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [countries]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isCountryDropdownOpen && event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
        setCountryFilter((prev) => prev + event.key);
      } else if (isCountryDropdownOpen && event.key === "Backspace") {
        event.preventDefault();
        setCountryFilter((prev) => prev.slice(0, -1));
      } else if (isCountryDropdownOpen && event.key === "Escape") {
        setIsCountryDropdownOpen(false);
        setCountryFilter("");
        setFilteredCountries(countries);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCountryDropdownOpen, countries]);

  useEffect(() => {
    if (countryFilter) {
      setFilteredCountries(
        countries.filter((c) =>
          c.name.toLowerCase().startsWith(countryFilter.toLowerCase())
        )
      );
    } else {
      setFilteredCountries(countries);
    }
  }, [countryFilter, countries]);

  if (!modalState.isOpen || modalState.type !== "create-tax-master") {
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID is missing or invalid. Please log in again.");
      toast.error("Company ID is missing or invalid. Please log in again.");
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

      const response = await axios.post(
        `${BASE_URL}/company/taxes/${companyId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      toast.success(
        response.data.applicable_to
          ? "Tax created successfully"
          : "New tax created and set as active. Previous tax (if any) was closed."
      );
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error creating tax:", err);
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).flat().join(", ") ||
        "Failed to create tax";
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

  const selectCountry = (countryId, countryName) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 tax-modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="create-tax-modal-wrapper relative bg-white rounded-md w-full max-w-[522px] h-auto p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="tax-modal-head">Create New Tax Master</h2>
          <button
            onClick={closeModal}
            className="tax-close-btn hover:bg-gray-100 duration-200"
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
              <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
                Country *
              </label>
              <div className="relative" ref={countryDropdownRef}>
                <button
                  onClick={toggleCountryDropdown}
                  className={`flex items-center justify-between px-3 py-2 border rounded-md bg-[#FBFBFB] w-full tax-input-style transition-colors duration-200 ${
                    fieldErrors.country
                      ? "border-red-500"
                      : "border-[#E9E9E9]"
                  }`}
                  disabled={loading || countries.length === 0}
                >
                  <span
                    className={`${
                      country ? "text-[#201D1E]" : "text-gray-500"
                    }`}
                  >
                    {country
                      ? countries.find((c) => c.id === parseInt(country))?.name ||
                        "Choose"
                      : countryFilter || "Choose"}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`ml-2 transform transition-transform duration-300 ease-in-out text-[#201D1E] ${
                      isCountryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
                    isCountryDropdownOpen
                      ? "opacity-100 max-h-40 transform translate-y-0"
                      : "opacity-0 max-h-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1 max-h-40 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No countries found
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => selectCountry(country.id, country.name)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#201D1E] hover:bg-gray-100"
                        >
                          {country.name || `Country ${country.id}`}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
                {fieldErrors.country && (
                  <span className="text-[#dc2626]">{fieldErrors.country}</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
                State
              </label>
              <div className="relative" ref={stateDropdownRef}>
                <button
                  onClick={toggleStateDropdown}
                  className={`flex items-center justify-between px-3 py-2 border rounded-md bg-[#FBFBFB] w-full tax-input-style transition-colors duration-200 ${
                    fieldErrors.state
                      ? "border-red-500"
                      : "border-[#E9E9E9]"
                  }`}
                  disabled={loading || !country || states.length === 0}
                >
                  <span
                    className={`${
                      state ? "text-[#201D1E]" : "text-gray-500"
                    }`}
                  >
                    {state
                      ? states.find((s) => s.id === parseInt(state))?.name ||
                        "Choose"
                      : "Choose"}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`ml-2 transform transition-transform duration-300 ease-in-out text-[#201D1E] ${
                      isStateDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
                    isStateDropdownOpen
                      ? "opacity-100 max-h-40 transform translate-y-0"
                      : "opacity-0 max-h-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1 max-h-40 overflow-y-auto">
                    {states.map((state) => (
                      <button
                        key={state.id}
                        onClick={() => selectState(state.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-[#201D1E] hover:bg-gray-100"
                      >
                        {state.name || `State ${state.id}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
                {fieldErrors.state && (
                  <span className="text-[#dc2626]">{fieldErrors.state}</span>
                )}
              </div>
            </div>
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
            Tax Type *
          </label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none tax-input-style transition-colors duration-200 ${
              fieldErrors.taxType
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
            {fieldErrors.taxType && (
              <span className="text-[#dc2626]">{fieldErrors.taxType}</span>
            )}
          </div>

          <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
            Tax Percentage *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none tax-input-style transition-colors duration-200 ${
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

          <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
            Applicable From *
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none tax-input-style transition-colors duration-200 ${
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

          <label className="block pt-2 mb-2 text-[#201D1E] tax-modal-label">
            Applicable To
          </label>
          <input
            type="date"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none tax-input-style transition-colors duration-200 ${
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
            <span className="text-gray-500">
              Leave blank to keep the tax active until superseded.
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-[-10px]">
          <button
            onClick={handleSave}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] tax-modal-save-btn duration-200`}
            aria-label="Save tax"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaxModal;