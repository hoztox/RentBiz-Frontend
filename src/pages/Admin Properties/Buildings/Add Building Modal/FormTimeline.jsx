import React, { useEffect, useState } from "react";
import "./formtimeline.css"
import activecircle from "../../../../assets/Images/Admin Buildings/active-circle.svg";
import inactivecircle from "../../../../assets/Images/Admin Buildings/inactive-circle.svg";

const FormTimeline = ({ currentStep, progress }) => {
  const steps = [
    { id: 1, name: "Create Building", key: "createBuilding" },
    { id: 2, name: "Upload Documents", key: "uploadDocuments" },
    { id: 3, name: "Submitted", key: "submitted" },
  ];

  const [delayedStep, setDelayedStep] = useState(1);

  useEffect(() => {
    if (currentStep > delayedStep) {
      setTimeout(() => {
        setDelayedStep(currentStep);
      }, 800); // Delay to match the progress line fill
    }
  }, [currentStep]);

  const calculateProgressHeight = (stepId, stepKey) => {
    if (currentStep > stepId) {
      return "100%";
    } else if (currentStep === stepId) {
      const progressValue = progress[stepKey] || 0;
      const boundedProgress = Math.max(0, Math.min(100, progressValue));
      return `${boundedProgress}%`;
    }
    return "0%";
  };

  return (
    <div className="w-[240px] pr-8 relative">
      <div
        className="absolute w-0.5 bg-[#DBDBDB] left-[15px] top-6"
        style={{
          height: `${steps.length * 125}px`,
        }}
      ></div>

      {steps.map((step, index) => (
        <div key={step.id} className="relative z-10">
          <div className="flex items-center mb-4 absolute">
            <div className="w-8 h-6 flex items-center justify-center bg-white rounded-full z-10">
              <img
                src={delayedStep >= step.id ? activecircle : inactivecircle}
                alt={`Step ${step.id} ${delayedStep >= step.id ? "active" : "inactive"}`}
                className="w-6 h-6 transition-opacity duration-500"
              />
            </div>

            <span
              className={`ml-3 transition-colors duration-500 step-name ${delayedStep >= step.id ? "text-[#2892CE]" : "text-[#DBDBDB]"
                }`}
            >
              {step.name}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="relative ml-[15px] h-48">
              <div
                className="absolute w-0.5 bg-[#2892CE] origin-top transition-all duration-1000 ease-out"
                style={{
                  height: calculateProgressHeight(step.id, step.key),
                }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormTimeline;
