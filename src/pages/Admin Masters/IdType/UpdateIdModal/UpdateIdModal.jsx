import { useEffect, useState } from "react";
import "./UpdateIdModal.css";
import closeIcon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { updateIdType } from "../api";

const UpdateIdModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens or ID type data changes
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-id-type-master" &&
      modalState.data
    ) {
      setTitle(modalState.data.title || "");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-id-type-master" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-id-type-master" ||
    !modalState.data
  ) {
    return null;
  }

  const handleUpdate = async () => {
    // Validation
    if (!title) {
      setFieldError("Please fill the Title field");
      return;
    }

    const idTypeId = modalState.data.id;
    if (!idTypeId) {
      setFieldError("ID Type ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      console.log("Updating ID type:", { idTypeId, title });
      const updatedData = await updateIdType(idTypeId, title);
      console.log("ID Type Updated: ", updatedData);
      toast.success("ID Type updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(updatedData);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating ID type:", err.message);
      const errorMessage = err.message || error || "Failed to update ID type";
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
          <h2 className="update-modal-head">Update ID Type Master</h2>
          <button
            onClick={handleClose}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeIcon} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 pb-1 update-modal-label">Title *</label>
          <input
            type="text"
            className={`input-style border transition-colors duration-200 ${
              fieldError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-700 focus:border-gray-700'
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

        {/* {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )} */}

        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={handleUpdate}
            className={`text-white rounded w-[150px] h-[38px] update-modal-save-btn duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2892CE] hover:bg-[#2276a7]'
            } transition-colors`}
            disabled={loading}
            aria-label="Save ID type"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateIdModal;