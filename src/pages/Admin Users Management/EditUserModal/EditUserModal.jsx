import React, { useState, useRef } from "react";
import axios from "axios";
import "./EditUserModal.css";
import closeicon from "../../../assets/Images/Admin Users Management/close-icon.svg";
import addImageIcon from "../../../assets/Images/Admin Users Management/addImageIcon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../utils/config";

const EditUserModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // For new uploads
  const [imagePreview, setImagePreview] = useState(
    modalState.data?.profile_image
      ? modalState.data.profile_image.startsWith("http")
        ? modalState.data.profile_image
        : `${BASE_URL}${modalState.data.profile_image}`
      : null
  ); // Initialize with existing image, handle relative URLs
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize form with user data
  const userData = modalState.data || {};
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.username || "",
    role: userData.user_role || "",
  });

  // Debug modalState.data
  console.log("modalState.data:", modalState.data);

  // Only render for "user-update" type
  if (!modalState.isOpen || modalState.type !== "user-update") return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      setError("Please fill all required fields");
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.email); // Mapping email to username
      formDataToSend.append("user_role", formData.role); // Mapping role to user_role
      if (profileImage) {
        formDataToSend.append("company_logo", profileImage); // Backend expects 'company_logo'
      }

      const response = await axios.put(
        `${BASE_URL}/company/users/${userData.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("User updated successfully");
        triggerRefresh(); // Trigger the refresh
        closeModal();
        navigate("/admin/users-manage");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update user. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 modal-overlay">
      <div className="edit-modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto md:h-[464px] flex flex-col">
        {/* Header */}
        <div className="h-[100px] md:h-[133px] md:bg-[#F8F9FA] rounded-t-[6px] flex justify-between items-start px-4 md:px-6 pt-6">
          <h2 className="absolute top-[30px] md:top-[40px] left-4 md:left-[30px] heading-text">
            Edit User
          </h2>
          <button
            className="close-button hover:bg-gray-200 duration-200"
            onClick={closeModal}
            aria-label="Close modal"
            disabled={loading}
          >
            <img src={closeicon} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="absolute top-[50px] md:top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="relative top-[-30px] w-[100px] md:w-[123px] h-[100px] md:h-[123px] bg-gray-100 rounded-full border overflow-hidden">
            {/* Display uploaded or existing image preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-full"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[30px] md:h-[37px] bg-[#201D1E] rounded-b-full"></div>
            <div
              className="absolute bottom-[6px] md:bottom-[8px] left-1/2 transform -translate-x-1/2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleImageClick}
            >
              <img
                src={addImageIcon}
                alt="Add image"
                className="h-[18px] md:h-[22px] w-[18px] md:w-[22px]"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 mt-[60px] md:mt-[68px]">
          {/* Name */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              className="input-style focus:border-gray-700"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              className="input-style focus:border-gray-700"
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px]">
              Role*
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="input-style select custom-select focus:border-gray-700"
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              disabled={loading}
            >
              <option
                value=""
                disabled
                style={{
                  color: "#CFCFCF",
                  fontSize: "15px",
                  fontWeight: "400",
                  fontFamily: "Inter Tight",
                }}
              >
                Choose
              </option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Store">Store</option>
            </select>
            <ChevronDown
              className={`absolute right-[20px] md:right-[25px] top-[36px] md:top-[40px] text-gray-400 pointer-events-none transition-transform duration-300 drop-down-icon ${
                isSelectOpen ? "rotate-180" : "rotate-0"
              }`}
              width={20}
              height={20}
              color="#201D1E"
            />
          </div>

          {/* Change Password Button */}
          <div>
            <button
              className="reset-button hover:bg-[#1458A2] hover:text-white duration-200"
              disabled={loading}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 md:px-6 mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Edit User Button */}
        <div className="px-4 md:px-6 mt-6 md:mt-8 md:mr-[8px] mb-6 md:mb-6 flex justify-end">
          <button
            className={`bg-[#2892CE] hover:bg-[#076094] duration-200 edit-user-button ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Edit User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;