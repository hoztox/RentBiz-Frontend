import React, { useEffect, useState } from "react";
import closeicon from "../../../../../assets/Images/Admin Units/close-icon.svg";
import FromTimeline from "../FromTimeline";
import BuildingInfoForm from "../Select Building/BuildingInfoForm";
import UnitInfoForm from "../Create Unit/UnitInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import UnitReview from "../Review/UnitReview";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";

const UnitFormFlow = ({ onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [formProgress, setFormProgress] = useState({
    selectBuilding: 0,
    createUnit: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);

  const pageTitles = [
    "Select Building",
    "Create Unit",
    "Upload Documents",
    "Review",
    ""
  ];


  const currentTitle = pageTitles[currentPageIndex];

  useEffect(() => {
    const newProgress = { selectBuilding: 0, createUnit: 0, uploadDocuments: 0, review: 0, submitted: 0 };

    if (currentPageIndex >= 1) newProgress.createBuilding = 100;
    if (currentPageIndex >= 2) newProgress.uploadDocuments = 100;

    if (currentPageIndex === 0 && formData.buildingNo) {
      const requiredFields = [
        "buildingNo",
        "plotNo",
        "buildingName",
        "address",
      ];
      const filledFields = requiredFields.filter((field) =>
        formData[field]?.trim()
      ).length;
      newProgress.createBuilding = Math.min(
        100,
        (filledFields / requiredFields.length) * 100
      );
    }

    setFormProgress(newProgress);
  }, [currentPageIndex, formData]);

  const handleNextPage = (pageData) => {
    // Start animation
    setAnimating(true);

    // Update form data immediately
    setFormData((prevData) => ({ ...prevData, ...pageData }));

    // Delay the page change to allow for animation
    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setAnimating(false);
    }, 500); // Match this with your CSS transition duration
  };

   const handlePreviousPage = () => {
    setAnimating(true);

    setTimeout(() => {
      setCurrentPageIndex(prev => Math.max(prev - 1, 0)); // prevent going below 0
      setAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    setCurrentPageIndex(0);
    setFormData({});
    setFormProgress({ createBuilding: 0, uploadDocuments: 0, submitted: 0 });
    onClose(); // Call parent-provided close handler
  };

  const pageComponents = [
    <BuildingInfoForm key="building" onNext={handleNextPage} />,
    <UnitInfoForm key="info" onNext={handleNextPage} onBack={handlePreviousPage} />,
    <DocumentsForm key="docs" onNext={handleNextPage} onBack={handlePreviousPage} />,
    <UnitReview key="review" onNext={handleNextPage} onBack={handlePreviousPage} />,
    <SubmissionConfirmation key="confirm" formData={formData} />,
  ];

  return (
    <div className="flex">
      {/* Left Side - Timeline */}
      <div className="w-[350px] pr-[53px]">
        <FromTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>

      {/* Right Side - Form Steps & Modal Header */}
      <div className="w-full h-[780px] px-[33px] pt-[50px] pb-[40px] overflow-y-scroll">
        {/* Modal Header */}
        <div className="building-modal-header flex justify-between items-center mb-[41px]">
          <h3 className="building-modal-title">{currentTitle}</h3>
          <button
            onClick={handleClose}
            className="border border-[#E9E9E9] rounded-full p-[11px]"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Current Form Page with Animation */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            animating
              ? "opacity-0 transform translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {pageComponents[currentPageIndex]}
        </div>
      </div>
    </div>
  );
};

export default UnitFormFlow;
