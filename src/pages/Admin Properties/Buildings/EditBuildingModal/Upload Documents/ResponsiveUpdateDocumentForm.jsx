import React, { useState, useEffect, useMemo } from "react";
import "./documentform.css";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import plusIcon from "../../../../../assets/Images/Admin Units/plus-icon-black.svg";
import documentIcon from "../../../../../assets/Images/Admin Units/document-icon.svg";
import viewIcon from "../../../../../assets/Images/Admin Buildings/viewfile-icon.svg";
import closeIcon from "../../../../../assets/Images/Admin Units/close-icon-white.svg";
import UpdateDocumentUploadModal from "./UpdateDocumentUploadModal/UpdateDocumentUploadModal";

const ResponsiveUpdateDocumentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buildingId = location.state?.buildingId;

  // Memoize initialFormData to prevent reference changes
  const initialFormData = useMemo(() => {
    return (
      location.state?.formData ||
      JSON.parse(localStorage.getItem("update_building_formData")) || {
        building: {},
        documents: { documents: [] },
      }
    );
  }, [location.state?.formData]);

  const safeInitialDocuments = useMemo(() => {
    return Array.isArray(initialFormData?.documents?.documents)
      ? initialFormData.documents.documents.map((doc, index) => ({
          id: doc.id || index + 1,
          doc_type: doc.doc_type?.toString() || "", // Ensure doc_type is string for comparison
          number: doc.number || "",
          issued_date: doc.issued_date || "",
          expiry_date: doc.expiry_date || "",
          upload_file: Array.isArray(doc.upload_file)
            ? doc.upload_file
            : doc.upload_file
            ? [doc.upload_file]
            : [],
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
        ];
  }, [initialFormData]);

  const [documents, setDocuments] = useState(safeInitialDocuments);
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  console.log("Initial documents:", safeInitialDocuments);
  console.log("Current documents state:", documents);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");
    if (role === "company" || role === "user" || role === "admin") {
      return storedCompanyId;
    }
    return null;
  };

  // Fetch document types and building data
  useEffect(() => {
    const fetchDocTypes = async () => {
      if (hasFetched) return;

      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found.");
        }

        // Fetch document types
        const response = await axios.get(
          `${BASE_URL}/company/doc_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDocTypes(Array.isArray(response.data) ? response.data : []);
        setError(null);

        // Fetch building data if buildingId exists
        if (buildingId) {
          try {
            const buildingResponse = await axios.get(
              `${BASE_URL}/company/buildings/${buildingId}/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const buildingData = buildingResponse.data;
            console.log("Fetched building data:", buildingData);

            // Process fetched documents
            const fetchedDocuments = Array.isArray(buildingData.build_comp)
              ? buildingData.build_comp.map((doc, index) => {
                  // Check if upload_file is already processed (might be a File object)
                  let uploadFile = [];
                  if (doc.upload_file) {
                    uploadFile = Array.isArray(doc.upload_file)
                      ? doc.upload_file
                      : [doc.upload_file];
                  }

                  return {
                    id: index + 1,
                    doc_type: doc.doc_type?.toString() || "", // Ensure string type
                    number: doc.number || "",
                    issued_date: doc.issued_date || "",
                    expiry_date: doc.expiry_date || "",
                    upload_file: uploadFile,
                  };
                })
              : [
                  {
                    id: 1,
                    doc_type: "",
                    number: "",
                    issued_date: "",
                    expiry_date: "",
                    upload_file: [],
                  },
                ];

            setDocuments(fetchedDocuments);

            // Update localStorage with fetched documents
            localStorage.setItem(
              "update_building_formData",
              JSON.stringify({
                building: buildingData,
                documents: { documents: fetchedDocuments },
              })
            );
          } catch (err) {
            console.error("Error fetching building data for documents:", err);
            setError("Failed to load building documents.");
          }
        }

        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to load document types. Using default options.");
        setDocTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocTypes();
  }, [buildingId, initialFormData, hasFetched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all documents
    const invalidDocs = documents.filter(doc => {
      // Check if all required fields are filled
      const hasRequiredFields = doc.doc_type && doc.number && doc.issued_date && doc.expiry_date;
      
      // Check if upload_file exists and has at least one file
      const hasFile = doc.upload_file && doc.upload_file.length > 0;
      
      // Document is invalid if either condition fails
      return !hasRequiredFields || !hasFile;
    });

    if (invalidDocs.length > 0) {
      setError("All documents must have doc_type, number, dates, and at least one file.");
      return;
    }

    // Update formData in localStorage
    const updatedFormData = {
      building: initialFormData.building,
      documents: { documents },
    };
    localStorage.setItem("update_building_formData", JSON.stringify(updatedFormData));

    // Open modal for review and submission
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

  const handleBack = () => {
    // Update formData in localStorage
    const updatedFormData = {
      building: initialFormData.building,
      documents: { documents },
    };
    localStorage.setItem("update_building_formData", JSON.stringify(updatedFormData));

    // Navigate back to timeline
    navigate("/admin/update-building-timeline", { state: { buildingId } });
  };

  // Map documents for modal
  const modalDocuments = useMemo(() => {
    return documents.map((doc, index) => {
      const docTypeName = doc.doc_type
        ? docTypes.find((type) => type.id.toString() === doc.doc_type)?.title ||
          `Document ${index + 1}`
        : `Document ${index + 1}`;

      // Handle both File objects and string paths
      const file = doc.upload_file?.[0];
      const isFileObject = file instanceof File;
      const isStringPath = typeof file === "string";

      return {
        name: docTypeName,
        type: isFileObject 
          ? file.type?.split("/")[0] || "file" 
          : isStringPath
            ? file.split(".").pop().toLowerCase() === "pdf" ? "pdf" : "image"
            : "file",
        thumbnail: isFileObject
          ? URL.createObjectURL(file)
          : isStringPath
            ? `${BASE_URL}${file}`
            : null,
      };
    });
  }, [documents, docTypes]);

  if (loading) {
    return <div className="p-4">Loading document types...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col h-full p-[5px] bg-white font-sans">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="text-red-500 p-2 bg-red-100 rounded mb-4">
              {error}
            </div>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="first:pt-0 py-5">
              <div>
                {/* Row 1: Doc.Type & Number */}
                <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <label className="block documents-label mb-2">Doc.Type</label>
                    <div className="relative">
                      <select
                        className="appearance-none documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 cursor-pointer"
                        value={doc.doc_type}
                        onChange={(e) => handleChange(doc.id, "doc_type", e.target.value)}
                        required
                      >
                        <option value="">Select Document</option>
                        {docTypes.map((type) => (
                          <option key={type.id} value={type.id.toString()}>
                            {type.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <label className="block documents-label mb-2">Number</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-md text-gray-500 md:w-full documents-inputs"
                      value={doc.number}
                      onChange={(e) => handleChange(doc.id, "number", e.target.value)}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                  <div className="md:col-span-3"></div>
                </div>
                {/* Row 2: Issue Date & Expiry Date */}
                <div className="grid grid-cols-2 gap-3 mb-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <label className="block documents-label mb-2">Issue Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="documents-inputs w-full p-3 border border-gray-200 rounded-md text-gray-500 bg-gray-50 md:w-full"
                        value={doc.issued_date}
                        onChange={(e) =>
                          handleChange(doc.id, "issued_date", e.target.value)
                        }
                        placeholder="MM/DD/YYYY"
                        required
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
                        onChange={(e) =>
                          handleChange(doc.id, "expiry_date", e.target.value)
                        }
                        placeholder="MM/DD/YYYY"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3"></div>
                </div>
                {/* Row 3: Upload Files & View Doc with Close Button */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
                  <div className="col-span-1 md:col-span-1">
                    <div className="relative">
                      <label className="block documents-label">Upload Files</label>
                      <input
                        type="file"
                        className="hidden documents-inputs"
                        id={`fileInput-${doc.id}`}
                        onChange={(e) =>
                          handleChange(
                            doc.id,
                            "upload_file",
                            e.target.files ? Array.from(e.target.files) : []
                          )
                        }
                        required={doc.upload_file.length === 0}
                      />
                      <label
                        htmlFor={`fileInput-${doc.id}`}
                        className="flex items-center justify-between documents-inputs cursor-pointer w-[161px] !py-2"
                      >
                        <span className="text-[#4B465C60] text-sm truncate">
                          {doc.upload_file.length > 0
                            ? doc.upload_file[0]?.name || "File attached"
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
                        <span className="text-sm">
                          {doc.upload_file.length > 0 ? "View File" : "No file"}
                        </span>
                        {doc.upload_file.length > 0 && (
                          <img
                            src={viewIcon}
                            alt="view"
                            className="ml-2 h-5 w-5 files-icon"
                          />
                        )}
                      </div>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-2 bg-[#E44747] hover:bg-[#d43939] res-remove-btn flex justify-center items-center duration-200"
                        >
                          <img src={closeIcon} className="h-4 w-4" alt="remove" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-3"></div>
                </div>
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
                <img src={plusIcon} className="ml-1 h-5 w-5 add-icon" alt="add" />
              </button>
            </div>
          </div>
          {/* Bottom Button Section */}
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-[80px]">
              <button
                type="button"
                className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <UpdateDocumentUploadModal
          isOpen={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
          documents={modalDocuments}
          formData={{
            building: initialFormData.building,
            documents: { documents },
          }}
          buildingId={buildingId}
        />
      </form>
    </div>
  );
};

export default ResponsiveUpdateDocumentForm;