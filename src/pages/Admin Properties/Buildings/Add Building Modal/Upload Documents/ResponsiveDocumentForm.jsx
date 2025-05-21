import React, { useState } from "react";
import { ChevronDown, Calendar, Paperclip, Eye, X } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal/DocumentUploadModal";
import "./documentform.css";
import { useNavigate } from "react-router-dom";

const ResponsiveDocumentForm = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "Permit",
      number: "0123456789",
      issueDate: "10/01/2024",
      expiryDate: "10/01/2024",
      files: [],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      type: "",
      number: "",
      issueDate: "",
      expiryDate: "",
      files: [],
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleChange = (id, field, value) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmModal = () => {
    setIsModalOpen(false);
    console.log("Form submitted with documents:", documents);
    // Update completedSteps to include "Upload Documents" (id: 2) and "Submitted" (id: 3)
    const currentCompletedSteps = JSON.parse(localStorage.getItem('completedSteps')) || [];
    const updatedCompletedSteps = [...new Set([...currentCompletedSteps, 2, 3])]; // Add ids 2 and 3
    localStorage.setItem('completedSteps', JSON.stringify(updatedCompletedSteps));
    localStorage.setItem('activeCard', 'null'); // No active card after submission
    navigate("/admin/submitted"); // Navigate to SubmissionConfirmationResponsive
  };

  // Map documents to the format expected by DocumentUploadModal
  const modalDocuments = documents.map((doc, index) => ({
    name: `${doc.type || "Document"} ${doc.number || index + 1}`,
    type: doc.files.length > 0 ? doc.files[0].type.split("/")[0] : "file",
    thumbnail: doc.files.length > 0 ? URL.createObjectURL(doc.files[0]) : null,
  }));

  return (
    <div className="w-full flex flex-col h-full p-[5px] bg-white font-sans">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {documents.map((doc) => (
            <div key={doc.id} className="border-b first:pt-0 py-5">
              <div>
                {/* Row 1: DocType & Number */}
                <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm text-gray-800 mb-2">
                      Doc.Type
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 cursor-pointer"
                        value={doc.type}
                        onChange={(e) =>
                          handleChange(doc.id, "type", e.target.value)
                        }
                      >
                        <option value="">Select Document</option>
                        <option value="License">License</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Permit">Permit</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {doc.type && (
                    <>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm text-gray-800 mb-2">
                          Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                          value={doc.number}
                          onChange={(e) =>
                            handleChange(doc.id, "number", e.target.value)
                          }
                          placeholder="Number"
                        />
                      </div>
                      <div className="md:col-span-3"></div>
                    </>
                  )}
                </div>
                {doc.type && (
                  <>
                    {/* Row 2: Issue Date & Expiry Date */}
                    <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm text-gray-800 mb-2">
                          Issue Date
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.issueDate}
                            onChange={(e) =>
                              handleChange(doc.id, "issueDate", e.target.value)
                            }
                            placeholder="MM/DD/YYYY"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm text-gray-800 mb-2">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.expiryDate}
                            onChange={(e) =>
                              handleChange(doc.id, "expiryDate", e.target.value)
                            }
                            placeholder="MM/DD/YYYY"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="md:col-span-3"></div>
                    </div>
                    {/* Row 3: Upload Files & View Doc with Close Button */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm text-gray-800 mb-2">
                          Upload Files
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            className="hidden"
                            id={`fileInput-${doc.id}`}
                            multiple
                            onChange={(e) =>
                              handleChange(
                                doc.id,
                                "files",
                                Array.from(e.target.files)
                              )
                            }
                          />
                          <label
                            htmlFor={`fileInput-${doc.id}`}
                            className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 cursor-pointer md:w-full"
                          >
                            <span className="text-sm truncate">
                              Attach Files
                            </span>
                            <Paperclip className="h-4 w-4 text-gray-500" />
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block text-sm text-gray-800 mb-2">
                          View Doc
                        </label>
                        <div className="flex gap-2">
                          <div
                            className="flex items-center justify-between flex-grow p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50"
                            style={{ width: "calc(100% - 40px)" }}
                          >
                            <span className="text-sm">View File</span>
                            <Eye className="h-4 w-4 text-gray-500" />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="p-3 bg-red-500 hover:bg-red-600 rounded-md text-white flex justify-center items-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-3"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {/* Button Section */}
          <div className="flex flex-col pt-6">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={handleAddDocument}
                className="w-full py-3 px-4 border border-gray-800 rounded-md text-gray-800 hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors"
              >
                Add New Document Set
                <span className="ml-2 text-lg">+</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <DocumentUploadModal
        isOpen={isModalOpen}
        onCancel={handleCancelModal}
        onConfirm={handleConfirmModal}
        documents={modalDocuments}
      />
    </div>
  );
};

export default ResponsiveDocumentForm;