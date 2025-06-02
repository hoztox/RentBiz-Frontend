import React, { useState, useEffect } from "react";
import "./unitinfoform.css";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";

const UnitInfoForm = ({ onNext, onBack, initialData }) => {
  const [formState, setFormState] = useState(
    initialData || {
      unit_name: "",
      unit_type: "",
      address: "",
      description: "",
      remarks: "",
      no_of_bedrooms: "",
      no_of_bathrooms: "",
      premise_no: "",
      unit_status: "active",
    }
  );
  const [unitTypes, setUnitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [userId, setUserId] = useState(null);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");

    console.log("Role:", role);
    console.log("Raw company_id from localStorage:", storedCompanyId);

    if (role === "company") {
      return storedCompanyId;
    } else if (role === "user" || role === "admin") {
      return storedCompanyId;
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

  useEffect(() => {
    const fetchUnitTypes = async () => {
      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(`${BASE_URL}/company/unit-types/company/${companyId}`);
        setUnitTypes(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching unit types:", error);
        setError("Failed to load unit types. Using default options.");
        setUnitTypes([]);
      } finally {
        setLoading(false);
      }
    };

    setCompanyId(getUserCompanyId());
    setUserId(getRelevantUserId());
    fetchUnitTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === "no_of_bedrooms" || name === "no_of_bathrooms" ? parseInt(value) || "" : value,
    });
    if (name === "unit_type" || name === "unit_status") {
      setIsSelectFocused(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["unit_name", "unit_type", "address", "premise_no", "unit_status"];
    const missingFields = requiredFields.filter((field) => !formState[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      return;
    }

    const tempData = {
      company: companyId,
      user: userId || null,
      unit_name: formState.unit_name || null,
      unit_type: parseInt(formState.unit_type) || null,
      address: formState.address || null,
      description: formState.description || null,
      remarks: formState.remarks || null,
      no_of_bedrooms: parseInt(formState.no_of_bedrooms) || null,
      no_of_bathrooms: parseInt(formState.no_of_bathrooms) || null,
      premise_no: formState.premise_no || null,
      unit_status: formState.unit_status,
    };
    console.log("Temporarily saved unit data (onNext):", tempData);
    onNext(tempData);
  };

  const handleBack = () => {
    const tempData = {
      company: companyId,
      user: userId || null,
      unit_name: formState.unit_name || null,
      unit_type: parseInt(formState.unit_type) || null,
      address: formState.address || null,
      description: formState.description || null,
      remarks: formState.remarks || null,
      no_of_bedrooms: parseInt(formState.no_of_bedrooms) || null,
      no_of_bathrooms: parseInt(formState.no_of_bathrooms) || null,
      premise_no: formState.premise_no || null,
      unit_status: formState.unit_status,
    };
    console.log("Temporarily saved unit data (onBack):", tempData);
    onBack(tempData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="col-span-1">
          <label className="block unit-info-form-label">Unit Name*</label>
          <input
            type="text"
            name="unit_name"
            value={formState.unit_name}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Unit Type*</label>
          <div className="relative">
            <select
              name="unit_type"
              value={formState.unit_type}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none unit-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Select Unit Type</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : unitTypes.length > 0 ? (
                unitTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))
              ) : (
                <>
                  No unit types available. Please add.
                </>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Bedrooms</label>
          <input
            type="number"
            name="no_of_bedrooms"
            value={formState.no_of_bedrooms}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Bathrooms</label>
          <input
            type="number"
            name="no_of_bathrooms"
            value={formState.no_of_bathrooms}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Address*</label>
          <textarea
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs resize-none focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Premise Number*</label>
          <input
            type="text"
            name="premise_no"
            value={formState.premise_no}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Unit Status*</label>
          <div className="relative">
            <select
              name="unit_status"
              value={formState.unit_status}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none unit-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              <option value="occupied">Occupied</option>
              <option value="renovation">Renovation</option>
              <option value="vacant">Vacant</option>
              <option value="disputed">Disputed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block unit-info-form-label">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
        <div className="flex justify-end gap-4 mt-[29px]">
          <button
            type="button"
            className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default UnitInfoForm;