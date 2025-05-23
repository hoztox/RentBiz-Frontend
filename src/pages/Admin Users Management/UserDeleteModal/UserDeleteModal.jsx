import React from 'react'
import './UserDeleteModal.css'
import deleteImage from "../../../assets/Images/Admin Users Management/delete-modal-img.png"

const UserDeleteModal = ({isOpen, onCancel, onDelete}) => {
     if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg modal-box">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="modal-bg">
              <img src={deleteImage} alt="Delete" className="h-40" />
            </div>
          </div>

          <div className="text-center mb-6 modal-content">
            <h2 className="text-2xl font-semibold text-[#E44747]">
              Are You Sure?
            </h2>
            <p className="text-gray-600 text-sm">Are you sure you want to delete this user?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[#201D1E] hover:bg-gray-100 focus:outline-none cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={onDelete}
              className="flex-1 bg-[#E44747] text-white hover:bg-[#d12f2f] focus:outline-none modal-delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDeleteModal