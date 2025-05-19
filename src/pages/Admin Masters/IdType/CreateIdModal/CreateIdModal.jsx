import React, { useEffect, useState } from "react";
import "./CreateIdModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";

const CreateIdModal = () => {
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState("");

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen) {
      setName("");
    }
  }, [modalState.isOpen]);

  // Only render for "create-id-type-master" type
  if (!modalState.isOpen || modalState.type !== "create-id-type-master") {
    return null;
  }

  const handleSave = () => {
    if (!name) {
      alert("Please fill the name field");
      return;
    }
    console.log("New ID Type Created: ", name);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="create-id-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6">
        <h2 className="modal-head mt-4 mb-6">Create New ID Type Master</h2>
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 close-btn duration-200"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 modal-label">Name</label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 input-style"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] modal-save-btn duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdModal;
