import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import DocumentsView from "./DocumentsView";
import "./reviewpage.css";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          Error in DocumentsView: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

const ReviewPage = ({ formData, onBack, onNext, buildingId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryName, setCountryName] = useState("N/A");
  const [stateName, setStateName] = useState("N/A");
  const [docTypes, setDocTypes] = useState([]);

  const building = formData?.building || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accounts/countries/`);
        setCountries(response.data);
        const country = response.data.find((c) => c.id === parseInt(building.country));
        setCountryName(country ? country.name : "N/A");
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load country data.");
      }
    };
    fetchCountries();
  }, [building.country]);

  // Fetch states when country ID is available
  useEffect(() => {
    if (building.country) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/accounts/countries/${building.country}/states/`
          );
          setStates(response.data);
          const state = response.data.find((s) => s.id === parseInt(building.state));
          setStateName(state ? state.name : "N/A");
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
          setStateName("N/A");
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setStateName("N/A");
    }
  }, [building.country, building.state]);

  // Fetch document types
  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        const companyId = localStorage.getItem("company_id");
        const response = await axios.get(
          `${BASE_URL}/company/doc_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDocTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to load document types.");
      }
    };
    fetchDocTypes();
  }, []);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    // Validate building required fields
    const requiredFields = [
      "building_no",
      "plot_no",
      "building_name",
      "company",
      "status",
    ];
    const missingFields = requiredFields.filter((field) => !building[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Validate documents based on docType properties
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
      const getFileNameFromUrl = (url) => {
        if (!url || typeof url !== "string") return "unknown_file";
        const parts = url.split("/");
        return parts[parts.length - 1] || "unknown_file";
      };

      const convertToBlob = async (fileData) => {
        if (!fileData) {
          console.warn("No file data provided");
          return { blob: null, name: null };
        }
        if (fileData instanceof File || fileData instanceof Blob) {
          return { blob: fileData, name: fileData.name || "unknown_file" };
        }
        if (typeof fileData === "string") {
          return { blob: null, name: getFileNameFromUrl(fileData), url: fileData };
        }
        console.warn("Invalid file data type:", typeof fileData, fileData);
        return { blob: null, name: null };
      };

      const formDataWithFiles = new FormData();
      // Add building fields
      Object.entries(building).forEach(([key, value]) => {
        formDataWithFiles.append(key, value ?? "");
      });

      // Add documents data
      await Promise.all(
        documents.map(async (doc, index) => {
          const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
          if (docType) {
            formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type || "");
            formDataWithFiles.append(`build_comp[${index}][id]`, doc.id || "");
            if (docType.number) {
              formDataWithFiles.append(`build_comp[${index}][number]`, doc.number || "");
            }
            if (docType.issue_date) {
              formDataWithFiles.append(`build_comp[${index}][issued_date]`, doc.issued_date || "");
            }
            if (docType.expiry_date) {
              formDataWithFiles.append(`build_comp[${index}][expiry_date]`, doc.expiry_date || "");
            }
            if (docType.upload_file && doc.upload_file) {
              const file = Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file;
              const { blob, name, url } = await convertToBlob(file);
              if (blob) {
                formDataWithFiles.append(
                  `build_comp[${index}][upload_file]`,
                  blob,
                  name || `file-${index}`
                );
              } else if (url) {
                formDataWithFiles.append(`build_comp[${index}][existing_file]`, url);
                formDataWithFiles.append(`build_comp[${index}][file_name]`, name);
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
        `${BASE_URL}/company/buildings/${buildingId}/`,
        formDataWithFiles,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully updated building:", response.data);
      onNext({
        formData: {
          ...formData,
          documents: response.data.documents || formData.documents,
        },
        response: response.data,
      });
    } catch (err) {
      console.error("Error updating building:", err);
      setError(
        `Failed to update building: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      documents: documents.map((doc) => ({
        id: doc.id || Math.random().toString(36).substring(2),
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file,
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
      <div className="border rounded-md border-[#E9E9E9] p-5 mb-5">
        <h2 className="review-page-head">Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-8 border-r border-[#E9E9E9] max-[480px]:border-r-0">
            <div>
              <p className="review-page-label">Building Number</p>
              <p className="review-page-data">{building.building_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Building Name</p>
              <p className="review-page-data">{building.building_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Country</p>
              <p className="review-page-data">{countryName}</p>
            </div>
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{building.description || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Latitude</p>
              <p className="review-page-data">{building.latitude || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Status</p>
              <p className="review-page-data">
                {building.status
                  ? building.status.charAt(0).toUpperCase() + building.status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-8 sm:ml-5 max-[480px]:mt-8">
            <div>
              <p className="review-page-label">Plot Number</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Address</p>
              <p className="review-page-data">{building.building_address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">State</p>
              <p className="review-page-data">{stateName}</p>
            </div>
            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{building.remarks || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Longitude</p>
              <p className="review-page-data">{building.longitude || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Nearby Landmark</p>
              <p className="review-page-data">{building.land_mark || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
        <h2 className="review-page-head">Documents</h2>
        <ErrorBoundary>
          <DocumentsView documents={documents} docTypes={docTypes} />
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