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
      country: "", // Added country field
      state: "",   // Added state field
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
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
    const tempData = {
      company: companyId,
      user: userId || null,
      building_name: formState.building_name || null,
      building_no: formState.building_no || null,
      plot_no: formState.plot_no || null,
      description: formState.description || null,
      remarks: formState.remarks || null,
      latitude: parseFloat(formState.latitude) || null,
      longitude: parseFloat(formState.longitude) || null,
      land_mark: formState.land_mark || null,
      building_address: formState.building_address || null,
      status: formState.status,
      country: formState.country || null, // Include country
      state: formState.state || null,     // Include state
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
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Plot No */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plot_no"
            value={formState.plot_no}
            onChange={handleInputChange}
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Building Name */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Building Name*</label>
          <input
            type="text"
            name="building_name"
            value={formState.building_name}
            onChange={handleInputChange}
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Building Address */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="building_address"
            value={formState.building_address}
            onChange={handleInputChange}
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
            required
          />
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
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
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