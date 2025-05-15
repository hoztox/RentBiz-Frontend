import React, { useState } from "react";
import "./review.css";
import DocumentsView from "./DocumentsView";

const UnitReview = ({ onNext, onBack }) => {
  const [buildingData] = useState({
    buildingName: "Emaar Square Area",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Morbi orci ante, scelerisque faucibus condimentum ",
    address: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE",
    buildingNo: "B24090001",
    plotNo: "B24090001",
    remarks: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci",
  });

  const [unitData] = useState({
    unitName: "Unit22",
    unitType: "Apartment",
    bedrooms: "2",
    bathrooms: "4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque faucibus condimentum",
    address: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE",
    premiseNumber: "14538622",
    remarks: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci",
    status: "Active",
  });

  return (
    <div>
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Building</h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">{buildingData.buildingName}</p>
            </div>

            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{buildingData.address}</p>
            </div>

            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{buildingData.plotNo}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{buildingData.description}</p>
            </div>

            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">{buildingData.buildingNo}</p>
            </div>

            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{buildingData.remarks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-md border-[#E9E9E9] p-5 mt-[25px]">
        <h2 className="review-page-head">Unit</h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Unit Name*</p>
              <p className="review-page-data">{unitData.unitName}</p>
            </div>

            <div>
              <p className="review-page-label">Bedrooms</p>
              <p className="review-page-data">{unitData.bedrooms}</p>
            </div>

            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{unitData.description}</p>
            </div>

            <div>
              <p className="review-page-label">Premise Number*</p>
              <p className="review-page-data">{unitData.premiseNumber}</p>
            </div>

            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">{unitData.status}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Unit Type*</p>
              <p className="review-page-data">{unitData.unitType}</p>
            </div>

            <div>
              <p className="review-page-label">Bathrooms</p>
              <p className="review-page-data">{unitData.bathrooms}</p>
            </div>

            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{unitData.address}</p>
            </div>

            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{unitData.remarks}</p>
            </div>
          </div>
        </div>
      </div>

      <DocumentsView />

      <div className="flex justify-end gap-4 pt-5 mt-auto">
        <button
          type="button"
          className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UnitReview;
