import React, { useState } from "react";
import "./AdminCreateUserModal.css";
import cancelIcon from "../../assets/Images/Admin Create Modal/cancelIcon.svg";
import addImageIcon from "../../assets/Images/Admin Create Modal/addImageIcon.svg";
import { ChevronDown } from "lucide-react";

const AdminCreateUserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="modal-container relative bg-white rounded-[6px] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-[#F8F9FA] h-[133px] rounded-t-[6px] flex justify-between items-start px-6 pt-6">
          <h2 className="absolute top-[40px] left-[30px] heading-text">
            Create User
          </h2>
          <button className="close-button" onClick={onClose}>
            <img src={cancelIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Image Section */}
        <div className="absolute top-[71px] left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="relative w-[123px] h-[123px] bg-gray-100 rounded-full border overflow-hidden">
            {/* Black bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[37px] bg-[#201D1E] rounded-b-full"></div>

            {/* Icon on black background */}
            <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2">
              <img src={addImageIcon} alt="Add" className="h-[22px] w-[22px]" />
            </div>

            {/* Hidden file input */}
            <input type="file" className="hidden" />
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pt-6 grid grid-cols-2 gap-x-3 gap-y-5 mt-[68px]">
          {/* Name */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[10px] form-label">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="input-style"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[10px] form-label">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="input-style"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <label className="block text-sm text-[#201D1E] mb-[10px]">
              Role*
            </label>
            <select
              className="input-style select custom-select"
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
            >
              <option
                style={{
                  color: "#CFCFCF",
                  fontSize: "15px",
                  fontWeight: "400",
                  fontFamily: "Inter Tight",
                }}
              >
                Choose
              </option>
            </select>
            <ChevronDown
              className={`absolute right-[25px] top-[40px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                isSelectOpen ? "rotate-180" : "rotate-0"
              }`}
              width={22}
              height={22}
              color="#201D1E"
            />
          </div>

          <div></div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[10px] form-label">
              Password*
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input-style"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#201D1E] mb-[10px] form-label">
              Confirm Password*
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-style"
            />
          </div>
        </div>

        {/* Button */}
        <div className="px-6 mt-8 mb-6">
          <button
            className="bg-[#2892CE] hover:bg-[#076094] create-user-button"
            onClick={onClose}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUserModal;
