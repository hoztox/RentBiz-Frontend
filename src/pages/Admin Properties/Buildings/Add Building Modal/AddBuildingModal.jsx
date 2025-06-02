import React, { useState } from 'react';
import "./addbuilding.css";
import buildingimg from "../../../../assets/Images/Admin Buildings/building-top.svg"
import BuildingFormFlow from './Building Form Flow/BuildingFormFlow';
import { ChevronDown } from 'lucide-react';

const AddBuildingModal = ({ open, onClose, onBuildingCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => setIsExpanded(prev => !prev);

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-colors z-50 add-building-modal
            ${open ? "visible bg-black/70 max-[480px]:bg-transparent" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`max-[480px]:relative building-modal-styles transition-all top-[90px]
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
            >
                {/* Mobile Image */}
                <div className='min-[480px]:hidden w-full h-[117px] bg-[#1458A2] flex justify-center relative top-[-42px]'>
                    <img src={buildingimg} alt="Building Top" className='top-[17px] absolute w-[85%]' />
                </div>

                {/* Mobile Header Bar */}
                <div
                    className="min-[480px]:hidden bg-white w-full h-[54px] mx-[16px] rounded-md absolute max-w-[calc(100vw-32px)] top-[40px] p-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between cursor-pointer z-10"
                    onClick={handleToggle}
                >
                    <div className="flex items-center space-x-5">
                        <div className="w-[30px] h-[30px] rounded-full bg-[#1458A210] flex items-center justify-center text-[#0a5ebf] toggle-count">
                            1
                        </div>
                        <span className="text-[#1458A2] mob-toggle-head text-[16px]">Create Building</span>
                    </div>

                    {/* Chevron with smooth rotation */}
                    <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 text-[#1458A2] ${isExpanded ? "rotate-180" : "rotate-0"}`}
                    />
                </div>

                {/* Content */}
                <BuildingFormFlow onClose={onClose} onBuildingCreated={onBuildingCreated} />

            </div>
        </div>
    );
};

export default AddBuildingModal;
