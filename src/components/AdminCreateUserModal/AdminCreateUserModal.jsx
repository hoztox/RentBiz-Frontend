import React, { useState, useRef } from "react";
import "./AdminCreateUserModal.css";
import cancelIcon from "../../assets/Images/Admin Create Modal/cancelIcon.svg";
import addImageIcon from "../../assets/Images/Admin Create Modal/addImageIcon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const AdminCreateUserModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const getUserCompanyId = () => {
    // First check if company_id is stored directly
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;
    // If user data exists with company_id
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      // Try to get company_id from user data that was stored during login
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);  // Ensure it's valid JSON
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  // Form state - updated to match backend model
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
    password: "",
    confirm_password: "",
  });

  // Field errors state
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
    password: "",
    confirm_password: "",
  });

  // Early return AFTER hooks
  if (!modalState.isOpen || modalState.type !== "user-create") return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (optional - e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
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



  const validateFields = () => {
    const errors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Role validation
    if (!formData.user_role) {
      errors.user_role = "Role is required";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      errors.confirm_password = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend
      const companyId = getUserCompanyId();
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('company_id', companyId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirm_password', formData.confirm_password);
      formDataToSend.append('user_role', formData.user_role || null);
      
      // Add company logo if selected
      if (profileImage) {
        formDataToSend.append('company_logo', profileImage);
      }

      // API call to create user
      const response = await axios.post(
        `${BASE_URL}/company/users/create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("User created successfully!");
        triggerRefresh();
        closeModal();
        navigate("/admin/users-manage");
        console.log("User Created", response.data)

        // Reset form and errors
        setFormData({
          name: "",
          username: "",
          email: "",
          user_role: "",
          password: "",
          confirm_password: "",
        });
        setFieldErrors({
          name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error: ${error.response.status}`;
        alert(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="h-[100px] md:h-[133px] md:bg-[#F8F9FA] rounded-t-[6px] flex justify-between items-start px-4 md:px-6 pt-6">
          <h2 className="absolute top-[30px] md:top-[40px] left-4 md:left-[30px] heading-text">
            Create User
          </h2>
          <button
            className="close-button hover:bg-gray-200 duration-200"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <img src={cancelIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="absolute top-[50px] md:top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="relative top-[-30px] w-[100px] md:w-[123px] h-[100px] md:h-[123px] bg-[#F3F3F3] rounded-full border overflow-hidden">
            {/* Display uploaded image preview */}
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover rounded-full"
              />
            )}
            
            {/* Always show the bottom section with upload option */}
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
            
            {/* Remove image button - only show when image is selected */}
          
            
            {/* Hidden file input */}
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
        <div className="px-4 md:px-6 pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 mt-[60px] md:mt-[68px] overflow-y-auto flex-1">
          {/* Name */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              className={`input-style ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Username*
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter Username"
              className={`input-style ${
                fieldErrors.username
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className={`input-style ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mt-[-5px]">
              Role*
            </label>
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleInputChange}
              className={`input-style select custom-select ${
                fieldErrors.user_role
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              onFocus={() => setIsRoleSelectOpen(true)}
              onBlur={() => setIsRoleSelectOpen(false)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Store">Store</option>
            </select>

            <ChevronDown
              className={`absolute right-[20px] md:right-[15px] top-[36px] md:top-[33px] text-gray-400 pointer-events-none transition-transform duration-300 drop-down-icon ${
                isRoleSelectOpen ? "rotate-180" : "rotate-0"
              }`}
              width={20}
              height={20}
              color="#201D1E"
            />

            {/* Role field error */}
            {fieldErrors.user_role && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.user_role}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Password*
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              className={`input-style ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Confirm Password*
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className={`input-style ${
                fieldErrors.confirm_password
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
            />
            {fieldErrors.confirm_password && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="px-4 md:px-6 mt-6 md:mt-6 mb-6 flex justify-end">
          <button
            className={`create-user-button duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#076094]"
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUserModal;