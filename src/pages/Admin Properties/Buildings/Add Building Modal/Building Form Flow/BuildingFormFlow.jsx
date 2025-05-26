import React, { useState, useEffect } from "react";
import closeicon from "../../../../../assets/Images/Admin Buildings/close-icon.svg";
import FormTimeline from "../FormTimeline";
import BuildingInfoForm from "../Create Building/BuildingInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";

const BuildingFormFlow = ({ onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({
    building: null,
    documents: null,
  });
  const [formProgress, setFormProgress] = useState({
    createBuilding: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);

  // Dynamic page titles based on current page
  const pageTitles = [
    "Create New Building",
    "Upload Documents",
    "Review",
    "",
  ];

  // Get current title based on page index
  const currentTitle = pageTitles[currentPageIndex];

  useEffect(() => {
    const newProgress = { createBuilding: 0, uploadDocuments: 0, review: 0, submitted: 0 };

    if (currentPageIndex >= 1) newProgress.createBuilding = 100;
    if (currentPageIndex >= 2) newProgress.uploadDocuments = 100;
    if (currentPageIndex >= 3) newProgress.review = 100;

    if (currentPageIndex === 0 && formData.building) {
      const requiredFields = [
        "building_no",
        "plot_no",
        "building_name",
        "building_address",
        "company",
      ];
      const filledFields = requiredFields.filter(
        (field) => formData.building[field]
      ).length;
      newProgress.createBuilding = Math.min(
        100,
        (filledFields / requiredFields.length) * 100
      );
    }

    setFormProgress(newProgress);
  }, [currentPageIndex, formData]);

  const handleNextPage = (pageData) => {
    setAnimating(true);
    setFormData((prevData) => ({
      ...prevData,
      [currentPageIndex === 0 ? "building" : "documents"]: pageData,
    }));

    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setAnimating(false);
    }, 500);
  };

  const handlePreviousPage = (pageData) => {
    setAnimating(true);
    if (pageData) {
      setFormData((prevData) => ({
        ...prevData,
        documents: pageData,
      }));
    }

    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
      setAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    setCurrentPageIndex(0);
    setFormData({ building: null, documents: null });
    setFormProgress({ createBuilding: 0, uploadDocuments: 0, review: 0, submitted: 0 });
    onClose();
  };

  const pageComponents = [
    <BuildingInfoForm
      key="info"
      onNext={handleNextPage}
      initialData={formData.building}
    />,
    <DocumentsForm
      key="docs"
      onNext={handleNextPage}
      onBack={handlePreviousPage}
      initialData={formData.documents}
    />,
    <ReviewPage
      key="review"
      formData={formData}
      onNext={handleNextPage}
      onBack={handlePreviousPage}
    />,
    <SubmissionConfirmation key="confirm" formData={formData} onClose={handleClose} />,
  ];

  return (
    <div className="flex">
      {/* Left Side - Timeline */}
      <div className="w-[350px] pr-[53px]">
        <FormTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>

      {/* Right Side - Form Steps & Modal Header */}
      <div className="w-full h-[780px] px-[26px] pt-[50px] pb-[40px] overflow-y-scroll">
        {/* Modal Header with Dynamic Title */}
        <div className="building-modal-header flex justify-between items-center mb-[35px]">
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
            animating ? "opacity-0 transform translate-x-10" : "opacity-100 transform translate-x-0"
          }`}
        >
          {pageComponents[currentPageIndex]}
        </div>
      </div>
    </div>
  );
};

export default BuildingFormFlow;