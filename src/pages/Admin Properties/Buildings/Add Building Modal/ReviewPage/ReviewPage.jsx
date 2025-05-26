import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import DocumentsView from "./DocumentsView";
import "./reviewpage.css";

const ReviewPage = ({ formData, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract building and documents data from formData
  const building = formData?.building || {};
  // Ensure documents is an array
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  // Debug formData structure
  console.log("ReviewPage formData:", formData);
  console.log("Documents:", documents);

  const handleNext = async () => {
  setLoading(true);
  setError(null);

  // Validate required fields
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

  // Validate documents
  if (documents.length > 0) {
    const invalidDocs = documents.filter(
      (doc) =>
        !doc.doc_type ||
        !doc.number ||
        !doc.issued_date ||
        !doc.expiry_date ||
        !doc.upload_file?.length
    );
    if (invalidDocs.length > 0) {
      setError("All documents must have doc_type, number, dates, and at least one file.");
      setLoading(false);
      return;
    }
  }

  try {
    // Prepare payload for backend
    const payload = {
      ...building,
      build_comp: documents.map(doc => ({
        doc_type: doc.doc_type,
        number: doc.number,
        issued_date: doc.issued_date,
        expiry_date: doc.expiry_date,
        // Only include the first file if multiple are uploaded
        upload_file: doc.upload_file[0] || null
      })),
    };

    // Create FormData for multipart file upload
    const formDataWithFiles = new FormData();
    
    // Append building fields
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'build_comp') {
        formDataWithFiles.append(key, value ?? "");
      }
    });

    // Append documents (build_comp)
    payload.build_comp.forEach((doc, index) => {
      formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type || "");
      formDataWithFiles.append(`build_comp[${index}][number]`, doc.number || "");
      formDataWithFiles.append(`build_comp[${index}][issued_date]`, doc.issued_date || "");
      formDataWithFiles.append(`build_comp[${index}][expiry_date]`, doc.expiry_date || "");
      
      // Handle file upload
      if (doc.upload_file) {
        formDataWithFiles.append(`build_comp[${index}][upload_file]`, doc.upload_file);
      }
    });

    // Log FormData contents for debugging
    console.log("FormData contents:");
    for (const [key, value] of formDataWithFiles.entries()) {
      console.log(`${key}:`, value);
    }

    // Send POST request to backend
    const response = await axios.post(
      `${BASE_URL}/company/buildings/create/`,
      formDataWithFiles,
      {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Successfully created building:", response.data);
    // Navigate to SubmissionConfirmation
    onNext({ formData, response: response.data });
  } catch (err) {
    console.error("Error creating building:", err);
    setError(
      `Failed to save building: ${
        err.response?.data?.message || err.message
      }`
    );
  } finally {
    setLoading(false);
  }
};
  const handleBack = () => {
    // Ensure formData.documents is correctly structured
    const backData = {
      ...formData,
      documents: { documents },
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
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">{building.building_no || "N/A"}</p>
            </div>

            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">
                {building.building_name || "N/A"}
              </p>
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
                  ? building.status.charAt(0).toUpperCase() +
                    building.status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>

            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">
                {building.building_address || "N/A"}
              </p>
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

      {/* Documents Section */}
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Documents</h2>
        <DocumentsView documents={documents} />
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