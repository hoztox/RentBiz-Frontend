import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./EditUserModal.css";
import addImageIcon from "../../../assets/Images/Admin Users Management/addImageIcon.svg";
import { ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../../utils/config";

const EditUserModal = () => {
  const { t } = useTranslation();
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize form with empty defaults
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    username: "",
    email: "",
    user_role: "",
  });

  // Debug modalState
  console.log("modalState:", modalState);

  // Update form data and image preview when modalState.data or modalState.isOpen changes
  useEffect(() => {
    console.log("modalState.data in useEffect:", modalState.data);
    if (modalState.isOpen && modalState.data) {
      const userData = modalState.data;
      if (!userData.email) {
        console.warn("Warning: modalState.data.email is missing:", userData); // Debug log
      }
      setFormData({
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        user_role: userData.user_role || "",
      });
      console.log("Setting formData:", {
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        user_role: userData.user_role || "",
      });
      setImagePreview(
        userData.company_logo || userData.profile_image
          ? (userData.company_logo || userData.profile_image).startsWith("http")
            ? userData.company_logo || userData.profile_image
            : `${BASE_URL}${userData.company_logo || userData.profile_image}`
          : null
      );
    }
  }, [modalState.data, modalState.isOpen]);

  // Log formData changes
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  // Only render for "user-update" type
  if (!modalState.isOpen || modalState.type !== "user-update") {
    console.log("Modal not rendering:", {
      isOpen: modalState.isOpen,
      type: modalState.type,
    });
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "username" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Real-time username validation
    if (name === "username" && value.trim()) {
      if (/\s/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          username: t("edit_user_modal.errors.username_no_spaces"),
        }));
      } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(value.toLowerCase())) {
        setFieldErrors((prev) => ({
          ...prev,
          username: t("edit_user_modal.errors.username_format"),
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
          email: t("edit_user_modal.errors.email_invalid"),
        }));
      } else if (formData.email.length > 254) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("edit_user_modal.errors.email_too_long"),
        }));
      } else if (/\.\./.test(formData.email)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("edit_user_modal.errors.email_consecutive_dots"),
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
        toast.error(t("edit_user_modal.errors.invalid_image"));
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(t("edit_user_modal.errors.image_too_large"));
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

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t("edit_user_modal.errors.name_required");
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = t("edit_user_modal.errors.username_required");
      isValid = false;
    } else if (/\s/.test(formData.username)) {
      errors.username = t("edit_user_modal.errors.username_no_spaces");
      isValid = false;
    } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(formData.username)) {
      errors.username = t("edit_user_modal.errors.username_format");
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t("edit_user_modal.errors.email_required");
      isValid = false;
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|io|co|us|ca|uk|au|de|fr|jp|cn|in)$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = t("edit_user_modal.errors.email_invalid");
        isValid = false;
      } else if (formData.email.length > 254) {
        errors.email = t("edit_user_modal.errors.email_too_long");
        isValid = false;
      } else if (/\.\./.test(formData.email)) {
        errors.email = t("edit_user_modal.errors.email_consecutive_dots");
        isValid = false;
      }
    }

    // Role validation
    if (!formData.user_role) {
      errors.user_role = t("edit_user_modal.errors.role_required");
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
      } else if (fieldErrors.user_role) {
        toast.error(fieldErrors.user_role);
      }
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(t("edit_user_modal.messages.updating_user"));

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("user_role", formData.user_role);
      if (profileImage) {
        formDataToSend.append("company_logo", profileImage);
      }

      const response = await axios.put(
        `${BASE_URL}/company/users/${modalState.data.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(t("edit_user_modal.messages.user_updated"), { id: toastId });
        triggerRefresh();
        closeModal();
        navigate("/admin/users-manage");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      let errorMessage = t("edit_user_modal.errors.update_user_failed");
      if (error.response) {
        const errorData = error.response.data;
        if (error.response.status === 400) {
          if (errorData.username) {
            setFieldErrors((prev) => ({
              ...prev,
              username:
                errorData.username[0] || t("edit_user_modal.errors.username_taken"),
            }));
            errorMessage = t("edit_user_modal.errors.username_taken");
          } else if (errorData.email) {
            setFieldErrors((prev) => ({
              ...prev,
              email: errorData.email[0] || t("edit_user_modal.errors.email_in_use"),
            }));
            errorMessage = t("edit_user_modal.errors.email_in_use");
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
        toast.error(t("edit_user_modal.errors.network_error"), { id: toastId });
      } else {
        toast.error(t("edit_user_modal.errors.unexpected_error"), { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    toast(t("edit_user_modal.messages.change_password_not_implemented"), {
      icon: "ℹ️",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto flex flex-col">
        {/* Header */}
        <div className="h-[100px] md:h-[133px] md:bg-[#F8F9FA] rounded-t-[6px] flex justify-between items-start px-4 md:px-6 pt-6">
          <h2 className="absolute top-[30px] md:top-[40px] left-4 md:left-[30px] heading-text">
            {t("edit_user_modal.title")}
          </h2>
          <button
            className="close-button hover:bg-gray-200 duration-200"
            onClick={closeModal}
            aria-label={t("edit_user_modal.close_modal")}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="absolute top-[50px] md:top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="relative md:top-[-30px] w-[100px] md:w-[123px] h-[100px] md:h-[123px] bg-[#F3F3F3] rounded-full border overflow-hidden">
            {imagePreview && (
              <img
                src={imagePreview}
                alt={t("edit_user_modal.image_alt.profile_preview")}
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
                alt={t("edit_user_modal.image_alt.add_image")}
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
        <div className="px-4 md:px-6 pt-4 md:pt-[15px] grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 mt-[40px] md:mt-[30px] overflow-y-auto flex-1">
          {/* Name */}
          <div className="mt-[50px]">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              {t("edit_user_modal.labels.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("edit_user_modal.placeholders.name")}
              className={`input-style ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              disabled={isLoading}
              required
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Username */}
          <div className="md:mt-[50px]">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              {t("edit_user_modal.labels.username")} *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t("edit_user_modal.placeholders.username")}
              className={`input-style ${
                fieldErrors.username
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              disabled={isLoading}
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
              {t("edit_user_modal.labels.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleEmailBlur}
              onFocus={() => console.log("Email input value:", formData.email)}
              placeholder={t("edit_user_modal.placeholders.email")}
              className={`input-style ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              }`}
              disabled={isLoading}
              required
              aria-describedby="email-error"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-red-600 text-xs mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              {t("edit_user_modal.labels.role")} *
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
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              disabled={isLoading}
            >
              <option value="">{t("edit_user_modal.placeholders.role")}</option>
              <option value="Admin">{t("edit_user_modal.roles.admin")}</option>
              <option value="Sales">{t("edit_user_modal.roles.sales")}</option>
              <option value="Store">{t("edit_user_modal.roles.store")}</option>
            </select>
            <ChevronDown
              className={`absolute right-[20px] md:right-[15px] top-[36px] md:top-[33px] text-gray-400 pointer-events-none transition-transform duration-300 drop-down-icon ${
                isSelectOpen ? "rotate-180" : "rotate-0"
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
        </div>

        {/* Button Row - Change Password and Edit User aligned */}
        <div className="px-4 md:px-6 mt-6 mb-10 button-container">
          <button
            className={`reset-button duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-[#1458A2] hover:text-white"
            }`}
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {t("edit_user_modal.buttons.change_password")}
          </button>

          <button
            className={`create-user-button duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#076094]"
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? t("edit_user_modal.buttons.updating")
              : t("edit_user_modal.buttons.edit_user")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;