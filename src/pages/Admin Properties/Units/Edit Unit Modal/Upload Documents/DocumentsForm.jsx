import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import documentIcon from "../../../../../assets/Images/Admin Units/document-icon.svg";
import closeIcon from "../../../../../assets/Images/Admin Units/close-icon-white.svg";
import plusIcon from "../../../../../assets/Images/Admin Units/plus-icon-black.svg";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import "./documentform.css";

const DocumentsForm = ({ onNext, onBack, initialData }) => {
  const safeInitialDocuments = Array.isArray(initialData?.documents)
    ? initialData.documents.map((doc, index) => ({
        id: doc.id || index + 1,
        doc_type: doc.doc_type || "",
        number: doc.number || "",
        issued_date: doc.issued_date || "",
        expiry_date: doc.expiry_date || "",
        upload_file: Array.isArray(doc.upload_file) ? doc.upload_file : [],
        existing_files: Array.isArray(doc.existing_files) ? doc.existing_files : [],
        has_new_files: false,
      }))
    : [{
        id: 1,
        doc_type: "",
        number: "",
        issued_date: "",
        expiry_date: "",
        upload_file: [],
        existing_files: [],
        has_new_files: false,
      }];

  const [documents, setDocuments] = useState(safeInitialDocuments);
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to display file names
  const getFileDisplayText = (files, existingFiles) => {
    const allFiles = [...(files || []), ...(existingFiles || [])];
    
    if (!allFiles || allFiles.length === 0) {
      return "Attach Files";
    }
    
    // Helper function to get file name from file object or URL/path
    const getFileName = (file) => {
      if (file && file.name) {
        // New uploaded file
        return file.name;
      } else if (typeof file === 'string') {
        // Existing file as URL or path - extract filename
        const parts = file.split('/');
        return parts[parts.length - 1] || file;
      } else if (file && file.upload_file) {
        // Nested structure - extract filename
        const fileName = file.upload_file;
        if (typeof fileName === 'string') {
          const parts = fileName.split('/');
          return parts[parts.length - 1] || fileName;
        }
      }
      return 'Unknown file';
    };
    
    if (allFiles.length === 1) {
      return getFileName(allFiles[0]);
    }
    
    if (allFiles.length === 2) {
      return `${getFileName(allFiles[0])}, ${getFileName(allFiles[1])}`;
    }
    
    // For more than 2 files, show first file name and count
    return `${getFileName(allFiles[0])} and ${allFiles.length - 1} more`;
  };

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
        setError("Failed to load document types.");
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
        (doc.upload_file?.length > 0 || doc.existing_files?.length > 0)
    );

    const tempData = {
      documents: validDocuments.map((doc) => ({
        id: doc.id || null,
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || [],
        existing_files: doc.existing_files || [],
        has_new_files: doc.has_new_files || false,
      })),
    };
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
        upload_file: doc.upload_file || [],
        existing_files: doc.existing_files || [],
        has_new_files: doc.has_new_files || false,
      })),
    };
    onBack(tempData);
  };

  const handleAddDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      doc_type: "",
      number: "",
      issued_date: "",
      expiry_date: "",
      upload_file: [],
      existing_files: [],
      has_new_files: false,
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleChange = (id, field, value) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              [field]: value,
              ...(field === "upload_file" && { has_new_files: value.length > 0 }),
            }
          : doc
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
                            <option key={type.id} value={type.id}>{type.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-[12px] h-4 w-4 text-[#000000] pointer-events-none" />
                      </div>
                    </div>
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
                              multiple
                              onChange={(e) =>
                                handleChange(doc.id, "upload_file", Array.from(e.target.files))
                              }
                            />
                            <label
                              htmlFor={`fileInput-${doc.id}`}
                              className="flex items-center justify-between documents-inputs cursor-pointer w-[161px] !py-2"
                              title={getFileDisplayText(doc.upload_file, doc.existing_files)}
                            >
                              <span className="text-[#4B465C60] text-sm truncate">
                                {getFileDisplayText(doc.upload_file, doc.existing_files)}
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