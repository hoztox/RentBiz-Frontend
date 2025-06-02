import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import closeicon from "../../../../assets/Images/Admin Tenants/close-icon.svg";
import FormTimeline from "../FormTimeline";
import TenantInfoForm from "../UpdateTenant/TenantInfoForm";
import DocumentsForm from "../UploadDocuments/DocumentsForm";
import ReviewPage from "../ReviewPage/ReviewPage";
import SubmissionConfirmation from "../Submit/SubmissionConfirmation";
import { BASE_URL } from "../../../../utils/config";

const TenantFormFlow = ({ onClose, tenantId, onTenantUpdated, onPageChange, initialPageIndex = 0 }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [formData, setFormData] = useState({
    tenant: null,
    documents: { documents: [] },
  });
  const [formProgress, setFormProgress] = useState({
    tenantDetails: 0,
    uploadDocuments: 0,
    review: 0,
    submitted: 0,
  });
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use ref to track external navigation
  const isExternalNavigation = useRef(false);

  const pageTitles = ["Update Tenant", "Upload Documents", "Review", ""];
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
    const fetchTenantData = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${BASE_URL}/company/tenant/${tenantId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const tenantData = response.data;
        setFormData({
          tenant: {
            tenant_name: tenantData.tenant_name || "",
            nationality: tenantData.nationality || "",
            phone: tenantData.phone || "",
            alternative_phone: tenantData.alternative_phone || "",
            email: tenantData.email || "",
            description: tenantData.description || "",
            address: tenantData.address || "",
            tenant_type: tenantData.tenant_type || "",
            license_no: tenantData.license_no || "",
            id_type: tenantData.id_type || "",
            id_number: tenantData.id_number || "",
            id_validity_date: tenantData.id_validity_date || "",
            sponser_name: tenantData.sponser_name || "",
            sponser_id_type: tenantData.sponser_id_type || "",
            sponser_id_number: tenantData.sponser_id_number || "",
            sponser_id_validity_date: tenantData.sponser_id_validity_date || "",
            status: tenantData.status || "Active",
            remarks: tenantData.remarks || "",
            company: tenantData.company || localStorage.getItem("company_id") || "",
            user: tenantData.user || localStorage.getItem("user_id") || null,
          },
          documents: {
            documents: Array.isArray(tenantData.tenant_comp)
              ? tenantData.tenant_comp.map((doc, index) => ({
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
        console.error("Error fetching tenant data:", error);
        setError("Failed to load tenant data.");
        setLoading(false);
      }
    };
    fetchTenantData();
  }, [tenantId]);

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
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [currentPageIndex === 0 ? "tenant" : "documents"]: pageData,
      };
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
      setFormData((prevData) => ({
        ...prevData,
        documents: { documents: pageData.documents || [] },
      }));
    }
    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
      setAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    if (currentPageIndex === 3) {
      onTenantUpdated();
    }
    setCurrentPageIndex(0);
    setFormData({ tenant: null, documents: { documents: [] } });
    setFormProgress({
      tenantDetails: 0,
      uploadDocuments: 0,
      review: 0,
      submitted: 0,
    });
    setAnimating(false);
    onClose();
  };

  if (loading) {
    return <div className="p-4">Loading tenant data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

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
        <div className="tenant-modal-header flex justify-between items-center mb-[41px]">
          <h3 className="tenant-modal-title">{currentTitle}</h3>
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
            <TenantInfoForm
              key="info"
              onNext={handleNextPage}
              initialData={formData.tenant}
              tenantId={tenantId}
            />,
            <DocumentsForm
              key="docs"
              onNext={handleNextPage}
              onBack={handlePreviousPage}
              initialData={formData.documents}
              tenantId={tenantId}
            />,
            <ReviewPage
              key="review"
              formData={formData}
              onNext={handleNextPage}
              onBack={handlePreviousPage}
              tenantId={tenantId}
            />,
            <SubmissionConfirmation key="confirm" formData={formData} onClose={handleClose} />,
          ][currentPageIndex]}
        </div>
      </div>
    </div>
  );
};

export default TenantFormFlow;