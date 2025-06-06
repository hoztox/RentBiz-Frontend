import "./DeleteTenancyModal.css";
import deleteImage from "../../../assets/Images/Admin Tenancy/terminate-modal-img.svg";

const DeleteTenancyModal = ({
  isOpen,
  onCancel,
  onDelete,
  title = "Are You Sure?",
  message = "Are you sure you want to delete this item?",
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg delete-modal-box">
        <div className="p-3">
          <div className="flex justify-center">
            <div className="delete-modal-bg">
              <img src={deleteImage} alt="Delete" className="h-40" />
            </div>
          </div>

          <div className="text-center mb-6 delete-modal-content">
            <h2 className="text-2xl font-semibold text-[#E44747]">{title}</h2>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 focus:outline-none delete-modal-cancel-btn"
            >
              {cancelButtonText}
            </button>

            <button
              onClick={onDelete}
              className="flex-1 bg-[#E44747] text-white hover:bg-[#d12f2f] focus:outline-none delete-modal-delete-btn"
            >
              {deleteButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTenancyModal;
