import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";
import DocumentsView from "./DocumentView";
import "./ReviewPage.css";
import toast, { Toaster } from "react-hot-toast";

const ReviewPage = ({ formData, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [idTypes, setIdTypes] = useState([]);

  const tenant = formData?.tenant || {};
  const documents = Array.isArray(formData?.documents?.tenant_comp)
    ? formData.documents.tenant_comp
    : [];

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");

    console.log("Role:", role);
    console.log("Raw company_id from localStorage:", storedCompanyId);

    if (role === "company" || role === "user" || role === "admin") {
      return storedCompanyId;
    }

    return null;
  };

  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found.");
        }
        const response = await axios.get(
          `${BASE_URL}/company/id_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIdTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching ID types:", error);
        toast.error("Failed to load ID types.");
        setIdTypes([]);
      }
    };

    fetchIdTypes();
  }, []);

  const getIdTypeTitle = (idTypeId) => {
    if (!idTypeId) return "N/A";
    const idType = idTypes.find((type) => type.id === parseInt(idTypeId));
    return idType ? idType.title : `ID: ${idTypeId}`;
  };

  const handleNext = async () => {
    setLoading(true);

    const requiredFields = [
      "tenant_name",
      "nationality",
      "phone",
      "email",
      "address",
      "tenant_type",
      "id_type",
      "id_number",
      "id_validity_date",
      "sponser_name",
      "sponser_id_type",
      "sponser_id_number",
      "sponser_id_validity_date",
      "status",
    ];
    const missingFields = requiredFields.filter((field) => !tenant[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const getValueOrEmpty = (value) => {
        return value === null || value === undefined ? "" : value;
      };
      const formDataWithFiles = new FormData();
      formDataWithFiles.append("company", tenant.company);
      formDataWithFiles.append("user", getValueOrEmpty(tenant.user));
      formDataWithFiles.append("tenant_name", tenant.tenant_name);
      formDataWithFiles.append("nationality", tenant.nationality);
      formDataWithFiles.append("phone", tenant.phone);
      formDataWithFiles.append(
        "alternative_phone",
        getValueOrEmpty(tenant.alternative_phone)
      );
      formDataWithFiles.append("email", tenant.email);
      formDataWithFiles.append(
        "description",
        getValueOrEmpty(tenant.description)
      );
      formDataWithFiles.append("address", tenant.address);
      formDataWithFiles.append("tenant_type", tenant.tenant_type);
      formDataWithFiles.append("license_no", getValueOrEmpty(tenant.license_no));
      formDataWithFiles.append("id_type", tenant.id_type);
      formDataWithFiles.append("id_number", tenant.id_number);
      formDataWithFiles.append("id_validity_date", tenant.id_validity_date);
      formDataWithFiles.append("sponser_name", tenant.sponser_name);
      formDataWithFiles.append("sponser_id_type", tenant.sponser_id_type);
      formDataWithFiles.append("sponser_id_number", tenant.sponser_id_number);
      formDataWithFiles.append(
        "sponser_id_validity_date",
        tenant.sponser_id_validity_date
      );
      formDataWithFiles.append("status", tenant.status);
      formDataWithFiles.append("remarks", getValueOrEmpty(tenant.remarks));

      if (documents.length > 0) {
        const documentData = documents.map((doc, index) => ({
          doc_type: doc.doc_type,
          number: doc.number,
          issued_date: doc.issued_date,
          expiry_date: doc.expiry_date,
          file_index: index,
        }));
        formDataWithFiles.append(
          "document_comp_json",
          JSON.stringify(documentData)
        );
        documents.forEach((doc, index) => {
          if (doc.upload_file && doc.upload_file[0]) {
            formDataWithFiles.append(
              `document_file_${index}`,
              doc.upload_file[0]
            );
          }
        });
      }

      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? `File: ${value.name}` : value
        );
      }

      const response = await axios.post(
        `${BASE_URL}/company/tenant/create/`,
        formDataWithFiles,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully created tenant:", response.data);
      onNext({ formData, response: response.data });
    } catch (err) {
      console.error("Error creating tenant:", err);
      const errorMessage =
        err.response?.data?.email?.[0] ||
        err.response?.data?.message ||
        err.message ||
        "Failed to save tenant.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      ...formData,
      documents: { tenant_comp: documents },
    };
    console.log("ReviewPage passing back:", backData);
    onBack(backData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Tenant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-8 border-r border-[#E9E9E9] max-[480px]:border-r-0">
            <div>
              <p className="review-page-label">Tenant Name *</p>
              <p className="review-page-data">{tenant.tenant_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Mobile Number *</p>
              <p className="review-page-data">{tenant.phone || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Email *</p>
              <p className="review-page-data">{tenant.email || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Address *</p>
              <p className="review-page-data">{tenant.address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Trade License Number *</p>
              <p className="review-page-data">{tenant.license_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">ID Number *</p>
              <p className="review-page-data">{tenant.id_number || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Sponsor Name *</p>
              <p className="review-page-data">{tenant.sponser_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Sponsor ID Number *</p>
              <p className="review-page-data">
                {tenant.sponser_id_number || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Status *</p>
              <p className="review-page-data">{tenant.status || "N/A"}</p>
            </div>
          </div>
          <div className="space-y-8 sm:ml-5 max-[480px]:mt-8">
            <div>
              <p className="review-page-label">Nationality *</p>
              <p className="review-page-data">{tenant.nationality || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Alternative Mobile Number</p>
              <p className="review-page-data">
                {tenant.alternative_phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{tenant.description || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Tenant Type</p>
              <p className="review-page-data">{tenant.tenant_type || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">ID Type</p>
              <p className="review-page-data">
                {getIdTypeTitle(tenant.id_type)}
              </p>
            </div>
            <div>
              <p className="review-page-label">ID Validity</p>
              <p className="review-page-data">
                {tenant.id_validity_date || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Sponsor ID Type *</p>
              <p className="review-page-data">
                {getIdTypeTitle(tenant.sponser_id_type)}
              </p>
            </div>
            <div>
              <p className="review-page-label">Sponsor ID Validity *</p>
              <p className="review-page-data">
                {tenant.sponser_id_validity_date || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{tenant.remarks || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5">
        <DocumentsView documents={documents} docTypes={documents} />
      </div>

      <div className="flex justify-end gap-4 pt-5 mt-auto">
        <button
          type="button"
          className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;