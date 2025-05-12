import React from "react";
import bgimg from "../../../../assets/Images/Admin Buildings/modal-bg-img.svg"
import arrow from "../../../../assets/Images/Admin Buildings/timeline-arrow.svg"
import "./formtimeline.css"

const steps = [
  { id: 1, name: "Update Building", key: "updateBuilding" },
  { id: 2, name: "Upload Documents", key: "uploadDocuments" },
  { id: 3, name: "Review", key: "review" },
  { id: 4, name: "Submitted", key: "submitted" },
];

const FormTimeline = ({ currentStep }) => {
  return (
    <div className="w-[350px] h-full bg-[#1458A2] text-white relative flex flex-col justify-start rounded-md">
      <div className="mt-[60px]">
      {steps.map((step) => (
        <div key={step.id} className="relative flex justify-between items-center mb-9 px-[34px]">
          {/* Step Circle with Animation */}
          <div className="flex items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full circle transition-all duration-500 ease-in-out
            ${currentStep >= step.id ? "bg-white text-[#1458A2] scale-110" : "border border-[#64A2E7] text-[#64A2E7]"}`}
          >
            {step.id}
          </div>

          {/* Step Label with Animation */}
          <span
            className={`ml-4 step-label transition-colors duration-500 ease-in-out
            ${currentStep >= step.id ? "active" : "inactive opacity-70"}`}
          >
            {step.name}
          </span>
          </div>

          {/* Arrow Icon for Active Step with Animation */}
          <div className={`arrow-container transition-opacity duration-500 ease-in-out ${currentStep === step.id ? "opacity-100" : "opacity-0"}`}>
            {currentStep === step.id ? (
              <img src={arrow} alt="Right Arrow" className="animate-fadeIn" />
            ) : (
              <div className="w-6 h-6"></div> // Placeholder to maintain layout
            )}
          </div>
        </div>
      ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-bottom"
        style={{ backgroundImage: `url(${bgimg})` }}>
      </div>
    </div>
  );
};

export default FormTimeline;