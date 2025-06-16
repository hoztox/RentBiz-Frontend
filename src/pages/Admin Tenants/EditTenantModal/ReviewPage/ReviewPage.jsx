import axios from "axios";
import "./reviewpage.css";
import DocumentView from "./DocumentView";
import { BASE_URL } from "../../../../utils/config";
import { Component, useState, useEffect } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          Error in DocumentView: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

const ReviewPage = ({ formData, onBack, onNext, tenantId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idTypes, setIdTypes] = useState([]);
  const [docTypes, setDocTypes] = useState([]);

  const tenant = formData?.tenant || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
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

  // Fetch ID types and doc types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found.");
        }

        const idTypeResponse = await axios.get(
          `${BASE_URL}/company/id_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIdTypes(Array.isArray(idTypeResponse.data) ? idTypeResponse.data : []);

        const docTypeResponse = await axios.get(
          `${BASE_URL}/company/doc_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDocTypes(Array.isArray(docTypeResponse.data) ? docTypeResponse.data : []);
      } catch (error) {
        console.error("Error fetching types:", error);
        setError("Failed to load types.");
      }
    };
    fetchData();
  }, []);

  const getIdTypeTitle = (idTypeId) => {
    if (!idTypeId) return "N/A";
    const idType = idTypes.find((type) => type.id === parseInt(idTypeId));
    return idType ? idType.title : "N/A";
  };

  const convertToBlob = async (fileData) => {
    if (!fileData) return null;
    if (fileData instanceof File || fileData instanceof Blob) {
      return fileData;
    }
    if (typeof fileData === "string") {
      return fileData; // Send URL as existing_file_url
    }
    return null;
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    // Validate tenant required fields
    const requiredFields = [
      "tenant_name",
      "nationality",
      "phone",
      "email",
      "address",
      "status",
      "tenant_type",
      "id_type",
      "id_number",
      "id_validity_date",
      "sponser_name",
      "sponser_id_type",
      "sponser_id_number",
      "sponser_id_validity_date",
    ];
    if (tenant.tenant_type === "Organization" && !tenant.license_no) {
      requiredFields.push("license_no");
    }
    const missingFields = requiredFields.filter((field) => !tenant[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Validate documents
    const invalidDocs = documents.filter((doc) => {
      if (!doc.doc_type) return true;
      const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
      if (!docType) return true;
      return (
        (docType.number && !doc.number) ||
        (docType.issue_date && !doc.issued_date) ||
        (docType.expiry_date && !doc.expiry_date) ||
        (docType.upload_file && !doc.upload_file)
      );
    });

    if (documents.length > 0 && invalidDocs.length > 0) {
      setError("Some documents are missing required fields based on their document type.");
      setLoading(false);
      return;
    }

    try {
      const formDataWithFiles = new FormData();
      // Add tenant fields
      Object.entries(tenant).forEach(([key, value]) => {
        if (key === "user") {
          const userId = value && typeof value === "object" ? value.id : value;
          formDataWithFiles.append(key, userId ?? "");
        } else {
          formDataWithFiles.append(key, value ?? "");
        }
      });

      // Add company ID
      const companyId = getUserCompanyId();
      if (companyId) {
        formDataWithFiles.append("company", companyId);
      } else {
        setError("Company ID is required.");
        setLoading(false);
        return;
      }

      // Add documents data
      console.log("Documents to send:", documents);
      await Promise.all(
        documents.map(async (doc, index) => {
          const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
          if (docType) {
            formDataWithFiles.append(`tenant_comp[${index}][id]`, doc.id || "");
            formDataWithFiles.append(`tenant_comp[${index}][doc_type]`, doc.doc_type || "");
            if (docType.number) {
              formDataWithFiles.append(`tenant_comp[${index}][number]`, doc.number || "");
            }
            if (docType.issue_date) {
              formDataWithFiles.append(`tenant_comp[${index}][issued_date]`, doc.issued_date || "");
            }
            if (docType.expiry_date) {
              formDataWithFiles.append(`tenant_comp[${index}][expiry_date]`, doc.expiry_date || "");
            }
         if (docType.upload_file) {
  if (doc.upload_file) {
    const fileData = await convertToBlob(doc.upload_file);
    if (fileData) {
      if (typeof fileData === "string") {
        // ✅ Ensure consistent /media/ path, strip any double media
        let cleaned = fileData.replace(/^\/?media\/?/, "");
        formDataWithFiles.append(
          `tenant_comp[${index}][existing_file_url]`,
          `/media/${cleaned}`
        );
      } else {
        // Normal file upload
        formDataWithFiles.append(
          `tenant_comp[${index}][upload_file]`,
          fileData,
          fileData.name || `file-${index}`
        );
      }
    }
  } else {
    // If no file, send empty to avoid double media
    formDataWithFiles.append(`tenant_comp[${index}][existing_file_url]`, "");
  }
}

          }
        })
      );

      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await axios.put(
        `${BASE_URL}/company/tenant/${tenantId}/`,
        formDataWithFiles,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully updated tenant:", response.data);
      onNext({ formData, response: response.data });
    } catch (err) {
      console.error("Error updating tenant:", err);
      let errorMessage = "Failed to update tenant.";
      if (err.response?.data) {
        if (typeof err.response.data === "object") {
          errorMessage = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("; ");
        } else {
          errorMessage = err.response.data.message || err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      documents: documents.map((doc) => ({
        id: doc.id || null,
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || null,
      })),
    };
    console.log("ReviewPage passing back:", backData);
    onBack(backData);
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>
      )}
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
              <p className="review-page-label">Alternative Mobile Number *</p>
              <p className="review-page-data">{tenant.alternative_phone || "N/A"}</p>
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
              <p className="review-page-data">{getIdTypeTitle(tenant.id_type)}</p>
            </div>
            <div>
              <p className="review-page-label">ID Validity</p>
              <p className="review-page-data">{tenant.id_validity_date || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Sponsor ID Type *</p>
              <p className="review-page-data">{getIdTypeTitle(tenant.sponser_id_type)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
        <ErrorBoundary>
          <DocumentView documents={documents} docTypes={docTypes} />
        </ErrorBoundary>
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
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;