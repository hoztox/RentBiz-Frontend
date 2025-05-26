import React, { useState } from "react";
import "./buildinginfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    }
  );

  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    if (name === "status" || name === "company") {
      setIsSelectFocused(false);
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

  if (role === "company") {
    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;
  }

  return null;
};


  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempData = {
      company: companyId,
      user: userId,
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
    };
    console.log("Temporarily saved building data:", tempData);
    onNext(tempData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-2 gap-5">
        {/* Company */}


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
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${isSelectFocused ? "rotate-180" : ""
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