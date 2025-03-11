// BuildingFormFlow.jsx
import React, { useState, useEffect } from 'react';
import FormTimeline from '../FormTimeline';
import BuildingInfoForm from '../Create Building/BuildingInfoForm';
import DocumentsForm from '../Upload Documents/DocumentsForm';
import SubmissionConfirmation from '../Submit/SubmissionConfirmation';

const BuildingFormFlow = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [formProgress, setFormProgress] = useState({
    createBuilding: 0,
    uploadDocuments: 0,
    submitted: 0,
  });
  
  // Calculate progress based on form data
  useEffect(() => {
    if (currentPageIndex >= 1) {
      setFormProgress(prev => ({...prev, createBuilding: 100}));
    }
    
    if (currentPageIndex >= 2) {
      setFormProgress(prev => ({...prev, uploadDocuments: 100}));
    }
    
    // If we're still on page 0, calculate partial progress
    if (currentPageIndex === 0 && formData.buildingNo) {
      const requiredFields = ['buildingNo', 'plotNo', 'buildingName', 'address'];
      const filledRequired = requiredFields.filter(field => formData[field]?.trim()).length;
      const createBuildingProgress = Math.min(100, (filledRequired / requiredFields.length) * 100);
      
      setFormProgress(prev => ({...prev, createBuilding: createBuildingProgress}));
    }
  }, [currentPageIndex, formData]);
  
  const handleNextPage = (pageData) => {
    // Save the current page data
    setFormData({
      ...formData,
      ...pageData
    });
    
    // Move to the next page if possible
    setCurrentPageIndex(prev => prev + 1);
  };
  
  // Components for each step
  const pageComponents = [
    <BuildingInfoForm key="info" onNext={handleNextPage} />,
    <DocumentsForm key="docs" onNext={handleNextPage} />,
    <SubmissionConfirmation key="confirm" formData={formData} />
  ];
  
  return (
    <div className="flex p-6">
      {/* Timeline Component */}
      <FormTimeline 
        currentStep={currentPageIndex + 1}
        progress={formProgress}
      />
      
      {/* Current Form Page */}
      {pageComponents[currentPageIndex]}
    </div>
  );
};

export default BuildingFormFlow;