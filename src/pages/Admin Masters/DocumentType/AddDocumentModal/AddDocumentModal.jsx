import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { BASE_URL } from "../../../../utils/config";

const AddDocumentModal = ({
  onError = null
}) => {
  const { modalState, closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen) {
      setTitle("");
    }
  }, [modalState.isOpen]);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }

    return null;
  };

  // const getRelevantUserId = () => {
  //   const userRole = localStorage.getItem("role");

  //   if (userRole === "user") {
  //     const userId = localStorage.getItem("user_id");
  //     if (userId) return userId;
  //   }

  //   const companyId = localStorage.getItem("company_id");
  //   if (companyId) return companyId;

  //   return null;
  // };

  //  const companyId = getUserCompanyId();

  // Only render for "create-document-type-master" type
  if (!modalState.isOpen || modalState.type !== "create-document-type-master") {
    return null;
  }

  const handleSave = async () => {
    // Use props values if provided, otherwise use form input values

    if (!title) {
      const errorMessage = "Please fill in all required fields";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }

    setIsLoading(true);

    try {
      const companyId = getUserCompanyId();
      // const userId = getRelevantUserId();

      const payload = {
        // user: userId,
        company: companyId,
        title: title
      };

      console.log("Payload to be sent:", payload);

      const response = await axios.post(`${BASE_URL}/company/doc_type/create/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Document type created successfully:", response.data);


      closeModal();

    } catch (error) {
      console.error("Error creating document type:", error);

      let errorMessage = "Failed to create document type. Please try again.";

      if (error.response?.data) {
        // Handle specific backend error messages
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = `Network error: ${error.message}`;
      }

      if (onError) {
        onError(errorMessage, error);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="add-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto p-6">
        <h2 className="modal-head mt-4 mb-6">
          Create New Document Type Master
        </h2>
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 close-btn duration-200"
          disabled={isLoading}
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 input-style"
              placeholder="Enter Document Type Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#2892CE] hover:bg-[#2276a7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded w-[150px] h-[38px] modal-save-btn duration-200"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;