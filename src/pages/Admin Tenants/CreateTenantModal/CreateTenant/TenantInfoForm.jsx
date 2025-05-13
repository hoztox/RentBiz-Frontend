import { useState } from "react";
import "./tenantinfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";

const TenantInfoForm = ({ onNext }) => {
  // Form state
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

  // State to track if select is focused
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });

    // If the changed input is 'status', reset isSelectFocused
    if (name === "status") {
      setIsSelectFocused(false);
    }
  };

  // Function to handle incrementing/decrementing number inputs
  const handleNumberStep = (name, step) => {
    const currentValue = parseFloat(formState[name]) || 0;
    setFormState({
      ...formState,
      [name]: (currentValue + step).toString(),
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formState);

    // Call the onNext prop to move to the next page
    if (onNext) onNext(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-2 gap-5">
        {/* Building No */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Building No*</label>
          <input
            type="text"
            name="buildingNo"
            value={formState.buildingNo}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Plot No */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plotNo"
            value={formState.plotNo}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Building Name */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Building Name*
          </label>
          <input
            type="text"
            name="buildingName"
            value={formState.buildingName}
            onChange={handleInputChange}
            placeholder=""
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Address */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Address*</label>
          <textarea
            type="text"
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder=""
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder=""
            rows="2"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Remarks 1 */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Remarks</label>
          <textarea
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            placeholder=""
            rows="2"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Latitude */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Latitude</label>
          <div className="relative">
            <input
              type="number"
              name="latitude"
              value={formState.latitude}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 pr-8"
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

        {/* Longitude */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Longitude</label>
          <div className="relative">
            <input
              type="number"
              name="longitude"
              value={formState.longitude}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200 pr-8"
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

        {/* Status */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Status*</label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
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

        {/* Near By Landmark */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Near By Landmark
          </label>
          <input
            type="text"
            name="nearByLandmark"
            value={formState.nearByLandmark}
            onChange={handleInputChange}
            placeholder=""
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="w-[150px] h-[38px] next-btn duration-300"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default TenantInfoForm;
