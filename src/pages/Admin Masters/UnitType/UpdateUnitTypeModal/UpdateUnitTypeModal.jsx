import { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateUnitTypeModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast"; 
import { BASE_URL } from "../../../../utils/config";

const UpdateUnitTypeModal = () => {
  const { modalState, closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to get company ID based on user role
  const getUserCompanyId = () => {
  const role = localStorage.getItem("role")?.toLowerCase();

  if (role === "company") {
    // When a company logs in, their own ID is stored as company_id
    return localStorage.getItem("company_id");
  } else if (role === "user" || role === "admin") {
    // When a user logs in, company_id is directly stored
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

  // Reset form state when modal opens or unit data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.data) {
      setTitle(modalState.data.title || "");
      // Get company ID from localStorage based on user role
      const userCompanyId = getUserCompanyId();
      setCompanyId(userCompanyId);
      setError("");
    } else {
      setTitle("");
      setCompanyId(null);
      setError("");
    }
  }, [modalState.isOpen, modalState.data]);

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
      setError("Please fill the Title field");
      toast.error("Please fill the Title field");
      return;
    }

    if (!companyId) {
      setError("Company ID is required");
      toast.error("Company ID is required");
      return;
    }

    // Get unit type ID from modalState.data
    const unitTypeId = modalState.data.id;
    if (!unitTypeId) {
      setError("Unit Type ID is missing");
      toast.error("Unit Type ID is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = {
        company: companyId,
        title: title,
      };

      // Make API call to update unit type
      const response = await axios.put(
        `${BASE_URL}/company/unit-types/${unitTypeId}/`, // Use unitTypeId
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log("Unit Type Updated Successfully: ", response.data);
      toast.success("Unit Type updated successfully");

      // Optional: Call a callback function to refresh parent data
      if (modalState.onSuccess) {
        modalState.onSuccess(response.data);
      }

      closeModal();
    } catch (error) {
      console.error("Error updating unit type:", error);

      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error: ${error.response.status}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
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
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 update-modal-label">Title*</label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 update-modal-input-style"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

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