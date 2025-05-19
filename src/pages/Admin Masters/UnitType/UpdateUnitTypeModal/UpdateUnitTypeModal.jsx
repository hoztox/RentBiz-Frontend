import { useEffect, useState } from "react";
import "./UpdateUnitTypeModal.css";
import closeicon from "../../../../assets/Images/Admin Masters/close-icon.svg";
import { useModal } from "../../../../context/ModalContext";

const UpdateUnitTypeModal = () => {
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState("");

  // Reset form state when modal opens or unit data changes
  useEffect(() => {
    if (modalState.isOpen && modalState.data) {
      setName(modalState.data.name || "");
    } else {
      setName("");
    }
  }, [modalState.isOpen, modalState.data]);

  // Only render for "update-unit-type-master" type and valid data
  if (
    !modalState.isOpen ||
    modalState.type !== "update-unit-type-master" ||
    !modalState.data
  ) {
    return null;
  }

  const handleUpdate = () => {
    if (!name) {
      alert("Please fill the Name field");
      return;
    }
    console.log("Unit Type Updated Successfully: ", {
      id: modalState.data.id,
      name,
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-unit-modal-container relative bg-white rounded-md w-full max-w-[522px] h-auto md:h-[262px] p-6"
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="update-modal-head">Update Unit Type Master</h2>
          <button
            onClick={closeModal}
            className="close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
          >
            <img src={closeicon} alt="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block pt-2 update-modal-label">Name*</label>
          <input
            type="text"
            className="w-full border border-[#E9E9E9] rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 update-modal-input-style"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#2892CE] hover:bg-[#2276a7] text-white rounded w-[150px] h-[38px] update-modal-save-btn duration-200"
            aria-label="Save unit type"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUnitTypeModal;
