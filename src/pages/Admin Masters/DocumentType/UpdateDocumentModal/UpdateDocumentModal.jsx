import React, { useEffect, useState } from "react";
import "./UpdateDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { documentTypesApi } from "../../MastersApi";

const checkboxOptions = [
  { name: "number", label: "Number" },
  { name: "issue_date", label: "Issue Date" },
  { name: "expiry_date", label: "Expiry Date" },
  { name: "upload_file", label: "Upload Files" },
];

const UpdateDocumentModal = () => {
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

  // Reset form state when modal opens or document data changes
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-document-type-master" &&
      modalState.data
    ) {
      setTitle(modalState.data.title || "");
      setCheckboxes({
        number: modalState.data.number || false,
        issue_date: modalState.data.issue_date || false,
        expiry_date: modalState.data.expiry_date || false,
        upload_file: modalState.data.upload_file || false,
      });
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      setFieldError("Please fill the Title field");
      toast.error("Please fill the Title field");
      return;
    }

    const documentTypeId = modalState.data.id;
    if (!documentTypeId) {
      setFieldError("Document Type ID is missing");
      toast.error("Document Type ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const docData = {
        title,
        number: checkboxes.number,
        issue_date: checkboxes.issue_date,
        expiry_date: checkboxes.expiry_date,
        upload_file: checkboxes.upload_file,
      };
      const response = await documentTypesApi.update(documentTypeId, docData);
      toast.success("Document Type updated successfully");
      if (modalState.onSuccess) {
        modalState.onSuccess(response);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating document type:", err);
      setError(err.message || "Failed to update document type");
      toast.error(err.message || "Failed to update document type");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      closeModal();
    }
  };

  // Only render for "update-document-type-master" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-document-type-master" ||
    !modalState.data
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[300px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="update-modal-head">Update Document Type Master</h2>
          <button
            onClick={handleClose}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 pb-1 update-modal-label">Title *</label>
          <input
            type="text"
            className={`input-style border transition-colors duration-200 ${
              fieldError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-gray-700 focus:border-gray-700"
            }`}
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          <div className="flex flex-wrap gap-4 mt-5 justify-between items-center">
            {checkboxOptions.map((option) => (
              <label key={option.name} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name={option.name}
                  checked={checkboxes[option.name] || false}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                  className="form-checkbox"
                />
                <span className="update-modal-label !m-0 cursor-pointer">{option.label}</span>
              </label>
            ))}
          </div>
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
            {error && <span className="text-[#dc2626]">{error}</span>}
          </div>
        </div>

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`text-white rounded w-[150px] h-[38px] update-modal-save-btn duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            }`}
            aria-label="Save Document type"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDocumentModal;