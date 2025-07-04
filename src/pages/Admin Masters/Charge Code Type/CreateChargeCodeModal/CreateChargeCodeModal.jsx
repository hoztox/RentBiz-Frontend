import React, { useEffect, useState } from "react";
import "./createchargecodemodal.css";
import closeIcon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { toast, Toaster } from "react-hot-toast";
import { useModal } from "../../../../context/ModalContext";
import { chargeCodesApi } from "../../MastersApi";

const CreateChargeCodeModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-charge-code-type") {
      setTitle("");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type]);

  // Only render for "create-charge-code-type"
  if (!modalState.isOpen || modalState.type !== "create-charge-code-type") {
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
      console.log("Creating charge code with title:", title);
      await chargeCodesApi.create(title);
      toast.success("Charge Code created successfully");
      console.log("New Charge Code Created:", { title });
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error:", err.message || error);
      setError("Failed to save charge code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="create-id-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="modal-head">Create New Charge Code Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeIcon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 pb-1 modal-label">Title *</label>
          <input
            type="text"
            className={`input-style border transition-colors duration-200 ${fieldError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-gray-700 focus:border-gray-700"
              }`}
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
          </div>
        </div>

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleSave}
            className={`${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
              } text-white rounded w-[150px] h-[38px] modal-save-btn duration-200`}
            aria-label="Save charge code"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChargeCodeModal;