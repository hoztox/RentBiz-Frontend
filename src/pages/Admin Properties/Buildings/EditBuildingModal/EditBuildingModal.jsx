import React from 'react'
import "./editbuilding.css"
import BuildingFormFlow from './Building Form Flow/BuildingFormFlow';

const EditBuildingModal = ({ open, onClose }) => {
    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-colors z-50 
                ${open ? "visible bg-black/70" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`building-modal-styles transition-all 
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
            >
                {/* Content Here */}
                <BuildingFormFlow onClose={onClose} />
            </div>
        </div>
    );
};
export default EditBuildingModal
