import { useState } from "react";
import { ChevronDown } from "lucide-react";
import documentIcon from "../../../../../assets/Images/Admin Units/document-icon.svg";
// import calendarIcon from '../../../../../assets/Images/Admin Units/calendar-icon.svg';
import closeIcon from "../../../../../assets/Images/Admin Units/close-icon-white.svg";
import plusIcon from "../../../../../assets/Images/Admin Units/plus-icon-black.svg";
import "./documentform.css";

const DocumentsForm = ({ onNext, onBack }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "",
      number: "",
      issueDate: "",
      expiryDate: "",
      files: [],
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ documentsUploaded: true });
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

  return (
    <div className="w-full flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* Document List */}
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
                      <ChevronDown className="absolute right-2 top-[12px] h-4 w-4 text-[#000000] pointer-events-none" />
                    </div>
                  </div>

                  {/* Conditional Fields */}
                  {doc.type && (
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
                        <label className="block documents-label">
                          Issue Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-[149px] appearance-none outline-none cursor-pointer"
                            value={doc.issueDate}
                            onChange={(e) =>
                              handleChange(doc.id, "issueDate", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block documents-label">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="documents-inputs w-[150px] appearance-none outline-none cursor-pointer"
                            value={doc.expiryDate}
                            onChange={(e) =>
                              handleChange(doc.id, "expiryDate", e.target.value)
                            }
                          />
                        </div>
                      </div>

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
                    </>
                  )}

                  <div className="col-span-1 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="p-2 bg-[#E44747] hover:bg-[#d43939] remove-btn flex justify-center items-center duration-200"
                    >
                      <img src={closeIcon} className="h-[15px] w-[15px]" alt="remove" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Document Button */}
          <div className="px-6 py-4 flex justify-end">
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

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 p-6 border-t mt-auto">
          <button
            type="button"
            className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
            onClick={onBack}
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
