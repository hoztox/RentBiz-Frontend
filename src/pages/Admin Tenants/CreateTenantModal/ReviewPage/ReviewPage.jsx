import { useState } from 'react'
import "./ReviewPage.css"
import DocumentView from './DocumentView'

const ReviewPage = ({onNext, onBack}) => {
    const [buildingData] = useState({
      buildingNo: 'B24090001',
      buildingName: 'Emaar Square Area',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque faucibus condimentum',
      latitude: '1.1',
      status: 'Active',
      plotNo: 'B24090001',
      address: 'Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE',
      remarks: 'Lorem ipsum dolor consectetur adipiscing elit. Morbi orci',
      longitude: '2.2',
      nearByLandmark: 'Lorem ipsum dolor'
    });
  
  return (
    <div>
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Building</h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">{buildingData.buildingNo}</p>
            </div>

            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">{buildingData.buildingName}</p>
            </div>

            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{buildingData.description}</p>
            </div>

            <div>
              <p className="review-page-label">Latitude</p>
              <p className="review-page-data">{buildingData.latitude}</p>
            </div>

            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">{buildingData.status}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{buildingData.plotNo}</p>
            </div>

            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{buildingData.address}</p>
            </div>

            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{buildingData.remarks}</p>
            </div>

            <div>
              <p className="review-page-label">Longitude</p>
              <p className="review-page-data">{buildingData.longitude}</p>
            </div>

            <div>
              <p className="review-page-label">Near By Landmark</p>
              <p className="review-page-data">{buildingData.nearByLandmark}</p>
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
  )
}

export default ReviewPage