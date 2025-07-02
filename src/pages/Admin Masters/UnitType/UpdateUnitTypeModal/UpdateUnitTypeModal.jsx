import { useEffect, useState } from "react";
import "./UpdateUnitTypeModal.css";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { unitTypesApi } from "../../MastersApi"; // Updated import
import { X } from "lucide-react";

const UpdateUnitTypeModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  // Reset form state when modal opens or unit data changes
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-unit-type-master" &&
      modalState.data
    ) {
      setTitle(modalState.data.title || "");
      setError(null);
      setFieldError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Only render for "update-unit-type-master" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-unit-type-master" ||
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

    const unitTypeId = modalState.data.id;
    if (!unitTypeId) {
      setFieldError("Unit Type ID is missing");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldError(null);

    try {
      console.log("Updating unit type:", { unitTypeId, title });
      const updatedData = await unitTypesApi.update(unitTypeId, title);
      console.log("Unit Type Updated: ", updatedData);
      toast.success("Unit Type updated successfully");

      if (modalState.onSuccess) {
        modalState.onSuccess(updatedData);
      }
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error("Error updating unit type:", err.message);
      const errorMessage = err.message || error || "Failed to update unit type";
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
        className="update-unit-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="update-modal-head">Update Unit Type Master</h2>
          <button
            onClick={handleClose}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 update-modal-label">Title *</label>
          <input
            type="text"
            className={`w-full border rounded-md mt-1 px-3 py-2 focus:outline-none transition-colors duration-200 update-modal-input-style ${
              fieldError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-[#E9E9E9] focus:ring-gray-500 focus:border-gray-500"
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

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`text-white rounded w-[150px] h-[38px] update-modal-save-btn duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            }`}
            aria-label="Save unit type"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUnitTypeModal;
