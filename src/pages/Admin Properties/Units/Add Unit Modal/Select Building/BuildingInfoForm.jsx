import React, { useState } from "react";
import "./buildinginfo.css";
import { ChevronDown } from "lucide-react";

const BuildingInfoForm = ({ onNext }) => {
  // Form state
  const [formState, setFormState] = useState({
    buildingNo: "",
    plotNo: "",
    buildingName: "",
    address: "",
    description: "",
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
  // const handleNumberStep = (name, step) => {
  //   const currentValue = parseFloat(formState[name]) || 0;
  //   setFormState({
  //     ...formState,
  //     [name]: (currentValue + step).toString(),
  //   });
  // };

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
        {/* Building Name */}
        <div className="col-span-1">
          <label className="block building-info-form-label">
            Building Name*
          </label>
          <div className="relative">
            <select
              name="buildingName"
              value={formState.buildingName}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="buildingName">Choose</option>
              <option value="buildingName">Emaar Square Area </option>
              <option value="buildingName">Emaar Square Area </option>
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

        {/* Description */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Description*</label>
          <textarea
            type="text"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Morbi orci "
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Address */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            type="text"
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Building No */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Building No*</label>
          <input
            type="text"
            name="buildingNo"
            value={formState.buildingNo}
            onChange={handleInputChange}
            placeholder=""
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Plot No. */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plotNo"
            value={formState.plotNo}
            onChange={handleInputChange}
            placeholder=""
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-[29px] col-span-1 text-right">
          <button
            type="submit"
            className="w-[150px] h-[38px] next-btn duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default BuildingInfoForm;
