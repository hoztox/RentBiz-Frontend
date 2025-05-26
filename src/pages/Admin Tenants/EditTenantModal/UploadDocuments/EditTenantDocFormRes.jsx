import "./documentsform.css"
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocumentUploadModal from "./DocumentUploadModal/DocumentUploadModal";
import viewIcon from "../../../../assets/Images/Admin Tenants/viewfile-icon.svg";
import plusIcon from "../../../../assets/Images/Admin Tenants/plus-icon-black.svg";
import documentIcon from "../../../../assets/Images/Admin Tenants/document-icon.svg";
import closeIcon from "../../../../assets/Images/Admin Tenants/close-icon-white.svg";

const EditTenantDocFormRes = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "",
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
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    } else {
      console.log("Cannot remove the last document set.");
    }
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
    // Update edit_tenant_completedSteps to include "Update Documents" (id: 2) and "Changes Submitted" (id: 3)
    const currentCompletedSteps =
      JSON.parse(localStorage.getItem("edit_tenant_completedSteps")) || [];
    const updatedCompletedSteps = [
      ...new Set([...currentCompletedSteps, 2, 3]),
    ]; // Add ids 2 and 3
    localStorage.setItem(
      "edit_tenant_completedSteps",
      JSON.stringify(updatedCompletedSteps)
    );
    localStorage.setItem("edit_tenant_activeCard", "null"); // No active card after submission
    // navigate("/admin/edit-tenant-reset"); // Navigate to TenantsReset
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
            <div key={doc.id} className="first:pt-0 py-5">
              <div>
                {/* Row 1: Doc.Type & Number */}
                <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <label className="block documents-label mb-2">
                      Doc.Type
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 cursor-pointer"
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
                        <label className="block documents-label mb-2">
                          Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-200 rounded-md text-gray-500 md:w-full documents-inputs"
                          value={doc.number}
                          onChange={(e) =>
                            handleChange(doc.id, "number", e.target.value)
                          }
                          placeholder="0123456789"
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
                        <label className="block documents-label mb-2">
                          Issue Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.issueDate}
                            onChange={(e) =>
                              handleChange(doc.id, "issueDate", e.target.value)
                            }
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block documents-label mb-2">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.expiryDate}
                            onChange={(e) =>
                              handleChange(doc.id, "expiryDate", e.target.value)
                            }
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3"></div>
                    </div>
                    {/* Row 3: Upload Files & View Doc with Close Button */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
                      <div className="col-span-1 md:col-span-1">
                        <div className="relative">
                          <label className="block documents-label">
                            Upload Files
                          </label>
                          <input
                            type="file"
                            className="hidden documents-inputs"
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
                            className="flex items-center justify-between documents-inputs cursor-pointer w-[161px] !py-2"
                          >
                            <span className="text-[#4B465C60] text-sm truncate">
                              {doc.files.length > 0
                                ? `${doc.files.length} file(s)`
                                : "Attach Files"}
                            </span>
                            <img
                              src={documentIcon}
                              alt="attach"
                              className="ml-2 h-5 w-5 files-icon"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block documents-label mb-2">
                          View Doc
                        </label>
                        <div className="flex gap-2">
                          <div
                            className="flex items-center justify-between flex-grow p-3 border border-gray-200 rounded-md text-gray-500 documents-inputs"
                            style={{ width: "calc(100% - 40px)" }}
                          >
                            <span className="text-sm">View File</span>
                            <img
                              src={viewIcon}
                              alt="view"
                              className="ml-2 h-5 w-5 files-icon"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="p-2 bg-[#E44747] hover:bg-[#d43939] res-remove-btn flex justify-center items-center duration-200"
                          >
                            <img
                              src={closeIcon}
                              className="h-4 w-4"
                              alt="remove"
                            />
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
          {/* Add Document Button */}
          <div className="pt-0 pb-4 border-b">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddDocument}
                className="inline-flex justify-center items-center px-3 py-2 text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white res-add-btn duration-200"
              >
                Add New Document Set
                <img
                  src={plusIcon}
                  className="ml-1 h-5 w-5 add-icon"
                  alt="add"
                />
              </button>
            </div>
          </div>
          {/* Bottom Button Section */}
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-[80px]">
              <button
                type="button"
                className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
                onClick={() => navigate("/admin/edit-tenant-timeline")}
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
        <DocumentUploadModal
          isOpen={isModalOpen}
          onCancel={handleCancelModal}
          onConfirm={handleConfirmModal}
          documents={modalDocuments}
        />
      </div>
    </div>
  );
};

export default EditTenantDocFormRes;
