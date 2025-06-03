import React, { useState, useEffect, useRef } from "react";
import closeicon from "../../../../../assets/Images/Admin Units/close-icon.svg";
import FormTimeline from "../FormTimeline";
import BuildingInfoForm from "../Select Building/BuildingInfoForm";
import UnitInfoForm from "../Update Unit/UnitInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import ReviewPage from "../ReviewPage/ReviewPage";
import { useModal } from "../../../../../context/ModalContext";

const UnitFormFlow = ({ onClose, unitId, onPageChange, initialPageIndex = 0 }) => {
  const { triggerRefresh } = useModal();
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [formData, setFormData] = useState({
    building: null,
    unit: null,
    documents: null,
  });
  const [formProgress, setFormProgress] = useState({
    selectBuilding: 0,
    createUnit: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use ref to track external navigation
  const isExternalNavigation = useRef(false);

  const pageTitles = [
    "Select Building",
    "Update Unit",
    "Upload Documents",
    "Review",
    "",
  ];

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

  // Fetch unit data on component mount
  useEffect(() => {
    const fetchUnitData = async () => {
      if (!unitId) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/company/units/${unitId}/`
        );
        const unitData = response.data;
        setFormData({
          building: {
            buildingId: unitData.building || "",
            building_name: unitData.building_name || "",
            description: unitData.building_description || "",
            building_address: unitData.building_address || "",
            building_no: unitData.building_no || "",
            plot_no: unitData.plot_no || "",
          },
          unit: {
            unit_name: unitData.unit_name || "",
            unit_type: unitData.unit_type || "",
            address: unitData.address || "",
            description: unitData.description || "",
            remarks: unitData.remarks || "",
            no_of_bedrooms: unitData.no_of_bedrooms || "",
            no_of_bathrooms: unitData.no_of_bathrooms || "",
            premise_no: unitData.premise_no || "",
            unit_status: unitData.unit_status || "active",
            company: unitData.company || null,
            user: unitData.user || null,
          },
          documents: {
            documents:
              unitData.unit_comp?.map((doc, index) => ({
                id: index + 1,
                doc_type: doc.doc_type || "",
                number: doc.number || "",
                issued_date: doc.issued_date || "",
                expiry_date: doc.expiry_date || "",
                upload_file: doc.upload_file ? [doc.upload_file] : [],
              })) || [],
          },
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching unit data:", error);
        setError("Failed to load unit data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUnitData();
  }, [unitId]);

  // Update form progress
  useEffect(() => {
    const newProgress = {
      selectBuilding: 0,
      createUnit: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    };

    if (currentPageIndex >= 1) newProgress.selectBuilding = 100;
    if (currentPageIndex >= 2) newProgress.createUnit = 100;
    if (currentPageIndex >= 3) newProgress.uploadDocuments = 100;
    if (currentPageIndex >= 4) newProgress.review = 100;

    if (currentPageIndex === 0 && formData.building) {
      const requiredFields = ["buildingId"];
      const filledFields = requiredFields.filter(
        (field) => formData.building[field]
      ).length;
      newProgress.selectBuilding = Math.min(
        100,
        (filledFields / requiredFields.length) * 100
      );
    }

    if (currentPageIndex === 1 && formData.unit) {
      const requiredFields = [
        "unit_name",
        "unit_type",
        "address",
        "premise_no",
        "unit_status",
      ];
      const filledFields = requiredFields.filter(
        (field) => formData.unit[field]
      ).length;
      newProgress.createUnit = Math.min(
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
      [currentPageIndex === 0
        ? "building"
        : currentPageIndex === 1
          ? "unit"
          : "documents"]: pageData,
    }));

    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setAnimating(false);
    }, 500);
  };

  const handlePreviousPage = (pageData) => {
    setAnimating(true);
    if (pageData) {
      setFormData((prevData) => {
        // If navigating back from ReviewPage (index 3), merge the full pageData
        if (currentPageIndex === 3) {
          return {
            ...prevData,
            building: pageData.building || prevData.building,
            unit: pageData.unit || prevData.unit,
            documents: pageData.documents || prevData.documents,
          };
        }
        // For other pages, update only the relevant section
        return {
          ...prevData,
          [currentPageIndex === 2 ? "documents" : "unit"]: pageData,
        };
      });
    }
    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
      setAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    if (currentPageIndex === 4) {
      // Only trigger refresh if closing from SubmissionConfirmation
      triggerRefresh();
    }
    setCurrentPageIndex(0);
    setFormData({ building: null, unit: null, documents: null });
    setFormProgress({
      selectBuilding: 0,
      createUnit: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    });
    onClose();
  };

  const pageComponents = [
    <BuildingInfoForm
      key="building"
      onNext={handleNextPage}
      initialData={formData.building}
      unitId={unitId}
    />,
    <UnitInfoForm
      key="info"
      onNext={handleNextPage}
      onBack={handlePreviousPage}
      initialData={formData.unit}
      unitId={unitId}
    />,
    <DocumentsForm
      key="docs"
      onNext={handleNextPage}
      onBack={handlePreviousPage}
      initialData={formData.documents}
      unitId={unitId}
    />,
    <ReviewPage
      key="review"
      formData={formData}
      onNext={handleNextPage}
      onBack={handlePreviousPage}
      unitId={unitId}
    />,
    <SubmissionConfirmation
      key="confirm"
      formData={formData}
      onClose={handleClose}
    />,
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
        <div className="building-modal-header flex justify-between items-center mb-[41px]">
          <h3 className="building-modal-title">{currentTitle}</h3>
          <button
            onClick={handleClose}
            className="border border-[#E9E9E9] rounded-full p-[11px]"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${animating
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