import React from "react";
import "./edittenantmodal.css";
import TenantFormFlow from "./TenantFormFlow/TenantFormFlow";

const EditTenantModal = ({ open, onClose, tenantId, onTenantUpdated }) => {
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
        <TenantFormFlow
          onClose={onClose}
          tenantId={tenantId}
          onTenantUpdated={onTenantUpdated}
        />
      </div>
    </div>
  );
};

export default EditTenantModal;