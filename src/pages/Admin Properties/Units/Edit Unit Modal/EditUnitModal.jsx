import React from "react";
import "./editunitmodal.css";
import UnitFormFlow from "./Unit Form Flow/UnitFormFlow";

const EditUnitModal = ({ open, onClose, title ,unitId, onUnitCreated}) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors z-50
    ${open ? "visible bg-black/70" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`unit-modal-styles transition-all 
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {/* Content Here */}
        <UnitFormFlow title={title} onClose={onClose} unitId={unitId} onUnitCreated={onUnitCreated} />
      </div>
    </div>
  );
};

export default EditUnitModal;
