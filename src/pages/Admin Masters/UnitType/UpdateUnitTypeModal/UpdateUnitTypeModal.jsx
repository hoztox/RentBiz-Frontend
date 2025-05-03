import React, { useEffect, useState } from "react";
import "./UpdateUnitTypeModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";

const UpdateUnitTypeModal = ({ isOpen, onClose, unit }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (unit) {
      setName(unit.name);
    } else {
      setName("");
    }
  }, [unit]);

  const handleUpdate = () => {
    if (name) {
      console.log("Unit Type Updated Successfully: ", name);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div className="update-unit-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6">
        <h2 className="update-modal-head mt-4 mb-6">Update Unit Type Master</h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 close-btn duration-200"
        >
          <img src={closeicon} alt="close" className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <label className="block pt-2 update-modal-label">Name</label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 update-modal-input-style"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] update-modal-save-btn duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUnitTypeModal;
