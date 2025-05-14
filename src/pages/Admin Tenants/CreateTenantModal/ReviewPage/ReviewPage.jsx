import { useState } from "react";
import "./ReviewPage.css";
import DocumentView from "./DocumentView";

const ReviewPage = ({ onNext, onBack }) => {
  const [buildingData] = useState({
    tenant_name: "B24090001",
    mob_no: "9988776655",
    email: "test@gmail.com",
    address: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci",
    trade_license_no: "TD1232",
    id_no: "ID12",
    sponsor_name: "Test",
    sponsor_id_no: "SPID12",
    status: "Active",
    nationality: "Indian",
    alternative_mob_no: "9988776655",
    description: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci",
    tenant_type: "Type1",
    id_type: "ID1",
    id_validity: "20-02-2025",
    sponsor_id_type: "SPID1",
    sponsor_id_validity: "25-02-2025",
    remarks: "Lorem ipsum dolor consectetur adipiscing elit. Morbi orci",
  });

  return (
    <div>
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Tenant</h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Tenant Name*</p>
              <p className="review-page-data">{buildingData.tenant_name}</p>
            </div>

            <div>
              <p className="review-page-label">Mobile Number*</p>
              <p className="review-page-data">{buildingData.mob_no}</p>
            </div>

            <div>
              <p className="review-page-label">Email*</p>
              <p className="review-page-data">{buildingData.email}</p>
            </div>

            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{buildingData.address}</p>
            </div>

            <div>
              <p className="review-page-label">Trade License Number*</p>
              <p className="review-page-data">
                {buildingData.trade_license_no}
              </p>
            </div>

            <div>
              <p className="review-page-label">ID Number*</p>
              <p className="review-page-data">{buildingData.id_no}</p>
            </div>

            <div>
              <p className="review-page-label">Sponsor Name*</p>
              <p className="review-page-data">{buildingData.sponsor_name}</p>
            </div>

            <div>
              <p className="review-page-label">Sponsor ID Number*</p>
              <p className="review-page-data">{buildingData.sponsor_id_no}</p>
            </div>

            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">{buildingData.status}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Nationality*</p>
              <p className="review-page-data">{buildingData.nationality}</p>
            </div>

            <div>
              <p className="review-page-label">Alternative Mobile Number*</p>
              <p className="review-page-data">
                {buildingData.alternative_mob_no}
              </p>
            </div>

            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{buildingData.description}</p>
            </div>

            <div>
              <p className="review-page-label">Tenant Type</p>
              <p className="review-page-data">{buildingData.tenant_type}</p>
            </div>

            <div>
              <p className="review-page-label">ID Type</p>
              <p className="review-page-data">{buildingData.id_type}</p>
            </div>

            <div>
              <p className="review-page-label">ID Validity</p>
              <p className="review-page-data">{buildingData.id_validity}</p>
            </div>

            <div>
              <p className="review-page-label">Sponsor ID Type*</p>
              <p className="review-page-data">{buildingData.sponsor_id_type}</p>
            </div>

            <div>
              <p className="review-page-label">Sponsor ID Validity*</p>
              <p className="review-page-data">
                {buildingData.sponsor_id_validity}
              </p>
            </div>

            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{buildingData.remarks}</p>
            </div>
          </div>
        </div>
      </div>

      <DocumentView />

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

export default ReviewPage;
