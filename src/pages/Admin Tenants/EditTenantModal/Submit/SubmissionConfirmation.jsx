import React, { useEffect } from "react";
import "./submissionconfirmation.css";
import success from "../../../../assets/Images/Admin Tenants/success.png";
import successtick from "../../../../assets/Images/Admin Tenants/success_tick.png";
import { useModal } from "../../../../context/ModalContext";

const SubmissionConfirmation = ({ onClose }) => {
  const { triggerRefresh } = useModal();

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 480px)").matches;

    if (isMobile) {
      const timer = setTimeout(() => {
        triggerRefresh(); // Trigger refresh on auto-close
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onClose, triggerRefresh]);

  return (
    <div className="submit-confirm-container">
      <div className="submit-confirm-box">
        <div className="submit-confirm-images">
          <img src={success} alt="Success" className="submit-success-img" />
          <img src={successtick} alt="Success Tick" className="submit-tick-img" />
        </div>
        <div className="submit-confirm-text">
          <h2 className="submit-title">Updated Successfully</h2>
          <p className="submit-message">Your changes have been saved successfully</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;