import React, { useState } from "react";
import "./buildinginfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResponsiveUpdateBuildingInfoForm = () => {
  const [formState, setFormState] = useState({
    buildingNo: "",
    plotNo: "",
    buildingName: "",
    address: "",
    description: "",
    remarks: "",
    status: "Active",
    latitude: "",
    longitude: "",
    nearByLandmark: "",
  });

  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const navigate = useNavigate();

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
      [name]: (currentValue + step).toString(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update Form submitted:", formState);
    // Save completion state and active card in localStorage
    const completedSteps = [1]; // Mark "Update Building" (id: 1) as completed
    console.log("Setting update_building_completedSteps:", completedSteps);
    console.log("Setting update_building_activeCard: 2");
    localStorage.setItem("update_building_completedSteps", JSON.stringify(completedSteps));
    localStorage.setItem("update_building_activeCard", "2"); // Set "Upload Documents" (id: 2) as active
    navigate("/admin/update-building-timeline");
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
            name="buildingNo"
            value={formState.buildingNo}
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
            name="plotNo"
            value={formState.plotNo}
            onChange={handleInputChange}
            placeholder="1"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">
            Building Name*
          </label>
          <input
            type="text"
            name="buildingName"
            value={formState.buildingName}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="address"
            value={formState.address}
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
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Morbi orci ante, scelerisque"
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
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
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
              placeholder="0.00"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", 0.01)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", -0.01)}
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
              placeholder="0.00"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", 0.01)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", -0.01)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">
            Near By Landmark
          </label>
          <input
            type="text"
            name="nearByLandmark"
            value={formState.nearByLandmark}
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

export default ResponsiveUpdateBuildingInfoForm;
