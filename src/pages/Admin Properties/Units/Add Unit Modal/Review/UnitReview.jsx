import React from 'react';

const Review = () => {
  const buildingData = [
    { label: "Building Name*", value: "Emaar Square Area" },
    { label: "Description", value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque faucibus condimentum" },
    { label: "Address*", value: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE" },
    { label: "Building No*", value: "B24090001" },
    { label: "Plot No*", value: "B24090001" },
    { label: "Remarks", value: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci" },
  ];

  const unitData = [
    { label: "Unit Name*", value: "Unit22" },
    { label: "Unit Type*", value: "Apartment" },
    { label: "Bedrooms", value: "2" },
    { label: "Bathrooms", value: "4" },
    { label: "Description", value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque faucibus condimentum" },
    { label: "Address*", value: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE" },
    { label: "Remarks", value: "" },
  ];

  return (
    <div className="container mx-auto p-6 max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review</h1>
        <button className="text-gray-500 hover:text-gray-700">×</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Building</h2>
        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-96">
          {buildingData.map((item, index) => (
            <div key={index}>
              <p className="text-gray-600">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Unit</h2>
        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-96">
          {unitData.map((item, index) => (
            <div key={index}>
              <p className="text-gray-600">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;