import React, { useState, useEffect } from "react";
import "./buildinginfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResponsiveBuildingInfoForm = () => {
  const [formState, setFormState] = useState(
    JSON.parse(localStorage.getItem("building_formData"))?.building || {
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
      company: null,
      user: null,
    }
  );

  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const navigate = useNavigate();

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
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();
    setFormState((prev) => ({
      ...prev,
      company: companyId,
      user: userId,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    if (name === "status") {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempData = {
      building: {
        company: formState.company,
        user: formState.user,
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
      },
      documents: JSON.parse(localStorage.getItem("building_formData"))?.documents || { documents: [] },
    };
    localStorage.setItem("building_formData", JSON.stringify(tempData));
    localStorage.setItem("building_completedSteps", JSON.stringify([1]));
    localStorage.setItem("building_activeCard", "2");
    navigate("/admin/upload-documents");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 building-info-form-container"
    >
      <div className="grid grid-cols-1 gap-5">
        <div className="col-span-1">
          <label className="block building-info-form-label">Building No*</label>
          <input
            type="text"
            name="building_no"
            value={formState.building_no}
            onChange={handleInputChange}
            placeholder="1"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plot_no"
            value={formState.plot_no}
            onChange={handleInputChange}
            placeholder="1"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Building Name*</label>
          <input
            type="text"
            name="building_name"
            value={formState.building_name}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="building_address"
            value={formState.building_address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Remarks</label>
          <input
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

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
          <label className="block building-info-form-label">Latitude</label>
          <div className="relative">
            <input
              type="number"
              name="latitude"
              value={formState.latitude}
              onChange={handleInputChange}
              placeholder="0.0000"
              step="0.0001"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
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

        <div className="col-span-1">
          <label className="block building-info-form-label">Near By Landmark</label>
          <input
            type="text"
            name="land_mark"
            value={formState.land_mark}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>

      <div className="next-btn-container mt-6 text-right mb-[80px]">
        <button type="submit" className="next-btn duration-300">
          Next
        </button>
      </div>
    </form>
  );
};

export default ResponsiveBuildingInfoForm;