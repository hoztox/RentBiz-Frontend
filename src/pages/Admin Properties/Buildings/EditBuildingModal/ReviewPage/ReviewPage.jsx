import React, { useState, Component } from "react";
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

  const building = formData?.building || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  console.log("ReviewPage formData:", formData);
  console.log("ReviewPage documents:", documents);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    const requiredFields = [
      "building_no",
      "plot_no",
      "building_name",
      "building_address",
      "company",
      "status",
    ];
    const missingFields = requiredFields.filter((field) => !building[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    if (documents.length > 0) {
      const invalidDocs = documents.filter(
        (doc) =>
          !doc.doc_type ||
          !doc.number ||
          !doc.issued_date ||
          !doc.expiry_date ||
          !doc.upload_file
      );
      if (invalidDocs.length > 0) {
        setError("All documents must have doc_type, number, dates, and at least one file.");
        setLoading(false);
        return;
      }
    }

    try {
      console.log("Documents array:", documents);
      documents.forEach((doc, index) => {
        console.log(`Document ${index} upload_file:`, doc.upload_file, typeof doc.upload_file);
      });

      const convertToBlob = async (fileData) => {
        if (!fileData) {
          console.warn("No file data provided");
          return null;
        }
        if (fileData instanceof File || fileData instanceof Blob) {
          return fileData;
        }
        if (typeof fileData === "string") {
          try {
            const response = await fetch(fileData);
            if (!response.ok) {
              throw new Error(`Failed to fetch file from ${fileData}: ${response.statusText}`);
            }
            const blob = await response.blob();
            return new Blob([blob], { type: blob.type || "application/octet-stream" });
          } catch (err) {
            console.error(`Error converting string to blob: ${err.message}`);
            return null;
          }
        }
        console.warn("Invalid file data type:", typeof fileData, fileData);
        return null;
      };

      const payload = {
        ...building,
        build_comp: documents.map((doc) => ({
          doc_type: doc.doc_type,
          number: doc.number,
          issued_date: doc.issued_date,
          expiry_date: doc.expiry_date,
          upload_file: doc.upload_file || null,
        })),
      };

      const formDataWithFiles = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "build_comp") {
          formDataWithFiles.append(key, value ?? "");
        }
      });

      await Promise.all(
        payload.build_comp.map(async (doc, index) => {
          formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type || "");
          formDataWithFiles.append(`build_comp[${index}][number]`, doc.number || "");
          formDataWithFiles.append(`build_comp[${index}][issued_date]`, doc.issued_date || "");
          formDataWithFiles.append(`build_comp[${index}][expiry_date]`, doc.expiry_date || "");
          if (doc.upload_file) {
            const file = Array.isArray(doc.upload_file) ? doc.upload_file[0] : doc.upload_file;
            const fileBlob = await convertToBlob(file);
            if (fileBlob) {
              formDataWithFiles.append(
                `build_comp[${index}][upload_file]`,
                fileBlob,
                fileBlob.name || `file-${index}`
              );
            } else {
              console.warn(`Skipping invalid file for document ${index}`);
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
          },
        }
      );

      console.log("Successfully updated building:", response.data);
      onNext({ formData, response: response.data });
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
      ...formData,
      documents: documents,
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
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">{building.building_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">{building.building_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Country*</p>
              <p className="review-page-data">{building.country || "N/A"}</p>
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
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">
                {building.status
                  ? building.status.charAt(0).toUpperCase() + building.status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-8 sm:ml-5 max-[480px]:mt-8">
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{building.building_address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">State*</p>
              <p className="review-page-data">{building.state || "N/A"}</p>
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
              <p className="review-page-label">Near By Landmark</p>
              <p className="review-page-data">{building.land_mark || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
        <h2 className="review-page-head">Documents</h2>
        <ErrorBoundary>
          <DocumentsView documents={documents} />
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