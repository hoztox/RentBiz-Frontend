import React, { useEffect, useState } from "react";
import "./updatechargecode.css";
import closeIcon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { chargeCodesApi } from "../../MastersApi";

const UpdateChargeCode = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens or data changes
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-charge-code-type" &&
      modalState.data
    ) {
      setTitle(modalState.data.title || "");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-charge-code-type" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-charge-code-type" ||
    !modalState.data
  ) {
    return null;
  }

  const handleUpdate = async () => {
    // Validation
    if (!title) {
      setFieldError("Please fill the Title field");
      toast.error("Please fill the Title field");
      return;
    }

    const chargeCodeId = modalState.data.id;
    if (!chargeCodeId) {
      setFieldError("Charge Code ID is missing");
      toast.error("Charge Code ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      console.log("Updating charge code:", { chargeCodeId, title });
      const updatedData = await chargeCodesApi.update(chargeCodeId, title);
      console.log("Charge Code Updated: ", updatedData);
      toast.success("Charge Code updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(updatedData);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating charge code:", err.message);
      const errorMessage = err.message || error || "Failed to update charge code";
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
        className="update-id-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="modal-head">Update Charge Code Master</h2>
          <button
            onClick={handleClose}
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
          <div className="text-sm mt-1" style={{ minHeight: "20px" }}>
            {fieldError && <span className="text-[#dc2626]">{fieldError}</span>}
          </div>
        </div>

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            } text-white rounded w-[150px] h-[38px] modal-save-btn duration-200`}
            aria-label="Save charge code"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChargeCode;