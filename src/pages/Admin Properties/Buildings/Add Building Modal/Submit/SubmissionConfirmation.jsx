import React, { useEffect } from 'react';
import "./submissionconfirmation.css";
import success from "../../../../../assets/Images/Admin Buildings/success.png";
import successtick from "../../../../../assets/Images/Admin Buildings/success_tick.png";

const SubmissionConfirmation = ({onClose}) => {
  useEffect(() => {
    // Check if the screen width is below 480px (mobile view)
    const isMobile = window.matchMedia("(max-width: 480px)").matches;

    if (isMobile) {
      // Set a timeout to call onClose after 3 seconds (3000ms)
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      // Cleanup the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div className="submit-confirm-container">
      <div className="submit-confirm-box">
        <div className="submit-confirm-images">
          <img src={success} alt="Success" className="submit-success-img" />
          <img src={successtick} alt="Success Tick" className="submit-tick-img" />
        </div>
        
        {/* Text Content */}
        <div className="submit-confirm-text">
          <h2 className="submit-title">Submitted Successfully</h2>
          <p className="submit-message">Your changes have been saved successfully</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;