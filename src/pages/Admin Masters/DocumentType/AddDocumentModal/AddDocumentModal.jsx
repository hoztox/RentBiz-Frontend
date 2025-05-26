import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { BASE_URL } from "../../../../utils/config";

const AddDocumentModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-document-type-master") {
      setTitle("");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type]);

  // Only render for "create-document-type-master" type
  if (!modalState.isOpen || modalState.type !== "create-document-type-master") {
    return null;
  }

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }

    return null;
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    return null;
  };

  const handleSave = async () => {
    if (!title) {
      setFieldError("Please fill the Title field");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      console.log("Request payload:", { title, companyId, userId });

      if (!companyId) {
        throw new Error("Company ID is missing or invalid");
      }

      const response = await axios.post(
        `${BASE_URL}/company/doc_type/create/`,
        {
          title,
          company: companyId,
          user: userId, // Nullable in backend, so safe to send
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create document type");
      }

      console.log("New Document Type Created: ", response.data);
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        "Failed to save document type: " +
          (err.response?.data?.detail ||
            err.response?.data?.company ||
            err.response?.data?.user ||
            err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="add-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
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
            Title <span className="text-red-500">*</span>
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
            maxLength={100} // Matches backend max_length
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
            {error && <span className="text-[#dc2626]">{error}</span>}
          </div>
        </div>

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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