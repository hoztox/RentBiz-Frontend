import React, { useState } from 'react';
import './createtenantmodal.css';
import buildingimg from "../../../assets/Images/Admin Buildings/building-top.svg";
import TenantFormFlow from './TenantFormFlow/TenantFormFlow';
import { ChevronDown } from 'lucide-react';
import { useModal } from "../../../context/ModalContext";



const CreateTenantModal = ({ open, onClose }) => {
  const { modalState, updateModal } = useModal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Define steps with their titles and page indices
  const steps = [
    { id: 1, title: "Tenant Details", pageIndex: 0 },
    { id: 2, title: "Upload Documents", pageIndex: 1 },
    { id: 3, title: "Review", pageIndex: 2 },
    { id: 4, title: "Submission", pageIndex: 3 },
  ];

  // Get the current step title based on currentStep
  const getCurrentStepTitle = () => {
    return steps.find(step => step.id === currentStep)?.title || "Tenant Details";
  };

  // Toggle dropdown visibility
  const handleToggle = () => setIsExpanded(prev => !prev);

  // Handle step selection from dropdown
  const handleStepSelect = (stepId) => {
    setCurrentStep(stepId);
    setIsExpanded(false);
    const newStep = steps.find(step => step.id === stepId);
    if (newStep) {
      updateModal({ title: newStep.title }); // Update modal title
    }
  };

  // Handle page changes from TenantFormFlow
  const handlePageChange = (pageIndex) => {
    const newStep = steps.find(step => step.pageIndex === pageIndex);
    if (newStep && newStep.id !== currentStep) {
      setCurrentStep(newStep.id);
      updateModal({ title: newStep.title }); // Update modal title
    }
  };

  // Ensure modal only renders for correct type
  if (!open || modalState.type !== "create-tenant") {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors z-50 add-building-modal max-[480px]:items-start
        ${open ? "visible bg-black/70 max-[480px]:bg-transparent" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col max-[480px]:relative tenant-modal-styles transition-all top-[40px]
          ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}"
      >
        {/* Mobile Image */}
        <div className='min-[480px]:hidden w-full h-[117px] bg-[#1458A2] flex justify-center relative top-[-42px]'>
          <img src={buildingimg} alt="Building Top" className='top-[40px] absolute w-[210px]' />
        </div>

        {/* Mobile Header Bar with Dropdown */}
        <div className="min-[480px]:hidden relative">
          <div
            className="bg-white w-full h-[54px] mx-[16px] rounded-md absolute max-w-[calc(100vw-32px)] top-[-78px] p-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between cursor-pointer z-10"
            onClick={handleToggle}
          >
            <div className="flex items-center space-x-5">
              <div className="w-[30px] h-[30px] rounded-full bg-[#1458A210] flex items-center justify-center text-[#0a5ebf] toggle-count">
                {currentStep}
              </div>
              <span className="text-[#1458A2] mob-toggle-head text-[16px]">
                {getCurrentStepTitle()}
              </span>
            </div>

            {/* Chevron with smooth rotation */}
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 text-[#1458A2] ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isExpanded && (
            <div className="bg-white w-full mx-[16px] rounded-md absolute max-w-[calc(100vw-32px)] top-[-20px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] z-20 overflow-hidden">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-5 p-3 cursor-pointer transition-colors duration-200 ${
                    currentStep === step.id ? 'bg-[#1458A210]' : 'hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStepSelect(step.id);
                  }}
                >
                  <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center toggle-count ${
                    currentStep === step.id ? 'bg-[#1458A2] text-white' : 'bg-[#1458A210] text-[#0a5ebf]'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`mob-toggle-head text-[16px] ${
                    currentStep === step.id ? 'text-[#1458A2] font-medium' : 'text-[#1458A2]'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <TenantFormFlow
          onClose={onClose}
          onPageChange={handlePageChange}
          initialPageIndex={steps.find(step => step.id === currentStep)?.pageIndex || 0}
        />
      </div>
    </div>
  );
};

export default CreateTenantModal;