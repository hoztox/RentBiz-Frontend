import React, { useEffect, useState } from "react";
import "./AddDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { documentTypesApi } from "../../MastersApi";

const checkboxOptions = [
  { name: "number", label: "Number" },
  { name: "issueDate", label: "Issue Date" },
  { name: "expiryDate", label: "Expiry Date" },
  { name: "uploadFiles", label: "Upload Files" }
];

const AddDocumentModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [checkboxes, setCheckboxes] = useState(
    checkboxOptions.reduce((acc, option) => {
      acc[option.name] = false;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-document-type-master") {
      setTitle("");
      setCheckboxes(
        checkboxOptions.reduce((acc, option) => {
          acc[option.name] = false;
          return acc;
        }, {})
      );
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setFieldError("Please fill the Title field");
      toast.error("Please fill the Title field");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const docData = { 
        title,
        ...Object.fromEntries(
          Object.entries(checkboxes).map(([key, value]) => [
            `has${key.charAt(0).toUpperCase() + key.slice(1)}`,
            value
          ])
      )};
      await documentTypesApi.create(docData);
      toast.success("Document Type created successfully");
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error creating document type:", err);
      setError(err.message);
      toast.error(err.message || error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!modalState.isOpen || modalState.type !== "create-document-type-master") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="add-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[300px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="modal-head">Create New Document Type Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 tenancy-modal-label">
            Title *
          </label>
          <input
            type="text"
            className={`input-style border transition-colors duration-200 ${
              fieldError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-gray-700 focus:border-gray-700"
            }`}
            placeholder="Enter Document Type Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
          
          <div className="flex flex-wrap gap-4 mt-5 justify-between items-center">
            {checkboxOptions.map((option) => (
              <label key={option.name} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={option.name}
                  checked={checkboxes[option.name]}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                  className="form-checkbox"
                />
                <span className="tenancy-modal-label !m-0 cursor-pointer">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200 ${
              loading ? "disabled:bg-gray-400 disabled:cursor-not-allowed" : ""
            }`}
            aria-label="Save Document Type"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;