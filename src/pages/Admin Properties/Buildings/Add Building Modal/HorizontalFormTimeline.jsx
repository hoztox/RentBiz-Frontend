import React from "react";
import "./HorizontalFormTimeline.css";
import bgimg from "../../../../assets/Images/Admin Buildings/modal-img.svg";
import { useNavigate } from "react-router-dom";

const HorizontalFormTimeline = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      name: "Create Building",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/admin/create-building",
    },
    {
      id: 2,
      name: "Upload Documents",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/admin/upload-documents",
    },
    {
      id: 3,
      name: "Submitted",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
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
        <div>
          <div className="relative top-[-20px] w-[230.44px] h-[175px]">
            <img src={bgimg} alt="Building Illustration" className="w-full h-full" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-8">
          <p className="welcome-text">Hi Charlotte, let's walk</p>
          <p className="welcome-text">you through your building</p>
        </div>
      </div>

      {/* Steps cards */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="timeline-card"
          >
            <div className="flex items-center gap-4">
              <div className="timeline-number">{step.id}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="timeline-title">{step.name}</h3>
                  {step.name !== "Submitted" && (
                    <button
                      className="timeline-button"
                      onClick={() => handleButtonClick(step.route)}
                    >
                      Start
                    </button>
                  )}
                </div>
                <p className="timeline-description">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalFormTimeline;