import React, { useState, useEffect } from "react";
import "./HorizontalUnitFormTimeline.css";
import bgimg from "../../../../assets/Images/Admin Units/modal-img.svg";
import tickIcon from "../../../../assets/Images/Admin Units/tick-icon.svg";
import { useNavigate } from "react-router-dom";

const HorizontalUnitFormTimeline = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [completedSteps, setCompletedSteps] = useState(
    JSON.parse(localStorage.getItem("unit_completedSteps")) || []
  );
  const [activeCard, setActiveCard] = useState(
    localStorage.getItem("unit_activeCard") === "null"
      ? null
      : parseInt(localStorage.getItem("unit_activeCard")) || 1
  );

  // Update localStorage when completedSteps or activeCard changes
  useEffect(() => {
    localStorage.setItem("unit_completedSteps", JSON.stringify(completedSteps));
    localStorage.setItem(
      "unit_activeCard",
      activeCard === null ? "null" : activeCard.toString()
    );
  }, [completedSteps, activeCard]);

  // Update activeCard to the next incomplete step when completedSteps changes
  useEffect(() => {
    const nextStep = [1, 2, 3, 4].find((id) => !completedSteps.includes(id));
    setActiveCard(nextStep || null);
  }, [completedSteps]);

  // Navigate to /admin/buildings-reset after 3 seconds if all steps are completed
  useEffect(() => {
    if (
      completedSteps.length === 4 &&
      completedSteps.includes(1) &&
      completedSteps.includes(2) &&
      completedSteps.includes(3) &&
      completedSteps.includes(4)
    ) {
      const timer = setTimeout(() => {
        navigate("/admin/unit-reset");
      }, 3000); // 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [completedSteps, navigate]);

  const steps = [
    {
      id: 1,
      name: "Select Building",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/admin/unit-select-building-form",
    },
    {
      id: 2,
      name: "Create Unit",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/admin/unit-create-unit-form",
    },
    {
      id: 3,
      name: "Upload Documents",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/admin/unit-upload-documents",
    },
    {
      id: 4,
      name: "Submitted",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque",
      route: "/unit-submitted",
    },
  ];

  // Function to handle button click
  const handleButtonClick = (route, id) => {
    setActiveCard(id);
    navigate(route);
  };

  return (
    <div className="w-full bg-white flex flex-col mb-[80px]">
      {/* Header Section */}
      <div className="flex flex-col items-center">
        {/* Building illustration */}
        <div>
          <div>
            <img
              src={bgimg}
              alt="Building Illustration"
              className="building-illustration"
            />
          </div>
        </div>
      </div>

      <div className="relative top-[120px]">
        {/* Welcome text */}
        <div className="text-center mb-6">
          <p className="welcome-text">Hi Charlotte, let's walk</p>
          <p className="welcome-text">you through your building</p>
        </div>

        {/* Steps cards */}
        <div className="space-y-4 bg-[#EEF6FD] p-5 rounded-[6px] mb-[80px]">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`timeline-card ${
                completedSteps.includes(step.id)
                  ? "completed"
                  : activeCard === step.id
                  ? "active"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4 relative">
                <div
                  className={`timeline-number ${
                    completedSteps.includes(step.id)
                      ? "completed"
                      : activeCard === step.id
                      ? "active"
                      : ""
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <img src={tickIcon} alt="Tick" className="w-4 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3
                      className={`timeline-title ${
                        completedSteps.includes(step.id)
                          ? "completed"
                          : activeCard === step.id
                          ? "active"
                          : ""
                      }`}
                    >
                      {step.name}
                    </h3>
                    {completedSteps.includes(step.id) ? (
                      <span className="completed-text">Completed</span>
                    ) : step.name !== "Submitted" && activeCard === step.id ? (
                      <button
                        className="timeline-button"
                        onClick={() => handleButtonClick(step.route, step.id)}
                      >
                        Start
                      </button>
                    ) : null}
                  </div>
                  <p
                    className={`timeline-description ${
                      completedSteps.includes(step.id)
                        ? "completed"
                        : activeCard === step.id
                        ? "active"
                        : ""
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalUnitFormTimeline;
