import React from "react";
import "./ConfirmationModal.css";
import confirmImage from "../../assets/Images/ConfirmationModal/confirm-modal-img.png";
import terminateImage from "../../assets/Images/ConfirmationModal/terminate-modal-img.png";
import deleteImage from "../../assets/Images/ConfirmationModal/delete-modal-img.png";
import closeImage from "../../assets/Images/ConfirmationModal/tenancy-close.png";
import cancelImage from "../../assets/Images/ConfirmationModal/cancel-modal-img.png";

const ConfirmationModal = ({
  isOpen,
  type = "confirm",
  title = "Are You Sure?",
  message = "Are you sure you want to proceed?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonData = {},
  cancelButtonData = {},
}) => {
  if (!isOpen) return null;

  const images = {
    confirm: confirmImage,
    cancel: cancelImage,
    delete: deleteImage,
    close: closeImage,
    terminate: terminateImage,
  };

  const titleColors = {
    confirm: "text-[#28C76F]",
    cancel: "text-[#E44747]",
    delete: "text-[#E44747]",
    close: "text-[#FF5B5B]",
    terminate: "text-[#E44747]",
  };

  const confirmButtonStyles = {
    confirm: "bg-[#2892CE] text-white hover:bg-[#1f709e]",
    cancel: "bg-[#E44747] text-white hover:bg-[#d12f2f]",
    delete: "bg-[#E44747] text-white hover:bg-[#d12f2f]",
    close: "bg-[#FF5B5B] text-white hover:bg-[#e04a4a]",
    terminate: "bg-[#E44747] text-white hover:bg-[#d12f2f]",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg confirmation-modal-box">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="confirmation-modal-bg">
              <img src={images[type]} alt={type} className="h-40" />
            </div>
          </div>
          <div className="text-center mb-6 confirmation-modal-content">
            <h2 className={`${titleColors[type]}`}>
              {title}
            </h2>
            <p className="text-[#7D7D7D] text-sm">{message}</p>
          </div>
          <div className="flex gap-3 confirmation-modal-gap">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 duration-200 focus:outline-none confirmation-modal-cancel-btn"
              {...cancelButtonData}
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 duration-200 focus:outline-none confirmation-modal-confirm-btn ${confirmButtonStyles[type]}`}
              {...confirmButtonData}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
