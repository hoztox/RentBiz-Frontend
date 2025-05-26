import React, { useEffect, useState } from 'react'
import "./EditTenantFormTimelineRes.css"
import bgimg from "../../../assets/Images/Admin Tenants/modal-img.svg"
import tickicon from "../../../assets/Images/Admin Tenants/tick-icon.svg"
import { useNavigate } from 'react-router-dom'

const EditTenantFormTimelineRes = () => {
    const navigate = useNavigate();

  // Initialize state from localStorage with unique keys
  const [completedSteps, setCompletedSteps] = useState(
    JSON.parse(localStorage.getItem("edit_tenant_completedSteps")) || []
  );
  const [activeCard, setActiveCard] = useState(
    localStorage.getItem("edit_tenant_activeCard") === "null"
      ? null
      : parseInt(localStorage.getItem("edit_tenant_activeCard")) || 1
  );

  // Update localStorage when completedSteps or activeCard changes
  useEffect(() => {
    localStorage.setItem(
      "edit_tenant_completedSteps",
      JSON.stringify(completedSteps)
    );
    localStorage.setItem(
      "edit_tenant_activeCard",
      activeCard === null ? "null" : activeCard.toString()
    );
  }, [completedSteps, activeCard]);

  // Navigate to /admin/edit-tenant-reset after 3 seconds if all steps are completed
  useEffect(() => {
    if (
      completedSteps.length === 3 &&
      completedSteps.includes(1) &&
      completedSteps.includes(2) &&
      completedSteps.includes(3)
    ) {
      const timer = setTimeout(() => {
        navigate("/admin/edit-tenant-reset");
      }, 3000); // 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [completedSteps, navigate]);

  const steps = [
    {
      id: 1,
      name: "Tenant Details",
      description: "Update tenant information, including personal and contact details.",
      route: "/admin/edit-create-tenant",
    },
    {
      id: 2,
      name: "Upload Documents",
      description: "Modify or upload new documents for the tenant.",
      route: "/admin/edit-tenant-upload-docs",
    },
    {
      id: 3,
      name: "Changes Submitted",
      description: "Review and submit updated tenant information.",
      route: "",
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
        {/* Tenant illustration placeholder */}
        <div>
          <div>
            <img
              src={bgimg}
              alt="Tenant Illustration"
              className="building-illustration"
            />
          </div>
        </div>
      </div>

      <div className="relative top-[120px]">
        {/* Welcome text */}
        <div className="text-center mb-6">
          <p className="welcome-text">Hi Charlotte, let's update</p>
          <p className="welcome-text">your tenant's details</p>
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
                    <img src={tickicon} alt="Tick" className="w-4 h-3" />
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
                    ) : step.name !== "Changes Submitted" &&
                      activeCard === step.id ? (
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
  )
}

export default EditTenantFormTimelineRes
