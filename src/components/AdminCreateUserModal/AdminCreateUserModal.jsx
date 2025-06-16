import React, { useState, useRef } from "react";
import "./AdminCreateUserModal.css";
import cancelIcon from "../../assets/Images/Admin Create Modal/cancelIcon.svg";
import addImageIcon from "../../assets/Images/Admin Create Modal/addImageIcon.svg";
import { ChevronDown } from "lucide-react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateUserModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
    password: "",
    confirm_password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
    password: "",
    confirm_password: "",
  });

  if (!modalState.isOpen || modalState.type !== "user-create") return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "username" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Real-time username validation
    if (name === "username" && value.trim()) {
      if (/\s/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          username: "Username cannot contain spaces",
        }));
      } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(value.toLowerCase())) {
        setFieldErrors((prev) => ({
          ...prev,
          username:
            "Username must contain at least one letter and only letters, numbers, underscores, hyphens, or dots",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, username: "" }));
      }
    } else if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim()) {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|io|co|us|ca|uk|au|de|fr|jp|cn|in)$/;
      if (!emailRegex.test(formData.email)) {
        setFieldErrors((prev) => ({
          ...prev,
          email:
            "Please enter a valid email address with a recognized domain (e.g., user@domain.com)",
        }));
      } else if (formData.email.length > 254) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Email address is too long (max 254 characters)",
        }));
      } else if (/\.\./.test(formData.email)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Email cannot contain consecutive dots",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
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
    } else {
      if (/\s/.test(formData.username)) {
        errors.username = "Username cannot contain spaces";
        isValid = false;
      } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(formData.username)) {
        errors.username =
          "Username must contain at least one letter and only letters, numbers, underscores, hyphens, or dots";
        isValid = false;
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|io|co|us|ca|uk|au|de|fr|jp|cn|in)$/;
      if (!emailRegex.test(formData.email)) {
        errors.email =
          "Please enter a valid email address with a recognized domain (e.g., user@domain.com)";
        isValid = false;
      } else if (formData.email.length > 254) {
        errors.email = "Email address is too long (max 254 characters)";
        isValid = false;
      } else if (/\.\./.test(formData.email)) {
        errors.email = "Email cannot contain consecutive dots";
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
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";
        isValid = false;
      }
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
    if (!validateFields()) {
      if (fieldErrors.username) {
        toast.error(fieldErrors.username);
      } else if (fieldErrors.email) {
        toast.error(fieldErrors.email);
      }
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating user...");

    try {
      const companyId = getUserCompanyId();
      const formDataToSend = new FormData();
      formDataToSend.append("company_id", companyId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirm_password", formData.confirm_password);
      formDataToSend.append("user_role", formData.user_role || null);

      if (profileImage) {
        formDataToSend.append("company_logo", profileImage);
      }

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
        toast.success("User created successfully!", { id: toastId });
        triggerRefresh();
        closeModal();
        navigate("/admin/users-manage");
        console.log("User Created", response.data);

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
          user_role: "",
          password: "",
          confirm_password: "",
        });
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = "An error occurred while creating the user.";

        if (error.response.status === 400) {
          if (errorData.username) {
            setFieldErrors((prev) => ({
              ...prev,
              username:
                errorData.username[0] || "This username is already taken.",
            }));
            errorMessage = "This username is already taken.";
          } else if (errorData.email) {
            setFieldErrors((prev) => ({
              ...prev,
              email: errorData.email[0] || "This email is already in use.",
            }));
            errorMessage = "This email is already in use.";
          } else {
            errorMessage =
              errorData.message ||
              errorData.error ||
              `Error: ${error.response.status}`;
          }
        } else {
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Error: ${error.response.status}`;
        }

        toast.error(errorMessage, { id: toastId });
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            id: toastId,
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto md:h-[600px] flex flex-col">
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

        <div className="absolute top-[50px] md:top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="relative top-[-30px] w-[100px] md:w-[123px] h-[100px] md:h-[123px] bg-[#F3F3F3] rounded-full border overflow-hidden">
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

        <div className="px-4 md:px-6 pt-4 md:pt-0 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 mt-[40px] md:mt-[68px] overflow-y-auto flex-1">
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Name *
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

          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Username *
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

          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleEmailBlur}
              placeholder="Enter Email"
              className={`input-style ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              required
              aria-describedby="email-error"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-red-600 text-xs mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mt-[-5px]">
              Role *
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
            {fieldErrors.user_role && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.user_role}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Password *
            </label>
            <div className="relative group">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className={`input-style ${
                  fieldErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-gray-700"
                } pr-10`}
                required
                aria-describedby="password-error"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </span>
              <div className="absolute hidden group-hover:block group-focus-within:block bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-1 w-[300px] z-10">
                Password must be at least 8 characters long and include at least
                one uppercase letter, one lowercase letter, one number, and one
                special character (!@#$%^&*).
              </div>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-red-600 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Enter Confirm Password"
                className={`input-style ${
                  fieldErrors.confirm_password
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-gray-700"
                } pr-10`}
                required
                aria-describedby="confirm-password-error"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? (
                  <IoEyeOff size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </span>
            </div>
            {fieldErrors.confirm_password && (
              <p
                id="confirm-password-error"
                className="text-red-600 text-xs mt-1"
              >
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>
        </div>

        <div className="px-4 md:px-6 mt-6 md:mt-1 mb-10 flex justify-end">
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
