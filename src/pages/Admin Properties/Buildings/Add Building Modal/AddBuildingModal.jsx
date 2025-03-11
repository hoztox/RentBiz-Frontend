import React from 'react'
import closeicon from "../../../../assets/Images/Admin Buildings/close-icon.svg"
import "./addbuilding.css"
import BuildingFormFlow from './Building Form Flow/BuildingFormFlow';

const AddBuildingModal = ({ open, onClose, title }) => {
    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center  transition-colors z-50 
                ${open ? "visible bg-black/70" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`building-modal-styles transition-all 
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
            >
                <div className='building-modal-header'>
                    {title && <h3 className="building-modal-title">{title}</h3>}
                    <button onClick={onClose} className="border border-[#E9E9E9] rounded-full p-[11px]">
                      <img src={closeicon} alt="Close" className='w-[15px] h-[15px] ' />
                    </button>
                </div>
                {/* Content Here */}

                <BuildingFormFlow/>
            </div>
        </div>
    )
}

export default AddBuildingModal
