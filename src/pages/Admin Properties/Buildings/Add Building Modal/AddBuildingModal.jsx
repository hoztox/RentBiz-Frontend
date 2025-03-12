import React from 'react';
import "./addbuilding.css";
import BuildingFormFlow from './Building Form Flow/BuildingFormFlow';

const AddBuildingModal = ({ open, onClose, title }) => {
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
                <BuildingFormFlow title={title} onClose={onClose} />
            </div>
        </div>
    );
};

export default AddBuildingModal;
