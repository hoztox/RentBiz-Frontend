import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal/DocumentUploadModal";
import "./documentform.css";
import { useNavigate } from "react-router-dom";
import documentIcon from "../../../../../assets/Images/Admin Units/document-icon.svg";
import viewIcon from "../../../../../assets/Images/Admin Buildings/viewfile-icon.svg";
import closeIcon from "../../../../../assets/Images/Admin Units/close-icon-white.svg";
import plusIcon from "../../../../../assets/Images/Admin Units/plus-icon-black.svg";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";

const ResponsiveDocumentForm = () => {
  const [formData, setFormData] = useState(
    JSON.parse(localStorage.getItem("building_formData")) || {
      building: {},
      documents: { documents: [] },
    }
  );

  const [documents, setDocuments] = useState(
    Array.isArray(formData.documents?.documents) && formData.documents.documents.length > 0
      ? formData.documents.documents.map((doc, index) => ({
          id: index + 1,
          doc_type: doc.doc_type || "",
          number: doc.number || "",
          issued_date: doc.issued_date || "",
          expiry_date: doc.expiry_date || "",
          upload_file: doc.upload_file || [], // Array for new files or string for existing
        }))
      : [
          {
            id: 1,
            doc_type: "",
            number: "",
            issued_date: "",
            expiry_date: "",
            upload_file: [],
          },
        ]
  );

  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");
    if (role === "company" || role === "user" || role === "admin") {
      try {
        return storedCompanyId ? JSON.parse(storedCompanyId) : null;
      } catch (e) {
        console.error("Error parsing company ID:", e);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchDocTypes = async () => {
      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(`${BASE_URL}/company/doc_type/company/${companyId}`);
        setDocTypes(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to load document types. Using default options.");
        setDocTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validDocuments = documents.filter(
      (doc) =>
        doc.doc_type &&
        doc.number &&
        doc.issued_date &&
        doc.expiry_date &&
        (doc.upload_file?.length > 0 || typeof doc.upload_file === "string")
    );

    if (documents.length > 0 && validDocuments.length === 0) {
      setError("Please fill all required document fields or remove incomplete documents.");
      return;
    }

    const tempData = {
      ...formData,
      documents: {
        documents: validDocuments.map((doc) => ({
          doc_type: doc.doc_type,
          number: doc.number,
          issued_date: doc.issued_date,
          expiry_date: doc.expiry_date,
          upload_file: doc.upload_file, // Preserve File or string
        })),
      },
    };
    setFormData(tempData);
    localStorage.setItem("building_formData", JSON.stringify(tempData));
    setIsModalOpen(true);
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      doc_type: "",
      number: "",
      issued_date: "",
      expiry_date: "",
      upload_file: [],
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    } else {
      setError("Cannot remove the last document set.");
    }
  };

  const handleChange = (id, field, value) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const handleFileChange = (id, files) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, upload_file: Array.from(files) } : doc
      )
    );
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col h-full p-[5px] bg-white font-sans">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {loading && <p>Loading document types...</p>}
          {documents.map((doc) => (
            <div key={doc.id} className="first:pt-0 py-5">
              <div>
                <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <label className="block documents-label mb-2">Doc.Type</label>
                    <div className="relative">
                      <select
                        className="appearance-none documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 cursor-pointer"
                        value={doc.doc_type}
                        onChange={(e) => handleChange(doc.id, "doc_type", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Document</option>
                        {docTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {doc.doc_type && (
                    <>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block documents-label mb-2">Number</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-200 rounded-md text-gray-500 md:w-full documents-inputs"
                          value={doc.number}
                          onChange={(e) => handleChange(doc.id, "number", e.target.value)}
                          placeholder="0123456789"
                        />
                      </div>
                      <div className="md:col-span-3"></div>
                    </>
                  )}
                </div>
                {doc.doc_type && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                      <div className="col-span-1 md:col-span-1">
                        <label className="block documents-label mb-2">Issue Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.issued_date}
                            onChange={(e) => handleChange(doc.id, "issued_date", e.target.value)}
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <label className="block documents-label mb-2">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                            value={doc.expiry_date}
                            onChange={(e) => handleChange(doc.id, "expiry_date", e.target.value)}
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
                      <div className="col-span-1 md:col-span-1">
                        <div className="relative">
                          <label className="block documents-label">Upload Files</label>
                          <input
                            type="file"
                            className="hidden documents-inputs"
                            id={`fileInput-${doc.id}`}
                            multiple
                            onChange={(e) => handleFileChange(doc.id, e.target.files)}
                          />
                          <label
                            htmlFor={`fileInput-${doc.id}`}
                            className="flex items-center justify-between documents-inputs cursor-pointer w-[161px] !py-2"
                          >
                            <span className="text-[#4B465C60] text-sm truncate">
                              {doc.upload_file.length > 0
                                ? typeof doc.upload_file === "string"
                                  ? "Existing File"
                                  : `${doc.upload_file.length} file(s)`
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
                        <label className="block documents-label mb-2">View Doc</label>
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
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-[80px]">
              <button
                type="button"
                className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
                onClick={() => navigate("/admin/building-timeline")}
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
          formData={formData}
          setFormData={setFormData}
          documents={documents}
        />
      </div>
    </div>
  );
};

export default ResponsiveDocumentForm;