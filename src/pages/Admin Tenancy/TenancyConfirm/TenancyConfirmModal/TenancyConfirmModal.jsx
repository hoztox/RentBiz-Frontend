import React from "react";
import "./modal.css";
import confirmImage from "../../../../assets/Images/Admin Tenancy/modal-img.svg";
import toast from "react-hot-toast";

const TenancyConfirmModal = ({ isOpen, onCancel, onConfirm, tenancy }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg modal-box">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="modal-bg">
              <img src={confirmImage} alt="Confirm" className="h-40" />
            </div>
          </div>

          <div className="text-center mb-6 modal-content">
            <h2 className="text-2xl font-semibold text-[#28C76F]">
              Are You Sure?
            </h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to confirm the tenancy for{" "}
              {tenancy?.tenant?.tenant_name || "N/A"}?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 duration-200 focus:outline-none cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#2892CE] text-white hover:bg-[#1f709e] duration-200 focus:outline-none modal-confirm-btn"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyConfirmModal;