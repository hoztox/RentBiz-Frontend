import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { File, FileText, Image } from "lucide-react";
import "./DocumentUploadModal.css";

const DocumentUploadModal = ({
  isOpen,
  onCancel,
  onConfirm,
  documents = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const documentsPerSlide = 2;
  const totalSlides = Math.min(
    Math.ceil(documents.length / documentsPerSlide),
    4
  );
  const navigate = useNavigate();

  if (!isOpen) return null;

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
        return <File className="text-blue-500" size={24} />;
    }
  };

  const startIndex = currentSlide * documentsPerSlide;
  const visibleDocuments = documents.slice(
    startIndex,
    startIndex + documentsPerSlide
  );

  const handleConfirm = () => {
    onConfirm(); // Call the original onConfirm function
    navigate("/admin/edit-tenant-submitted"); // Navigate to the submitted page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg modal-box">
        <div>
          <div className="flex justify-center relative">
            <div>
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
                        <p className="document-name text-white truncate">
                          {doc.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            <h2 className="text-2xl font-semibold text-[#28C76F]">
              Document Upload
            </h2>
            <p className="text-gray-600 text-sm">
              Review your uploaded documents
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 duration-200 focus:outline-none cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#2892CE] text-white hover:bg-[#1f709e] duration-200 focus:outline-none modal-confirm-btn"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
