import React from 'react'
import './createtenantmodal.css'
import TenantFormFlow from './TenantFormFlow/TenantFormFlow'


const CreateTenantModal = ({open, onClose}) => {
  return (
    <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-colors z-50 
                ${open ? "visible bg-black/70" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`tenant-modal-styles transition-all 
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
            >
                {/* Content Here */}
                <TenantFormFlow onClose={onClose} />
            </div>
        </div>
  )
}

export default CreateTenantModal