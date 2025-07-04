import { useState, useEffect } from "react";
import "./documentsform.css";
import { ChevronDown } from "lucide-react";
import documentIcon from "../../../../assets/Images/Admin Tenants/document-icon.svg";
import closeIcon from "../../../../assets/Images/Admin Tenants/close-icon-white.svg";
import plusIcon from "../../../../assets/Images/Admin Tenants/plus-icon-black.svg";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";

const DocumentsForm = ({ onNext, onBack, initialData, tenantId }) => {
  // Normalize initialData.documents to ensure it's an array
  const normalizeDocuments = (docs) => {
  console.log("Normalizing documents:", docs);
  if (!Array.isArray(docs)) {
    return [
      {
        id: 1,
        doc_type: "",
        number: "",
        issued_date: "",
        expiry_date: "",
        upload_file: null,
      },
    ];
  }
  return docs.map((doc, index) => ({
    id: doc.id || index + 1,
    doc_type: doc.doc_type || "",
    number: doc.number || "",
    issued_date: doc.issued_date || "",
    expiry_date: doc.expiry_date || "",
    upload_file: Array.isArray(doc.upload_file) ? doc.upload_file[0] || null : doc.upload_file || null, // Extract string from array
  }));
};

  const [documents, setDocuments] = useState(normalizeDocuments(initialData?.documents));
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize documents state with initialData when it changes
  useEffect(() => {
    setDocuments(normalizeDocuments(initialData?.documents));
  }, [initialData]);

  // Helper function to display file names
  const getFileDisplayText = (file) => {
    if (!file) return "Attach Files";
    if (file instanceof File) return file.name;
    if (typeof file === "string") {
      const parts = file.split("/");
      return parts[parts.length - 1] || file;
    }
    return "Unknown file";
  };

  // Fetch document types
  useEffect(() => {
    const fetchDocTypes = async () => {
      setLoading(true);
      try {
        const companyId = localStorage.getItem("company_id");
        if (!companyId) {
          throw new Error("Company ID not found.");
        }
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
    // Validate documents based on docType properties
    const validDocuments = documents.filter((doc) => {
      if (!doc.doc_type) return false;
      const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
      if (!docType) return false;
      return (
        (!docType.number || doc.number) &&
        (!docType.issue_date || doc.issued_date) &&
        (!docType.expiry_date || doc.expiry_date) &&
        (!docType.upload_file || doc.upload_file) // Ensure upload_file is present if required
      );
    });

    if (documents.length > 0 && validDocuments.length === 0) {
      setError("Please fill all required document fields or remove incomplete documents.");
      return;
    }

    const tempData = {
      documents: validDocuments.map((doc) => ({
        id: doc.id || null,
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || null,
      })),
    };
    console.log("DocumentsForm submitted:", tempData);
    onNext(tempData);
  };

  const handleBack = () => {
    const tempData = {
      documents: documents.map((doc) => ({
        id: doc.id || null,
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || null,
      })),
    };
    console.log("DocumentsForm passing back:", tempData);
    onBack(tempData);
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      doc_type: "",
      number: "",
      issued_date: "",
      expiry_date: "",
      upload_file: null,
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleChange = (id, field, value) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  return (
    <div className="w-full flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex-1 overflow-y-auto">
          {loading && <p>Loading document types...</p>}
          <div>
            {documents.map((doc) => {
              const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
              return (
                <div key={doc.id} className="border-b first:pt-0 py-5">
                  <div className="sm:flex sm:gap-[10px] sm:justify-start max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:gap-4">
                    {/* Document Type */}
                    <div>
                      <label className="block documents-label">Doc.Type</label>
                      <div className="relative">
                        <select
                          className="appearance-none documents-inputs w-[226px] cursor-pointer"
                          value={doc.doc_type}
                          onChange={(e) =>
                            handleChange(doc.id, "doc_type", e.target.value)
                          }
                          disabled={loading}
                        >
                          <option value="">Select Document</option>
                          {docTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-[12px] h-4 w-4 text-[#000000] pointer-events-none" />
                      </div>
                    </div>

                    {/* Conditional Fields based on docType properties */}
                    {doc.doc_type && docType && (
                      <>
                        {docType.number && (
                          <div>
                            <label className="block documents-label">Number</label>
                            <input
                              type="text"
                              className="documents-inputs w-[168px] outline-none"
                              value={doc.number}
                              onChange={(e) =>
                                handleChange(doc.id, "number", e.target.value)
                              }
                              placeholder="Number"
                            />
                          </div>
                        )}

                        {docType.issue_date && (
                          <div>
                            <label className="block documents-label">Issue Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                className="documents-inputs w-[149px] appearance-none outline-none cursor-pointer"
                                value={doc.issued_date}
                                onChange={(e) =>
                                  handleChange(doc.id, "issued_date", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}

                        {docType.expiry_date && (
                          <div>
                            <label className="block documents-label">Expiry Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                className="documents-inputs w-[150px] appearance-none outline-none cursor-pointer"
                                value={doc.expiry_date}
                                onChange={(e) =>
                                  handleChange(doc.id, "expiry_date", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}

                        {docType.upload_file && (
                          <div className="relative">
                            <label className="block documents-label">Upload Files</label>
                            <input
                              type="file"
                              className="hidden documents-inputs"
                              id={`fileInput-${doc.id}`}
                              onChange={(e) =>
                                handleChange(doc.id, "upload_file", e.target.files[0] || null)
                              }
                            />
                            <label
                              htmlFor={`fileInput-${doc.id}`}
                              className="flex items-center justify-between documents-inputs cursor-pointer w-[161px] !py-2"
                              title={doc.upload_file ? getFileDisplayText(doc.upload_file) : ""}
                            >
                              <span className="text-[#4B465C60] text-sm truncate">
                                {getFileDisplayText(doc.upload_file)}
                              </span>
                              <img
                                src={documentIcon}
                                alt="attach"
                                className="ml-2 h-5 w-5 files-icon"
                              />
                            </label>
                          </div>
                        )}
                      </>
                    )}

                    <div className="col-span-1 flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-2 bg-[#E44747] hover:bg-[#d43939] remove-btn flex justify-center items-center duration-200"
                      >
                        <img src={closeIcon} className="h-3 w-3" alt="remove" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="py-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex justify-center items-center px-5 py-5 text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white add-button duration-200"
            >
              Add
              <img src={plusIcon} className="ml-1 h-5 w-5 add-icon" alt="add" />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-[35px] border-t mt-auto max-[480px]:border-t-0">
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
      </form>
    </div>
  );
};

export default DocumentsForm;