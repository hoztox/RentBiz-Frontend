import React, { useState } from "react";
import "./AdminCreateUserModal.css";
import cancelIcon from "../../assets/Images/Admin Create Modal/cancelIcon.svg";
import addImageIcon from "../../assets/Images/Admin Create Modal/addImageIcon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext"; // Adjust path

const AdminCreateUserModal = () => {
  const { modalState, closeModal } = useModal();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Early return AFTER hooks
  if (!modalState.isOpen || modalState.type !== "user-create") return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // TODO: Add form validation and API call
    console.log("Form submitted:", formData);
    closeModal();
    navigate("/admin/users-manage");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg w-full max-w-[830px] h-auto md:h-[548px] flex flex-col">
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
            <div className="absolute bottom-0 left-0 right-0 h-[30px] md:h-[37px] bg-[#201D1E] rounded-b-full"></div>
            <div className="absolute bottom-[6px] md:bottom-[8px] left-1/2 transform -translate-x-1/2">
              <img
                src={addImageIcon}
                alt="Add image"
                className="h-[18px] md:h-[22px] w-[18px] md:w-[22px]"
              />
            </div>
            <input type="file" className="hidden" accept="image/*" />
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
            >
              <option value="" disabled>
                Choose
              </option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
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

          {/* Empty div for layout on desktop */}
          <div className="hidden md:block"></div>

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
              placeholder="Password"
              className="input-style focus:border-gray-700"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[8px] md:mb-[10px] form-label">
              Confirm Password*
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="input-style focus:border-gray-700"
            />
          </div>
        </div>

        {/* Button */}
        <div className="px-4 md:px-6 mt-6 md:mt-6 mb-48 md:mb-6 flex justify-end">
          <button
            className="bg-[#2892CE] hover:bg-[#076094] duration-200 create-user-button"
            onClick={handleSubmit}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUserModal;