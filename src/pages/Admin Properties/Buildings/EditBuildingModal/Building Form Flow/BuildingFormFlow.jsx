import React, { useState, useEffect } from "react";
import axios from "axios";
import closeicon from "../../../../../assets/Images/Admin Buildings/close-icon.svg";
import FormTimeline from "../FormTimeline";
import BuildingInfoForm from "../UpdateBuilding/BuildingInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import { BASE_URL } from "../../../../../utils/config";

const BuildingFormFlow = ({ onClose, buildingId, onBuildingCreated }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({
    building: null,
    documents: { documents: [] },
  });
  const [formProgress, setFormProgress] = useState({
    updateBuilding: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageTitles = ["Update Building", "Upload Documents", "Review", ""];
  const currentTitle = pageTitles[currentPageIndex];

  useEffect(() => {
    const fetchBuildingData = async () => {
      if (!buildingId) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/company/buildings/${buildingId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const buildingData = response.data;
        console.log("BuildingFormFlow: Fetched building data:", buildingData);
        setFormData({
          building: {
            building_no: buildingData.building_no || "",
            plot_no: buildingData.plot_no || "",
            building_name: buildingData.building_name || "",
            building_address: buildingData.building_address || "",
            company: buildingData.company || "",
            status: buildingData.status || "",
            description: buildingData.description || "",
            latitude: buildingData.latitude || "",
            longitude: buildingData.longitude || "",
            remarks: buildingData.remarks || "",
            land_mark: buildingData.land_mark || "",
          },
          documents: {
            documents: Array.isArray(buildingData.build_comp)
              ? buildingData.build_comp.map((doc, index) => ({
                  id: index + 1,
                  doc_type: doc.doc_type || "",
                  number: doc.number || "",
                  issued_date: doc.issued_date || "",
                  expiry_date: doc.expiry_date || "",
                  upload_file: doc.upload_file ? [doc.upload_file] : [],
                }))
              : [],
          },
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching building data:", error);
        setError("Failed to load building data.");
        setLoading(false);
      }
    };
    fetchBuildingData();
  }, [buildingId]);

  useEffect(() => {
    const newProgress = {
      updateBuilding: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    };

    if (currentPageIndex >= 1) newProgress.updateBuilding = 100;
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
      newProgress.updateBuilding = Math.min(
        100,
        (filledFields / requiredFields.length) * 100
      );
    }

    setFormProgress(newProgress);
  }, [currentPageIndex, formData]);

  const handleNextPage = (pageData) => {
    console.log("BuildingFormFlow: Received pageData:", pageData);
    setAnimating(true);
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [currentPageIndex === 0 ? "building" : "documents"]: pageData,
      };
      console.log("BuildingFormFlow: Updated formData:", newData);
      return newData;
    });

    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setAnimating(false);
    }, 500);
  };

  const handlePreviousPage = (pageData) => {
    setAnimating(true);
    if (pageData) {
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          documents: { documents: pageData.documents || [] },
        };
        console.log("BuildingFormFlow: Updated formData on back:", newData);
        return newData;
      });
    }
    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
      setAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    if (currentPageIndex === 3) {
      // Trigger refresh only when closing from SubmissionConfirmation
      onBuildingCreated();
    }
    setCurrentPageIndex(0);
    setFormData({ building: null, documents: { documents: [] } });
    setFormProgress({
      updateBuilding: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    });
    setAnimating(false);
    onClose();
  };

  if (loading) {
    return <div className="p-4">Loading building data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  console.log(
    "BuildingFormFlow: Passing initialData to BuildingInfoForm/ReviewPage:",
    formData
  );
  return (
    <div className="flex">
      <div className="w-[350px] pr-[53px]">
        <FormTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>
      <div className="w-full h-[700px] lg:h-[700px] 2xl:h-[780px] px-[26px] pt-[50px] pb-[40px] overflow-y-scroll">
        <div className="building-modal-header flex justify-between items-center mb-[35px]">
          <h3 className="building-modal-title">{currentTitle}</h3>
          <button
            onClick={handleClose}
            className="border border-[#E9E9E9] rounded-full p-[11px]"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${
            animating
              ? "opacity-0 transform translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {
            [
              <BuildingInfoForm
                key="info"
                onNext={handleNextPage}
                initialData={formData.building}
                buildingId={buildingId}
              />,
              <DocumentsForm
                key="docs"
                onNext={handleNextPage}
                onBack={handlePreviousPage}
                initialData={formData.documents}
                buildingId={buildingId}
              />,
              <ReviewPage
                key="review"
                formData={formData}
                onNext={handleNextPage}
                onBack={handlePreviousPage}
                buildingId={buildingId}
              />,
              <SubmissionConfirmation
                key="confirm"
                formData={formData}
              />,
            ][currentPageIndex]
          }
        </div>
      </div>
    </div>
  );
};

export default BuildingFormFlow;