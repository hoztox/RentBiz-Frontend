import "./TenancyCloseModal.css";
import closeImage from "../../../../assets/Images/Admin Tenancy/tenancy-close.png";

const TenancyCloseModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg tenancy-close-modal-box">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="tenancy-close-modal-bg">
              <img src={closeImage} alt="Close Tenancy" className="h-40" />
            </div>
          </div>

          <div className="text-center mb-6 tenancy-close-modal-content">
            <h2 className="text-2xl font-semibold text-[#FF5B5B]">
              Close Tenancy?
            </h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to close this tenancy?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 duration-200 focus:outline-none tenancy-close-cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 bg-[#FF5B5B] text-white hover:bg-[#e04a4a] duration-200 focus:outline-none tenancy-close-confirm-btn"
            >
              Close Tenancy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyCloseModal;
