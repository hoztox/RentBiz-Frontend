import React, { useEffect, useState } from "react";
import "./CreateUnitTypeModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";

const CreateUnitTypeModal = () => {
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState("");

  // Reset form state when modal opens
  useEffect(() => {
    if (modalState.isOpen) {
      setName("");
    }
  }, [modalState.isOpen]);

  // Only render for "create-unit-type-master" type
  if (!modalState.isOpen || modalState.type !== "create-unit-type-master") {
    return null;
  }

  const handleSave = () => {
    if (!name) {
      alert("Please fill the Name field");
      return;
    }
    console.log("New Unit Type Created: ", name);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="create-unit-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="modal-head">Create New Unit Type Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 tenancy-modal-label">Name*</label>
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
            aria-label="Save unit type"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUnitTypeModal;
