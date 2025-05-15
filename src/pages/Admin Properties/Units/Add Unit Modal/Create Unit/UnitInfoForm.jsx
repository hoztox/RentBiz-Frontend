import React, { useState } from "react";
import "./unitinfoform.css";
import { ChevronDown } from "lucide-react";

const UnitInfoForm = ({ onNext, onBack }) => {
  // Form state
  const [formState, setFormState] = useState({
    unitName: "",
    unitType: "Shop",
    buildingName: "",
    address: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    status: "Active",
    premise: "",
    remarks: "",
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
  //   const handleNumberStep = (name, step) => {
  //     const currentValue = parseFloat(formState[name]) || 0;
  //     setFormState({
  //       ...formState,
  //       [name]: (currentValue + step).toString()
  //     });
  //   };

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
        {/* Unit Name */}
        <div className="col-span-1">
          <label className="block unit-info-form-label">Unit Name*</label>
          <input
            type="text"
            name="unitName"
            placeholder="Enter Unit Name "
            value={formState.unitName}
            onChange={handleInputChange}
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Unit Type */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Unit Type*</label>
          <div className="relative">
            <select
              name="unitType"
              value={formState.unitType}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none unit-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="choose">Choose</option>
              <option value="Shop">Shop</option>
              <option value="Shop">Shop</option>
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

        {/* No. of BedRooms */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Bedrooms</label>
          <input
            type="text"
            name="bedrooms"
            value={formState.bedrooms}
            onChange={handleInputChange}
            placeholder="Enter Number Of Bedrooms"
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* No. of Bathrooms */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Bathrooms</label>
          <input
            type="text"
            name="bathrooms"
            value={formState.bathrooms}
            onChange={handleInputChange}
            placeholder="Enter Number Of Bathrooms"
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Address */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Description*</label>
          <textarea
            type="text"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Morbi orci ante, scelerisque faucibus condimentum "
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            type="text"
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE"
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        {/* Premise Number */}
        <div className="col-span-1">
          <label className="block building-info-form-label">
            Premise Number*
          </label>
          <input
            type="text"
            name="premise"
            value={formState.premise}
            onChange={handleInputChange}
            placeholder="Enter Premise Number"
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Status */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Unit Status*</label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none unit-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="Choose">Choose</option>
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

        {/* Remarks */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Remarks*</label>
          <input
            type="text"
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            placeholder="Enter Remarks"
            className="w-full unit-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-[29px]">
          <button
            type="button"
            className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#2892CE] text-white  hover:bg-[#1f709e] next-button"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default UnitInfoForm;
