import "./TenancyCancelModal.css";
import cancelImage from "../../../../assets/Images/Admin Tenancy/terminate-modal-img.svg";

const TenancyCancelModal = ({ isOpen, onCancel, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg cancel-modal-box">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="cancel-modal-bg">
              <img src={cancelImage} alt="Cancel" className="h-40" />
            </div>
          </div>
          <div className="text-center mb-6 cancel-modal-content">
            <h2 className="text-2xl font-semibold text-[#E44747]">
              Are You Sure?
            </h2>
            <p className="text-gray-600 text-sm">Are you sure you want to reject this tenancy </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 focus:outline-none cancel-modal-btn"
            >
              Cancel
            </button>

            <button
              onClick={onReject}
              className="flex-1 bg-[#E44747] text-white hover:bg-[#d12f2f] focus:outline-none cancel-reject-btn"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyCancelModal;
