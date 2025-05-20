import React from "react";
import "./HorizontalFormTimeline.css";
import bgimg from "../../../../assets/Images/Admin Buildings/modal-bg-img.svg";
import { useNavigate } from "react-router-dom";

const HorizontalFormTimeline = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      name: "Create Building",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque.",
      route: "/admin/create-building",
    },
    {
      id: 2,
      name: "Upload Documents",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque.",
      route: "/admin/upload-documents",
    },
    {
      id: 3,
      name: "Submitted",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque.",
      route: "/submitted",
    },
  ];

  // Function to handle button click
  const handleButtonClick = (route) => {
    navigate(route); // Navigate to the step's specific route
  };

  return (
    <div className="w-full bg-white flex flex-col mb-[80px]">
      {/* Header Section */}
      <div className="flex flex-col items-center">
        {/* Building illustration */}
        <div className="my-6">
          <div className="w-[230px] h-[214px] relative">
            <img src={bgimg} alt="Building Illustration" className="w-full h-full" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-8">
          <h2 className="text-blue-600 text-xl font-medium">Hi Charlotte, let's walk</h2>
          <h2 className="text-blue-600 text-xl font-medium">you through your building</h2>
        </div>
      </div>

      {/* Steps cards */}
      <div className="px-4 space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="p-4 rounded-lg border mobile-timeline-card border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center step-number border border-gray-300 text-gray-500"
                >
                  {step.id}
                </div>
                <span className="ml-3 font-medium">{step.name}</span>
              </div>

              {step.name !== "Submitted" && (
                <button
                  className="bg-blue-500 text-white text-sm py-1 px-3 rounded start-button"
                  onClick={() => handleButtonClick(step.route)}
                >
                  Start
                </button>
              )}
            </div>

            <p className="text-gray-500 text-sm mt-2 ml-11 step-description">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalFormTimeline;