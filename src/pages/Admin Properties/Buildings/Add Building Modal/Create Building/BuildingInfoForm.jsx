// BuildingInfoForm.jsx
import React, { useState } from 'react';

const BuildingInfoForm = ({ onNext }) => {
  // Form state
  const [formState, setFormState] = useState({
    buildingNo: '',
    plotNo: '',
    buildingName: '',
    address: '',
    description: '',
    remarks1: '',
    remarks2: '',
    status: 'Active',
    latitude: '',
    longitude: '',
    nearByLandmark: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formState);
    
    // Call the onNext prop to move to the next page
    if (onNext) onNext(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-2 gap-6">
        {/* Building No */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Building No*
          </label>
          <input
            type="text"
            name="buildingNo"
            value={formState.buildingNo}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Plot No */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plot No*
          </label>
          <input
            type="text"
            name="plotNo"
            value={formState.plotNo}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Building Name */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Building Name*
          </label>
          <input
            type="text"
            name="buildingName"
            value={formState.buildingName}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Address */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address*
          </label>
          <input
            type="text"
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque faucibus condimentum a, maximus vel enim. Nunc"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        {/* Remarks 1 */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks 1
          </label>
          <input
            type="text"
            name="remarks1"
            value={formState.remarks1}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Remarks 2 */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks 2
          </label>
          <input
            type="text"
            name="remarks2"
            value={formState.remarks2}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status*
          </label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Latitude */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <div className="relative">
            <input
              type="text"
              name="latitude"
              value={formState.latitude}
              onChange={handleInputChange}
              placeholder="5"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Longitude */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <div className="relative">
            <input
              type="text"
              name="longitude"
              value={formState.longitude}
              onChange={handleInputChange}
              placeholder="00000.00"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Near By Landmark */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Near By Landmark
          </label>
          <input
            type="text"
            name="nearByLandmark"
            value={formState.nearByLandmark}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BuildingInfoForm;