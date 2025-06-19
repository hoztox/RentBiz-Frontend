import React, { useEffect, useState } from "react";
import "./buildinginfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BASE_URL } from "../../../../../utils/config";
import axios from "axios";

const BuildingInfoForm = ({ onNext, initialData }) => {
  const [formState, setFormState] = useState(
    initialData || {
      building_no: "",
      plot_no: "",
      building_name: "",
      building_address: "",
      description: "",
      remarks: "",
      status: "active",
      latitude: "",
      longitude: "",
      land_mark: "",
      country: "",
      state: "",
    }
  );
  const [companyId, setCompanyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState({
    status: false,
    country: false,
    state: false,
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState({ countries: false, states: false });
  const [errors, setErrors] = useState({});

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      try {
        const response = await axios.get(`${BASE_URL}/accounts/countries/`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading((prev) => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formState.country) {
      const fetchStates = async () => {
        setLoading((prev) => ({ ...prev, states: true }));
        try {
          const response = await axios.get(
            `${BASE_URL}/accounts/countries/${formState.country}/states/`
          );
          setStates(response.data);
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
        } finally {
          setLoading((prev) => ({ ...prev, states: false }));
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setFormState((prev) => ({ ...prev, state: "" }));
    }
  }, [formState.country]);

  const validateField = (name, value) => {
    if (["building_no", "plot_no"].includes(name)) {
      if (!value.trim()) {
        return `${name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} is required and cannot be only spaces.`;
      }
      // Allow alphanumeric characters but require at least one digit for building_no and plot_no
      if (!/^(?=.*\d)[a-zA-Z0-9-]+$/.test(value.trim())) {
        return `${name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} must contain at least one digit and only alphanumeric characters or hyphens.`;
      }
    } else if (["building_name", "building_address", "country"].includes(name)) {
      if (!value.trim()) {
        return `${name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} is required and cannot be only spaces.`;
      }
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart(); // Prevent leading spaces
    setFormState((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));

    const error = validateField(name, trimmedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (name === "status" || name === "country" || name === "state") {
      setIsSelectFocused((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleNumberStep = (name, step) => {
    const currentValue = parseFloat(formState[name]) || 0;
    setFormState({
      ...formState,
      [name]: (currentValue + step).toFixed(4),
    });
  };

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");
    if (role === "company" || role === "user" || role === "admin") {
      return storedCompanyId;
    }
    return null;
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user" || role === "admin") {
      return localStorage.getItem("user_id");
    }
    return null;
  };

  useEffect(() => {
    setCompanyId(getUserCompanyId());
    setUserId(getRelevantUserId());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const requiredFields = ["building_no", "plot_no", "building_name", "building_address", "country"];

    requiredFields.forEach((field) => {
      const error = validateField(field, formState[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const tempData = {
      company: companyId,
      user: userId || null,
      building_name: formState.building_name.trim() || null,
      building_no: formState.building_no.trim() || null,
      plot_no: formState.plot_no.trim() || null,
      description: formState.description.trim() || null,
      remarks: formState.remarks.trim() || null,
      latitude: parseFloat(formState.latitude) || null,
      longitude: parseFloat(formState.longitude) || null,
      land_mark: formState.land_mark.trim() || null,
      building_address: formState.building_address.trim() || null,
      status: formState.status,
      country: formState.country || null,
      state: formState.state || null,
    };
    console.log("Temporarily saved building data:", tempData);
    onNext(tempData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Building No */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Building No*</label>
          <input
            type="text"
            name="building_no"
            value={formState.building_no}
            onChange={handleInputChange}
            className={`w-full building-info-form-inputs focus:border-gray-300 duration-200 ${
              errors.building_no ? "border-red-500" : ""
            }`}
            required
          />
          {errors.building_no && <p className="text-red-500 text-sm">{errors.building_no}</p>}
        </div>

        {/* Plot No */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plot_no"
            value={formState.plot_no}
            onChange={handleInputChange}
            className={`w-full building-info-form-inputs focus:border-gray-300 duration-200 ${
              errors.plot_no ? "border-red-500" : ""
            }`}
            required
          />
          {errors.plot_no && <p className="text-red-500 text-sm">{errors.plot_no}</p>}
        </div>

        {/* Building Name */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Building Name*</label>
          <input
            type="text"
            name="building_name"
            value={formState.building_name}
            onChange={handleInputChange}
            className={`w-full building-info-form-inputs focus:border-gray-300 duration-200 ${
              errors.building_name ? "border-red-500" : ""
            }`}
            required
          />
          {errors.building_name && <p className="text-red-500 text-sm">{errors.building_name}</p>}
        </div>

        {/* Building Address */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="building_address"
            value={formState.building_address}
            onChange={handleInputChange}
            className={`w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200 ${
              errors.building_address ? "border-red-500" : ""
            }`}
            required
          />
          {errors.building_address && <p className="text-red-500 text-sm">{errors.building_address}</p>}
        </div>

        {/* Country */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Country*</label>
          <div className="relative">
            <select
              name="country"
              value={formState.country}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused((prev) => ({ ...prev, country: true }))}
              onBlur={() => setIsSelectFocused((prev) => ({ ...prev, country: false }))}
              className={`w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer ${
                errors.country ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused.country ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        {/* State */}
        <div className="col-span-1">
          <label className="block building-info-form-label">State</label>
          <div className="relative">
            <select
              name="state"
              value={formState.state}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused((prev) => ({ ...prev, state: true }))}
              onBlur={() => setIsSelectFocused((prev) => ({ ...prev, state: false }))}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              disabled={!formState.country || loading.states}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused.state ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            rows="2"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        {/* Remarks */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Remarks</label>
          <textarea
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            rows="2"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        {/* Latitude */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Latitude</label>
          <div className="relative">
            <input
              type="number"
              name="latitude"
              value={formState.latitude}
              onChange={handleInputChange}
              placeholder="0.0000"
              step="0.0001"
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", 0.0001)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", -0.0001)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Longitude */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Longitude</label>
          <div className="relative">
            <input
              type="number"
              name="longitude"
              value={formState.longitude}
              onChange={handleInputChange}
              placeholder="0.0000"
              step="0.0001"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", 0.0001)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", -0.0001)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Status*</label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused((prev) => ({ ...prev, status: true }))}
              onBlur={() => setIsSelectFocused((prev) => ({ ...prev, status: false }))}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused.status ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Near By Landmark */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Near By Landmark</label>
          <input
            type="text"
            name="land_mark"
            value={formState.land_mark}
            onChange={handleInputChange}
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>

      <div className="next-btn-container mt-6 text-right">
        <button type="submit" className="next-btn duration-300">
          Next
        </button>
      </div>
    </form>
  );
};

export default BuildingInfoForm;