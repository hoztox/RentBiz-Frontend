import React, { useEffect, useState, useRef } from "react";
import closeicon from "../../../../assets/Images/Admin Tenants/close-icon.svg";
import FormTimeline from "../FormTimeline";
import TenantInfoForm from "../CreateTenant/TenantInfoForm";
import DocumentsForm from "../UploadDocuments/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import "./tenantformflow.css";
import { useModal } from "../../../../context/ModalContext";

const TenantFormFlow = ({ onClose, onPageChange, initialPageIndex = 0 }) => {
  const { modalState, triggerRefresh } = useModal();
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [formData, setFormData] = useState({
    tenant: null,
    documents: null,
  });
  const [formProgress, setFormProgress] = useState({
    tenantDetails: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);
  const isExternalNavigation = useRef(false);

  const pageTitles = ["Create New Tenant", "Upload Documents", "Review", ""];
  const currentTitle = pageTitles[currentPageIndex];

  // Handle external page navigation from dropdown
  useEffect(() => {
    if (initialPageIndex !== currentPageIndex && !isExternalNavigation.current) {
      isExternalNavigation.current = true;
      setCurrentPageIndex(initialPageIndex);
      setTimeout(() => {
        isExternalNavigation.current = false;
      }, 0);
    }
  }, [initialPageIndex]);

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange && !isExternalNavigation.current) {
      onPageChange(currentPageIndex);
    }
  }, [currentPageIndex, onPageChange]);

  useEffect(() => {
    const newProgress = {
      tenantDetails: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    };

    if (currentPageIndex >= 1) newProgress.tenantDetails = 100;
    if (currentPageIndex >= 2) newProgress.uploadDocuments = 100;
    if (currentPageIndex >= 3) {
      newProgress.review = 100;
      newProgress.submitted = 100;
    }

    if (currentPageIndex === 0 && formData.tenant) {
      const requiredFields = [
        "tenant_name",
        "nationality",
        "phone",
        "alternative_phone",
        "email",
        "address",
        "tenant_type",
        "license_no",
        "id_type",
        "id_number",
        "id_validity_date",
        "sponser_name",
        "sponser_id_type",
        "sponser_id_number",
        "sponser_id_validity_date",
        "status",
      ];
      const filledFields = requiredFields.filter(
        (field) => formData.tenant[field]
      ).length;
      newProgress.tenantDetails = Math.min(
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
      [currentPageIndex === 0 ? "tenant" : "documents"]: pageData,
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
      triggerRefresh(); // Trigger refresh for parent component
    }
    setCurrentPageIndex(0);
    setFormData({ tenant: null, documents: null });
    setFormProgress({
      tenantDetails: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    });
    setAnimating(false);
    onClose();
  };

  const pageComponents = [
    <TenantInfoForm
      key="info"
      onNext={handleNextPage}
      initialData={formData.tenant}
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
      {/* Left Side - Timeline */}
      <div className="w-[350px] pr-[53px] form-time-line">
        <FormTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>

      {/* Right Side - Form Steps & Modal Header */}
      <div className="w-full h-[700px] desktop:h-[780px] px-[20px] sm:px-[26px] pt-[8px] sm:pt-[50px] pb-[285px] sm:pb-[40px] overflow-y-scroll">
        {/* Modal Header with Dynamic Title */}
        <div className="tenant-modal-header flex justify-between items-center mb-[41px]">
          <h3 className="tenant-modal-title">{currentTitle}</h3>
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

export default TenantFormFlow;