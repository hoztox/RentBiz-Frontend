import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { File as LucideFile, FileText, Image } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../../../utils/config";
import "./documentuploadmodal.css";

const DocumentUploadModal = ({ isOpen, onCancel, formData, setFormData, documents = [], buildingId }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const documentsPerSlide = 2;
  const totalSlides = Math.min(Math.ceil(documents.length / documentsPerSlide), 4);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const building = formData?.building || {};
  const modalDocuments = documents.map((doc, index) => ({
    name: `${doc.doc_type || "Document"} ${doc.number || index + 1}`,
    type: Array.isArray(doc.upload_file) && doc.upload_file.length > 0
      ? doc.upload_file[0].type?.split("/")[0] || "file"
      : typeof doc.upload_file === "string"
      ? doc.upload_file.split(".").pop().toLowerCase() === "pdf" ? "pdf" : "image"
      : "file",
    thumbnail: Array.isArray(doc.upload_file) && doc.upload_file.length > 0 && doc.upload_file[0] instanceof File
      ? URL.createObjectURL(doc.upload_file[0])
      : typeof doc.upload_file === "string"
      ? `${BASE_URL}${doc.upload_file}`
      : null,
  }));

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-blue-500" size={24} />;
      case "image":
        return <Image className="text-blue-500" size={24} />;
      default:
        return <LucideFile className="text-blue-500" size={24} />;
    }
  };

  const handleConfirm = async () => {
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
    const validDocuments = documents.filter(
      (doc) =>
        doc.doc_type &&
        doc.number &&
        doc.issued_date &&
        doc.expiry_date &&
        (Array.isArray(doc.upload_file) && doc.upload_file.length > 0 && doc.upload_file[0] instanceof File ||
         typeof doc.upload_file === "string")
    );

    if (documents.length > 0 && validDocuments.length === 0) {
      setError("All documents must have doc_type, number, dates, and a valid file.");
      setLoading(false);
      return;
    }

    try {
      const getValueOrEmpty = (value) => {
        return value === null || value === undefined ? "" : value;
      };

      const formDataWithFiles = new FormData();
      formDataWithFiles.append("company", building.company);
      formDataWithFiles.append("building_name", building.building_name);
      formDataWithFiles.append("building_no", building.building_no);
      formDataWithFiles.append("plot_no", building.plot_no);
      formDataWithFiles.append("description", getValueOrEmpty(building.description));
      formDataWithFiles.append("remarks", getValueOrEmpty(building.remarks));
      formDataWithFiles.append("latitude", getValueOrEmpty(building.latitude));
      formDataWithFiles.append("longitude", getValueOrEmpty(building.longitude));
      formDataWithFiles.append("status", building.status);
      formDataWithFiles.append("land_mark", getValueOrEmpty(building.land_mark));
      formDataWithFiles.append("building_address", building.building_address);

      validDocuments.forEach((doc, index) => {
        formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type);
        formDataWithFiles.append(`build_comp[${index}][number]`, doc.number);
        formDataWithFiles.append(`build_comp[${index}][issued_date]`, doc.issued_date);
        formDataWithFiles.append(`build_comp[${index}][expiry_date]`, doc.expiry_date);
        // Only include upload_file if it's a new File object
        if (Array.isArray(doc.upload_file) && doc.upload_file[0] instanceof File) {
          formDataWithFiles.append(`build_comp[${index}][upload_file]`, doc.upload_file[0]);
        }
        // Note: Do not include upload_file for existing file paths (strings)
        // Backend should retain existing files if upload_file is omitted
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Use PUT request for updating
      const response = await axios.put(
        `${BASE_URL}/company/buildings/${buildingId || 1}/`,
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully updated building:", response.data);
      const updatedCompletedSteps = [1, 2, 3];
      localStorage.setItem("building_completedSteps", JSON.stringify(updatedCompletedSteps));
      localStorage.setItem("building_activeCard", "null");
      localStorage.removeItem("building_formData");
      setFormData({ building: {}, documents: { documents: [] } });
      navigate("/admin/submitted");
    } catch (err) {
      console.error("Error updating building:", err);
      setError(
        `Failed to update building: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const startIndex = currentSlide * documentsPerSlide;
  const visibleDocuments = modalDocuments.slice(startIndex, startIndex + documentsPerSlide);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg modal-box">
        {error && (
          <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>
        )}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#28C76F]">Building Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600">Building No*</p>
                <p>{building.building_no || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plot No*</p>
                <p>{building.plot_no || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Building Name*</p>
                <p>{building.building_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address*</p>
                <p>{building.building_address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p>{building.description || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remarks</p>
                <p>{building.remarks || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status*</p>
                <p>
                  {building.status
                    ? building.status.charAt(0).toUpperCase() + building.status.slice(1)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Latitude</p>
                <p>{building.latitude || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longitude</p>
                <p>{building.longitude || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Near By Landmark</p>
                <p>{building.land_mark || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#28C76F]">Uploaded Documents</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {visibleDocuments.map((doc, index) => (
                <div key={index} className="flex flex-col">
                  <div className="bg-gray-100 rounded-md overflow-hidden">
                    <div className="relative bg-white">
                      {doc.thumbnail ? (
                        <img
                          src={doc.thumbnail}
                          alt={doc.name}
                          className="object-cover h-[120px] w-full"
                        />
                      ) : (
                        <div className="w-full h-[120px] flex items-center justify-center bg-[#1458A2]">
                          {getDocumentIcon(doc.type)}
                        </div>
                      )}
                    </div>
                    <div className="p-2 px-3 bg-[#1458A2] text-start">
                      <p className="document-name text-white truncate">{doc.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    currentSlide === index ? "bg-[#2892CE]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 duration-200 focus:outline-none cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#2892CE] text-white hover:bg-[#1f709e] duration-200 focus:outline-none modal-confirm-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;