import React, { useEffect, useState } from "react";
import "./UpdateDocumentModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";

const UpdateDocumentModal = ({ isOpen, onClose, document }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (document) {
      setName(document.name);
    } else {
      setName("");
    }
  }, [document]);

  const handleUpdate = () => {
    if (name) {
      console.log("Document type updated", name);
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="update-document-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6">
        <h2 className="modal-head mt-4 mb-6">Update Document Type Master</h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 close-btn duration-200"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 mb-2 text-[#201D1E] modal-label">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 mb-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 input-style"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDocumentModal;