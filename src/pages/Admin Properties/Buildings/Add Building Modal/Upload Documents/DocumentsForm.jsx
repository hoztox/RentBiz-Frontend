import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import documentIcon from "../../../../../assets/Images/Admin Units/document-icon.svg";
import closeIcon from "../../../../../assets/Images/Admin Units/close-icon-white.svg";
import plusIcon from "../../../../../assets/Images/Admin Units/plus-icon-black.svg";
import { BASE_URL } from "../../../../../utils/config";
import "./documentform.css";
import axios from "axios";

const DocumentsForm = ({ onNext, onBack, initialData }) => {
  // Ensure initialData.documents is an array
  const safeInitialDocuments = Array.isArray(initialData?.documents)
    ? initialData.documents
    : Array.isArray(initialData?.documents?.documents)
    ? initialData.documents.documents
    : [];

  const [documents, setDocuments] = useState(
    safeInitialDocuments.length > 0
      ? safeInitialDocuments.map((doc, index) => ({
          id: index + 1,
          doc_type: doc.doc_type || "",
          number: doc.number || "",
          issued_date: doc.issued_date || "",
          expiry_date: doc.expiry_date || "",
          upload_file: doc.upload_file || [],
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

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");

    if (role === "company") {
      return storedCompanyId;
    } else if (role === "user" || role === "admin") {
      try {
        return storedCompanyId ? JSON.parse(storedCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
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
    // Validate documents: ensure all fields are filled if a document exists
    const validDocuments = documents.filter(
      (doc) =>
        doc.doc_type &&
        doc.number &&
        doc.issued_date &&
        doc.expiry_date &&
        doc.upload_file?.length > 0
    );

    if (documents.length > 0 && validDocuments.length === 0) {
      setError("Please fill all required document fields or remove incomplete documents.");
      return;
    }

    const tempData = {
      documents: validDocuments.map((doc) => ({
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || [],
      })),
    };
    console.log("Temporarily saved documents data:", tempData);
    onNext(tempData);
  };

  const handleBack = () => {
    const tempData = {
      documents: documents.map((doc) => ({
        doc_type: parseInt(doc.doc_type) || null,
        number: doc.number || null,
        issued_date: doc.issued_date || null,
        expiry_date: doc.expiry_date || null,
        upload_file: doc.upload_file || [],
      })),
    };
    console.log("Passing documents data back:", tempData);
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
            {documents.map((doc) => (
              <div key={doc.id} className="border-b first:pt-0 py-5">
                <div className="flex gap-[10px] justify-between">
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
                        {docTypes.length === 0 && !loading && (
                          <>
                            <option value="1">License</option>
                            <option value="2">Certificate</option>
                            <option value="3">Permit</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-2 top-[12px] h-4 w-4 text-[#000000] pointer-events-none" />
                    </div>
                  </div>

                  {/* Conditional Fields */}
                  {doc.doc_type && (
                    <>
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
                        >
                          <span className="text-[#4B465C60] text-sm truncate">
                            {doc.upload_file.length > 0
                              ? `${doc.upload_file.length} file(s)`
                              : "Attach Files"}
                          </span>
                          <img
                            src={documentIcon}
                            alt="attach"
                            className="ml-2 h-5 w-5 files-icon"
                          />
                        </label>
                      </div>
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
            ))}
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

        <div className="flex justify-end gap-4 pt-[35px] border-t mt-auto">
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