import React from 'react'

const SubmissionConfirmation = ({formData}) => {
  return (
    <div className="flex-1 p-6 h-[500px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Submission Complete</h2>
        <p className="text-gray-500 mt-2">Your building information has been successfully submitted</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Building Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Building No:</p>
            <p className="font-medium">{formData.buildingNo || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Plot No:</p>
            <p className="font-medium">{formData.plotNo || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Building Name:</p>
            <p className="font-medium">{formData.buildingName || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Status:</p>
            <p className="font-medium">{formData.status || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionConfirmation