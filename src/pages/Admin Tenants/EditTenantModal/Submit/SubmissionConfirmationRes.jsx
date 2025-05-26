import React, { useEffect } from "react";
import "./submissionconfirmation.css";
import success from "../../../../assets/Images/Admin Tenants/success.png";
import successtick from "../../../../assets/Images/Admin Tenants/success_tick.png";
import { useNavigate } from "react-router-dom";

const SubmissionConfirmationRes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/admin/edit-tenant-timeline");
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return (
    <div className="submit-confirm-container">
      <div className="submit-confirm-box">
        <div className="submit-confirm-images">
          <img src={success} alt="Success" className="submit-success-img" />
          <img
            src={successtick}
            alt="Success Tick"
            className="submit-tick-img"
          />
        </div>

        {/* Text Content */}
        <div className="submit-confirm-text">
          <h2 className="submit-title">Updated Successfully</h2>
          <p className="submit-message">
            Your tenant details have been updated successfully
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmationRes;
