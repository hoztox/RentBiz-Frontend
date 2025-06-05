import React, { useEffect, useState } from "react";
import "./CreateUnitTypeModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { toast, Toaster } from "react-hot-toast";
import { useModal } from "../../../../context/ModalContext";
import { unitTypesApi } from "../../MastersApi"; // Updated import

const CreateUnitTypeModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-unit-type-master") {
      setTitle("");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type]);

  // Only render for "create-unit-type-master" type
  if (!modalState.isOpen || modalState.type !== "create-unit-type-master") {
    return null;
  }

  const handleSave = async () => {
    if (!title) {
      setFieldError("Please fill the Title field");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);
    try {
      console.log("Creating unit type with title:", title);
      await unitTypesApi.create(title); // Updated API call
      console.log("New Unit Type Created:", { title });
      toast.success("Unit Type created successfully");
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.message || error);
      setError("Failed to save unit type: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="create-unit-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="modal-head">Create New Unit Type Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 tenancy-modal-label">Title *</label>
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
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200"
            aria-label="Save unit type"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUnitTypeModal;