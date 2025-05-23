import React from "react";
import "./submissionconfirmation.css";
import success from "../../../../assets/Images/Admin Tenants/success.png"
import successtick from "../../../../assets/Images/Admin Tenants/success_tick.png"

const SubmissionConfirmation = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-md w-[513px] h-[396px] mt-[5rem]">
        <div className="flex flex-col justify-center items-center gap-[33px] mt-[30px] mb-[25px]">
          <img src={success} alt="Success" />
          <img src={successtick} alt="Succes Tick" />
        </div>

        {/* Text Content */}
        <div className="text-center flex flex-col gap-[9px]">
          <h2 className="text-1">Submitted Successfully</h2>
          <p className="text-2">Your changes have been saved successfully</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;
