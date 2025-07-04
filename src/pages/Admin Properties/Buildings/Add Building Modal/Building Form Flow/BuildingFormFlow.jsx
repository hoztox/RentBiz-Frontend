import React, { useState, useEffect, useRef } from "react";
import closeicon from "../../../../../assets/Images/Admin Buildings/close-icon.svg";
import FormTimeline from "../FormTimeline";
import BuildingInfoForm from "../Create Building/BuildingInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import "./buildingformflow.css";
import { useModal } from "../../../../../context/ModalContext";
import { X } from "lucide-react";

const BuildingFormFlow = ({ onClose, onPageChange, initialPageIndex = 0 }) => {
  const { triggerRefresh } = useModal();
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
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
  const isExternalNavigation = useRef(false);

  const pageTitles = ["Create New Building", "Upload Documents", "Review", ""];

  const currentTitle = pageTitles[currentPageIndex];

  useEffect(() => {
    if (
      initialPageIndex !== currentPageIndex &&
      !isExternalNavigation.current
    ) {
      isExternalNavigation.current = true;
      setCurrentPageIndex(initialPageIndex);
      setTimeout(() => {
        isExternalNavigation.current = false;
      }, 0);
    }
  }, [initialPageIndex]);

  useEffect(() => {
    if (onPageChange && !isExternalNavigation.current) {
      onPageChange(currentPageIndex);
    }
  }, [currentPageIndex, onPageChange]);

  useEffect(() => {
    const newProgress = {
      createBuilding: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    };

    if (currentPageIndex >= 1) newProgress.createBuilding = 100;
    if (currentPageIndex >= 2) newProgress.uploadDocuments = 100;
    if (currentPageIndex >= 3) {
      newProgress.review = 100;
      newProgress.submitted = 100;
    }

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
    if (currentPageIndex === 3) {
      triggerRefresh(); // Trigger refresh after submission
    }
    setCurrentPageIndex(0);
    setFormData({ building: null, documents: null });
    setFormProgress({
      createBuilding: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    });
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
    <SubmissionConfirmation
      key="confirm"
      formData={formData}
      onClose={handleClose}
    />,
  ];

  return (
    <div className="flex">
      <div className="w-[350px] pr-[53px] form-time-line">
        <FormTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>
      <div className="w-full h-[700px] desktop:h-[780px] px-[20px] sm:px-[26px] pt-[8px] sm:pt-[50px] pb-[285px] sm:pb-[40px] overflow-y-scroll">
        <div className="building-modal-header flex justify-between items-center mb-[35px]">
          <h3 className="building-modal-title">{currentTitle}</h3>
          <button
            onClick={handleClose}
            className="border border-[#E9E9E9] rounded-full p-[11px] hover:bg-gray-100 duration-200"
          >
            {/* <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" /> */}
            <X size={20} />
          </button>
        </div>
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

export default BuildingFormFlow;
