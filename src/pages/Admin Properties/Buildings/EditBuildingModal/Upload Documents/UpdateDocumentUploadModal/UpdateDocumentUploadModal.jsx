import React, { useState } from "react";
import "./UpdateDocumentUploadModal.css";
import { File, FileText, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../../../utils/config";

const UpdateDocumentUploadModal = ({
  isOpen,
  onCancel,
  onConfirm,
  documents = [],
  formData,
  buildingId,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const documentsPerSlide = 2;
  const totalSlides = Math.min(Math.ceil(documents.length / documentsPerSlide), 4);

  if (!isOpen) return null;

  const handleDotClick = (index) => setCurrentSlide(index);

  const getDocumentIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-blue-500" size={24} />;
      case "image":
        return <Image className="text-blue-500" size={24} />;
      default:
        return <File className="text-blue-500" size={24} />;
    }
  };

  const isFile = (obj) => {
    // Check for File or Blob objects without using instanceof
    if (obj && typeof obj === 'object') {
      // Modern browser File object
      if (typeof obj.name === 'string' && 
          typeof obj.size === 'number' && 
          typeof obj.type === 'string' &&
          typeof obj.slice === 'function') {
        return true;
      }
      // Node.js file object alternative
      if (obj.path && typeof obj.path === 'string') {
        return true;
      }
      // Another common pattern for file-like objects
      if (obj.originalname && obj.buffer) {
        return true;
      }
    }
    return false;
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const building = formData?.building || {};
    const documentsData = formData?.documents?.documents || [];

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

    if (documentsData.length > 0) {
      const invalidDocs = documentsData.filter((doc) => {
        const missing = [];
        if (!doc.doc_type) missing.push("doc_type");
        if (!doc.number) missing.push("number");
        if (!doc.issued_date) missing.push("issued_date");
        if (!doc.expiry_date) missing.push("expiry_date");

        const hasFiles = doc.upload_file && (Array.isArray(doc.upload_file) ? doc.upload_file.length > 0 : true);
        if (!hasFiles) missing.push("upload_file");

        return missing.length > 0;
      });

      if (invalidDocs.length > 0) {
        setError("All documents must have doc_type, number, dates, and at least one file.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...building,
        build_comp: documentsData.map((doc) => ({
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

      payload.build_comp.forEach((doc, index) => {
        formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type || "");
        formDataWithFiles.append(`build_comp[${index}][number]`, doc.number || "");
        formDataWithFiles.append(`build_comp[${index}][issued_date]`, doc.issued_date || "");
        formDataWithFiles.append(`build_comp[${index}][expiry_date]`, doc.expiry_date || "");

        const files = Array.isArray(doc.upload_file) ? doc.upload_file : [doc.upload_file];
        if (files && files.length > 0) {
          files.forEach((file, fileIndex) => {
            if (isFile(file)) {
              formDataWithFiles.append(`build_comp[${index}][upload_file]`, file, file.name || `file-${index}-${fileIndex}`);
            } else if (typeof file === "string") {
              formDataWithFiles.append(`build_comp[${index}][upload_file]`, file);
            }
          });
        }
      });

      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(`${key}:`, isFile(value) ? `File: ${value.name}` : value);
      }

      const response = await axios.put(
        `${BASE_URL}/company/buildings/${buildingId}/`,
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Successfully updated building:", response.data);

      const currentCompletedSteps =
        JSON.parse(localStorage.getItem("update_building_completedSteps")) || [];
      const updatedCompletedSteps = [...new Set([...currentCompletedSteps, 2, 3])];

      localStorage.setItem("update_building_completedSteps", JSON.stringify(updatedCompletedSteps));
      localStorage.setItem("update_building_activeCard", "null");
      localStorage.removeItem("update_building_formData");

      onConfirm();
      navigate("/admin/update-building-submitted");
    } catch (err) {
      console.error("Error updating building:", err);
      setError(
        `Failed to update building: ${err.response?.data?.message || err.message}`
      );
      setLoading(false);
    }
  };

  const startIndex = currentSlide * documentsPerSlide;
  const visibleDocuments = documents.slice(startIndex, startIndex + documentsPerSlide);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg modal-box">
        <div>
          {error && (
            <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>
          )}
          <div className="flex justify-center relative">
            <div className="grid grid-cols-2 gap-4">
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
          <div className="text-center mb-6 mt-4 modal-content">
            <h2 className="text-2xl font-semibold text-[#28C76F]">Document Upload</h2>
            <p className="text-gray-600 text-sm">Review your uploaded documents</p>
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
              {loading ? "Updating..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDocumentUploadModal;