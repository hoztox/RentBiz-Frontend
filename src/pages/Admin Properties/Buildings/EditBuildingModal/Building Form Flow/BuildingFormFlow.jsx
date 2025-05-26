import React, { useState, useEffect } from "react";
import axios from "axios";
import closeicon from "../../../../../assets/Images/Admin Buildings/close-icon.svg";
import FormTimeline from "../FormTimeline";
import BuildingInfoForm from "../UpdateBuilding/BuildingInfoForm";
import DocumentsForm from "../Upload Documents/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import { BASE_URL } from "../../../../../utils/config";

const BuildingFormFlow = ({ onClose, buildingId }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({
    building: null,
    documents: null,
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
      if (!buildingId) {
        setError("Invalid or missing building ID.");
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/company/buildings/${buildingId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const buildingData = response.data;
        console.log("Fetched building data:", buildingData);

        setFormData({
          building: {
            building_no: buildingData.building_no || "",
            plot_no: buildingData.plot_no || "",
            building_name: buildingData.building_name || "",
            building_address: buildingData.building_address || "",
            description: buildingData.description || "",
            remarks: buildingData.remarks || "",
            status: buildingData.status || "active",
            latitude: buildingData.latitude || "",
            longitude: buildingData.longitude || "",
            land_mark: buildingData.land_mark || "",
            company: buildingData.company || localStorage.getItem("company_id"),
            user: buildingData.user || localStorage.getItem("user_id") || null,
          },
          documents: {
            documents: buildingData.build_comp?.map((doc, index) => ({
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
      } catch (err) {
        const errorMessage =
          err.response?.status === 404
            ? "Building not found."
            : err.response?.data?.message ||
              "Failed to load building data. Please try again.";
        setError(errorMessage);
        console.error("Error fetching building data:", err);
      } finally {
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
      newProgress.updateBuilding = Math.min(
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
    return (
      <div className="text-center p-5">
        <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        Loading building data...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex">
      <div className="w-[350px] pr-[53px]">
        <FormTimeline
          key={currentPageIndex}
          currentStep={currentPageIndex + 1}
          progress={formProgress}
        />
      </div>
      <div className="w-full h-[780px] px-[33px] pt-[50px] pb-[40px] overflow-y-scroll">
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
          {[
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
              onClose={handleClose}
            />,
          ][currentPageIndex]}
        </div>
      </div>
    </div>
  );
};

export default BuildingFormFlow;