import { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../../utils/config";

const UpdateDocumentModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Function to get company ID based on user role
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

  // Function to get relevant user ID based on role
  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    if (role === "company") {
      const companyId = localStorage.getItem("company_id");
      if (companyId) return companyId;
    }
    return null;
  };

  // Reset form state when modal opens or document data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-document-type-master" && modalState.data) {
      setTitle(modalState.data.title || "");
      setCompanyId(getUserCompanyId());
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-document-type-master" type and valid data
  if (!modalState.isOpen || modalState.type !== "update-document-type-master" || !modalState.data) {
    return null;
  }

  const handleUpdate = async () => {
    // Validation
    if (!title) {
      setFieldError("Please fill the Title field");
      return;
    }

    if (!companyId) {
      setFieldError("Company ID is missing or invalid");
      return;
    }

    const documentTypeId = modalState.data.id;
    if (!documentTypeId) {
      setFieldError("Document Type ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      const userId = getRelevantUserId();
      console.log("Update payload:", { title, company: companyId, user: userId, id: documentTypeId });

      const response = await axios.put(
        `${BASE_URL}/company/doc_type/${documentTypeId}/`,
        {
          title,
          company: companyId,
          user: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update document type");
      }

      console.log("Document Type Updated: ", response.data);
      toast.success("Document Type updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(response.data);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating document type:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.company_id ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update document type";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
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
          <label className="block pt-2 update-modal-label">Title*</label>
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
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
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