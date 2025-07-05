import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./AdminCreateUserModal.css";
import addImageIcon from "../../assets/Images/Admin Create Modal/addImageIcon.svg";
import { ChevronDown, X } from "lucide-react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateUserModal = () => {
  const { t, i18n } = useTranslation();
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Determine the direction (ltr or rtl)
  const isRtl = i18n.dir() === "rtl";

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
          username: t("admin_create_user.errors.username_no_spaces"),
        }));
      } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(value.toLowerCase())) {
        setFieldErrors((prev) => ({
          ...prev,
          username: t("admin_create_user.errors.username_format"),
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
          email: t("admin_create_user.errors.email_invalid"),
        }));
      } else if (formData.email.length > 254) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("admin_create_user.errors.email_too_long"),
        }));
      } else if (/\.\./.test(formData.email)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("admin_create_user.errors.email_consecutive_dots"),
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
        toast.error(t("admin_create_user.errors.invalid_image"));
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(t("admin_create_user.errors.image_too_large"));
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
      errors.name = t("admin_create_user.errors.name_required");
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = t("admin_create_user.errors.username_required");
      isValid = false;
    } else {
      if (/\s/.test(formData.username)) {
        errors.username = t("admin_create_user.errors.username_no_spaces");
        isValid = false;
      } else if (!/^(?=.*[a-z])[a-z0-9._-]*$/.test(formData.username)) {
        errors.username = t("admin_create_user.errors.username_format");
        isValid = false;
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t("admin_create_user.errors.email_required");
      isValid = false;
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|io|co|us|ca|uk|au|de|fr|jp|cn|in)$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = t("admin_create_user.errors.email_invalid");
        isValid = false;
      } else if (formData.email.length > 254) {
        errors.email = t("admin_create_user.errors.email_too_long");
        isValid = false;
      } else if (/\.\./.test(formData.email)) {
        errors.email = t("admin_create_user.errors.email_consecutive_dots");
        isValid = false;
      }
    }

    // Role validation
    if (!formData.user_role) {
      errors.user_role = t("admin_create_user.errors.role_required");
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = t("admin_create_user.errors.password_required");
      isValid = false;
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password = t("admin_create_user.errors.password_format");
        isValid = false;
      }
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      errors.confirm_password = t(
        "admin_create_user.errors.confirm_password_required"
      );
      isValid = false;
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = t(
        "admin_create_user.errors.confirm_password_mismatch"
      );
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
    const toastId = toast.loading(t("admin_create_user.messages.creating_user"));

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
        toast.success(t("admin_create_user.messages.user_created"), {
          id: toastId,
        });
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
        let errorMessage = t("admin_create_user.errors.create_user_failed");

        if (error.response.status === 400) {
          if (errorData.username) {
            setFieldErrors((prev) => ({
              ...prev,
              username:
                errorData.username[0] ||
                t("admin_create_user.errors.username_taken"),
            }));
            errorMessage = t("admin_create_user.errors.username_taken");
          } else if (errorData.email) {
            setFieldErrors((prev) => ({
              ...prev,
              email:
                errorData.email[0] || t("admin_create_user.errors.email_in_use"),
            }));
            errorMessage = t("admin_create_user.errors.email_in_use");
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
        toast.error(t("admin_create_user.errors.network_error"), {
          id: toastId,
        });
      } else {
        toast.error(t("admin_create_user.errors.unexpected_error"), {
          id: toastId,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto md:h-[600px] flex flex-col">
        <div className="h-[100px] md:h-[133px] md:bg-[#F8F9FA] rounded-t-[6px] flex justify-between items-start px-4 md:px-6 pt-6">
          <h2
            className={`absolute top-[30px] md:top-[40px] heading-text ${
              isRtl ? "right-4 md:right-[30px]" : "left-4 md:left-[30px]"
            }`}
          >
            {t("admin_create_user.title")}
          </h2>
          <button
            className={`close-button hover:bg-gray-200 duration-200 ${
              isRtl ? "left-4 md:left-[30px]" : "right-4"
            }`}
            onClick={closeModal}
            aria-label={t("admin_create_user.close_modal")}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`absolute top-[50px] md:top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center`}
        >
          <div className="relative top-[-30px] w-[100px] md:w-[123px] h-[100px] md:h-[123px] bg-[#F3F3F3] rounded-full border overflow-hidden">
            {imagePreview && (
              <img
                src={imagePreview}
                alt={t("admin_create_user.image_alt.profile_preview")}
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
                alt={t("admin_create_user.image_alt.add_image")}
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

        <div
          className={`px-4 md:px-6 pt-4 md:pt-0 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 mt-[40px] md:mt-[68px] overflow-y-auto flex-1 ${
            isRtl ? "rtl-grid" : ""
          }`}
        >
          <div>
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("admin_create_user.placeholders.name")}
              className={`input-style ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              } ${isRtl ? "text-right" : ""}`}
              required
            />
            {fieldErrors.name && (
              <p className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}>
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.username")} *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t("admin_create_user.placeholders.username")}
              className={`input-style ${
                fieldErrors.username
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              } ${isRtl ? "text-right" : ""}`}
              required
            />
            {fieldErrors.username && (
              <p className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}>
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleEmailBlur}
              placeholder={t("admin_create_user.placeholders.email")}
              className={`input-style ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              } ${isRtl ? "text-right" : ""}`}
              required
              aria-describedby="email-error"
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mt-[-5px] ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.role")} *
            </label>
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleInputChange}
              className={`input-style select custom-select ${
                fieldErrors.user_role
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-gray-700"
              } ${isRtl ? "text-right" : ""}`}
              onFocus={() => setIsRoleSelectOpen(true)}
              onBlur={() => setIsRoleSelectOpen(false)}
            >
              <option value="">{t("admin_create_user.placeholders.role")}</option>
              <option value="Admin">{t("admin_create_user.roles.admin")}</option>
              <option value="Sales">{t("admin_create_user.roles.sales")}</option>
              <option value="Store">{t("admin_create_user.roles.store")}</option>
            </select>
            <ChevronDown
              className={`absolute top-[36px] md:top-[33px] text-gray-400 pointer-events-none transition-transform duration-300 drop-down-icon ${
                isRtl
                  ? "left-[20px] md:left-[15px]"
                  : "right-[20px] md:right-[15px] rotate-0"
              } ${isRoleSelectOpen ? "rotate-180" : ""}`}
              width={20}
              height={20}
              color="#201D1E"
            />
            {fieldErrors.user_role && (
              <p className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}>
                {fieldErrors.user_role}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.password")} *
            </label>
            <div className="relative group">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t("admin_create_user.placeholders.password")}
                className={`input-style ${
                  fieldErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-gray-700"
                } ${isRtl ? "text-right pr-10 pl-4" : "pr-10"}`}
                required
                aria-describedby="password-error"
              />
              <span
                className={`absolute inset-y-0 flex items-center text-gray-400 cursor-pointer ${
                  isRtl ? "left-4" : "right-4"
                }`}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </span>
              <div
                className={`absolute hidden group-hover:block group-focus-within:block bg-gray-800 text-white text-xs rounded py-1 px-2 ${
                  isRtl ? "right-0" : "left-0"
                } bottom-full mb-1 w-[300px] z-10`}
              >
                {t("admin_create_user.password_hint")}
              </div>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              className={`block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label ${
                isRtl ? "text-right" : ""
              }`}
            >
              {t("admin_create_user.labels.confirm_password")} *
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder={t("admin_create_user.placeholders.confirm_password")}
                className={`input-style ${
                  fieldErrors.confirm_password
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-gray-700"
                } ${isRtl ? "text-right pr-10 pl-4" : "pr-10"} `}
                required
                aria-describedby="confirm-password-error"
              />
              <span
                className={`absolute inset-y-0 flex items-center text-gray-400 cursor-pointer ${
                  isRtl ? "left-4" : "right-4"
                }`}
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
                className={`text-red-600 text-xs mt-1 ${isRtl ? "text-right" : ""}`}
              >
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>
        </div>

        <div
          className={`px-4 md:px-6 mt-6 md:mt-1 mb-5 flex ${
            isRtl ? "justify-start" : "justify-end"
          }`}
        >
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
              ? t("admin_create_user.buttons.creating")
              : t("admin_create_user.buttons.create_user")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUserModal;