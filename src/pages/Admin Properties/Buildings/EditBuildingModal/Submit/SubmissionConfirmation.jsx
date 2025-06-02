import React from "react";
import "./submissionconfirmation.css";
import success from "../../../../../assets/Images/Admin Buildings/success.png";
import successtick from "../../../../../assets/Images/Admin Buildings/success_tick.png";

const SubmissionConfirmation = () => {
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