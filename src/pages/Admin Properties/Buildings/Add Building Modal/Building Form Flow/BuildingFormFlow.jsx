import React, { useState, useEffect } from 'react';
import closeicon from "../../../../../assets/Images/Admin Buildings/close-icon.svg";
import FormTimeline from '../FormTimeline';
import BuildingInfoForm from '../Create Building/BuildingInfoForm';
import DocumentsForm from '../Upload Documents/DocumentsForm';
import SubmissionConfirmation from '../Submit/SubmissionConfirmation';

const BuildingFormFlow = ({ title, onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [formProgress, setFormProgress] = useState({
    createBuilding: 0,
    uploadDocuments: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const newProgress = { createBuilding: 0, uploadDocuments: 0, submitted: 0 };

    if (currentPageIndex >= 1) newProgress.createBuilding = 100;
    if (currentPageIndex >= 2) newProgress.uploadDocuments = 100;
    
    if (currentPageIndex === 0 && formData.buildingNo) {
      const requiredFields = ['buildingNo', 'plotNo', 'buildingName', 'address'];
      const filledFields = requiredFields.filter(field => formData[field]?.trim()).length;
      newProgress.createBuilding = Math.min(100, (filledFields / requiredFields.length) * 100);
    }

    setFormProgress(newProgress);
  }, [currentPageIndex, formData]);

  const handleNextPage = (pageData) => {
    // Start animation
    setAnimating(true);
    
    // Update form data immediately
    setFormData(prevData => ({ ...prevData, ...pageData }));
    
    // Delay the page change to allow for animation
    setTimeout(() => {
      setCurrentPageIndex(prev => prev + 1);
      setAnimating(false);
    }, 500); // Match this with your CSS transition duration
  };

  const handleClose = () => {
    setCurrentPageIndex(0);
    setFormData({});
    setFormProgress({ createBuilding: 0, uploadDocuments: 0, submitted: 0 });
    onClose(); // Call parent-provided close handler
  };

  const pageComponents = [
    <BuildingInfoForm key="info" onNext={handleNextPage} />,
    <DocumentsForm key="docs" onNext={handleNextPage} />,
    <SubmissionConfirmation key="confirm" formData={formData} />
  ];

  return (
    <div className="flex">
      {/* Left Side - Timeline */}
      <div className="w-[350px] pr-[53px]">
        <FormTimeline key={currentPageIndex} currentStep={currentPageIndex + 1} progress={formProgress} />
      </div>

      {/* Right Side - Form Steps & Modal Header */}
      <div className="w-[1010px] px-[53px] pt-[50px] pb-[40px]">
        {/* Modal Header */}
        <div className="building-modal-header flex justify-between items-center mb-[41px]">
          {title && <h3 className="building-modal-title">{title}</h3>}
          <button onClick={handleClose} className="border border-[#E9E9E9] rounded-full p-[11px]">
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Current Form Page with Animation */}
        <div className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0 transform translate-x-10" : "opacity-100 transform translate-x-0"}`}>
          {pageComponents[currentPageIndex]}
        </div>
      </div>
    </div>
  );
};

export default BuildingFormFlow;