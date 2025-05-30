import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import DocumentsView from "./DocumentsView";
import "./reviewpage.css";
import { Component } from "react";

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

const ReviewPage = ({ formData, onNext, onBack, unitId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unit = formData?.unit || {};
  const building = formData?.building || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    const requiredFields = [
      "unit_name",
      "unit_type",
      "address",
      "premise_no",
      "unit_status",
    ];
    const missingFields = requiredFields.filter((field) => !unit[field]);
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
          (!doc.upload_file?.length && !doc.existing_files?.length)
      );
      if (invalidDocs.length > 0) {
        setError(
          "All documents must have doc_type, number, dates, and at least one file."
        );
        setLoading(false);
        return;
      }
    }
    try {
      console.log("Documents array:", documents);
      const formData = new FormData();
      // Add unit fields (excluding unit_comp)
      Object.entries(unit).forEach(([key, value]) => {
        if (key !== "unit_comp") {
          formData.append(key, value ?? "");
        }
      });
      // Prepare documents JSON (without files)
      const documentsJson = documents.map((doc, index) => ({
        id: doc.id || null,
        doc_type: doc.doc_type || null,
        number: doc.number || "",
        issued_date: doc.issued_date || "",
        expiry_date: doc.expiry_date || "",
        file_index: doc.has_new_files ? index : null, // Index to match file in FormData
      }));
      // Add documents JSON
      if (documentsJson.length > 0) {
        formData.append("unit_comp_json", JSON.stringify(documentsJson));
      }
      // Add files with indexed keys
      let fileIndex = 0;
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        if (doc.has_new_files && doc.upload_file) {
          const file = Array.isArray(doc.upload_file)
            ? doc.upload_file[0]
            : doc.upload_file;
          if (file instanceof File) {
            // Use the pattern your backend expects: document_file_{index}
            formData.append(`document_file_${fileIndex}`, file, file.name);
            console.log(`Added file document_file_${fileIndex}:`, file.name);
            fileIndex++;
          } else {
            console.warn(
              `Document ${i} upload_file is not a File object:`,
              file
            );
          }
        }
      }
      // If there's only one file and no unit_comp_json, use simple upload_file key
      if (
        documents.length === 1 &&
        documents[0].has_new_files &&
        documents[0].upload_file
      ) {
        const file = Array.isArray(documents[0].upload_file)
          ? documents[0].upload_file[0]
          : documents[0].upload_file;
        if (file instanceof File) {
          formData.append("upload_file", file, file.name);
          console.log("Added simple upload_file:", file.name);
        }
      }
      // Debug: Log all FormData contents
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(
          `${key}:`,
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes)`
            : value
        );
      }
      const response = await axios.put(
        `${BASE_URL}/company/units/${unitId}/edit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Don't set Content-Type manually - let axios set it with boundary
          },
        }
      );
      console.log("Successfully updated unit:", response.data);
      onNext({ formData, response: response.data });
    } catch (err) {
      console.error("Error updating unit:", err);
      console.error("Error response:", err.response?.data);
      setError(
        `Failed to update unit: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      ...formData,
      documents: { documents }, // Preserve the nested documents structure
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
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">
                {building.building_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Description*</p>
              <p className="review-page-data">
                {building.description || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">
                {building.building_no || "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">
                {building.building_address || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Unit Name*</p>
              <p className="review-page-data">{unit.unit_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Unit Type*</p>
              <p className="review-page-data">{unit.unit_type || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Bedrooms</p>
              <p className="review-page-data">{unit.no_of_bedrooms || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{unit.description || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Premise Number*</p>
              <p className="review-page-data">{unit.premise_no || "N/A"}</p>
            </div>
          </div>
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{unit.address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Bathrooms</p>
              <p className="review-page-data">
                {unit.no_of_bathrooms || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{unit.remarks || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">{unit.unit_status || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
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
