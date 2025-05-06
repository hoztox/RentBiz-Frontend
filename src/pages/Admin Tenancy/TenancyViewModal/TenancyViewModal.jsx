import React from "react";
import "./TenancyViewModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/close-icon.svg";

const TenancyViewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="view-modal-overlay fixed inset-0 flex items-center justify-center transition-colors z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="view-modal-container bg-white rounded-md p-6 transition-all"
      >
        <div className="flex justify-between items-center mt-[5px] mb-[30px]">
          <h2 className="tenancy-view-modal-head">Tenancy View</h2>
          <button
            onClick={onClose}
            className="tenancy-view-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Tenancy Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6 mt-[-28px] md:mt-[28px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pr-0 md:pr-4 border-r-0 md:border-r border-[#E9E9E9]">
              <div className="tenancy-view-modal-label mb-1">Tenant Name</div>
              <div className="tenancy-view-modal-data">User 1</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">Unit</div>
              <div className="tenancy-view-modal-data">Unit22</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Start Date
              </div>
              <div className="tenancy-view-modal-data">20-05-2025</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                No. of Payments
              </div>
              <div className="tenancy-view-modal-data">20</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Rent Per Frequency
              </div>
              <div className="tenancy-view-modal-data">10</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Deposit (if Any)
              </div>
              <div className="tenancy-view-modal-data">10</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">Remarks</div>
              <div className="tenancy-view-modal-data">
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
              </div>
            </div>

            <div className="pl-0 md:pl-4">
              <div className="tenancy-view-modal-label mb-1">Building</div>
              <div className="tenancy-view-modal-data">DANAT ALZAHIA</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Rental Months
              </div>
              <div className="tenancy-view-modal-data">66</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">End Date</div>
              <div className="tenancy-view-modal-data">20-10-2025</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                First Rent Due On
              </div>
              <div className="tenancy-view-modal-data">20-06-2025</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Total Rent Receivable
              </div>
              <div className="tenancy-view-modal-data">30</div>

              <div className="tenancy-view-modal-label mb-1 mt-4">
                Commission (If Any)
              </div>
              <div className="tenancy-view-modal-data">12</div>
            </div>
          </div>
        </div>

        {/* Additional Charges Table */}
        <div className="mt-[32px] mb-[50px]">
          <h3 className="text-[#2892CE] additional-charges-heading">
            Additional Charges
          </h3>
          <div className="mt-5 overflow-x-auto border border-[#E9E9E9] rounded-md">
            <table className="w-full border-collapse desktop-table">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[20px] view-tenancy-charges-thead">
                    No
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[96px] view-tenancy-charges-thead">
                    Charge Type
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[163px] view-tenancy-charges-thead">
                    Reason
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[75px] view-tenancy-charges-thead">
                    Due Date
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[52px] view-tenancy-charges-thead">
                    Status
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[61px] view-tenancy-charges-thead">
                    Amount
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[30px] view-tenancy-charges-thead">
                    VAT
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[44px] view-tenancy-charges-thead">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[57px] border-b border-[#E9E9E9] hover:bg-gray-100">
                  <td className="px-[10px] py-[5px] w-[20px] view-tenancy-charges-tdata">
                    01
                  </td>
                  <td className="px-[10px] py-[5px] w-[96px] view-tenancy-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[163px] view-tenancy-charges-tdata">
                    Lorem ipsum dolor sit amet
                  </td>
                  <td className="px-[10px] py-[5px] w-[75px] view-tenancy-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[52px] text-left text-[14px] view-tenancy-charges-tdata">
                    Pending
                  </td>
                  <td className="px-[10px] py-[5px] w-[61px] text-left text-[14px] view-tenancy-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[30px] text-left text-[14px] view-tenancy-charges-tdata">
                    3.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-tenancy-charges-tdata">
                    303.40
                  </td>
                </tr>
                <tr className="h-[57px] hover:bg-gray-100">
                  <td className="px-[10px] py-[5px] w-[20px] view-tenancy-charges-tdata">
                    02
                  </td>
                  <td className="px-[10px] py-[5px] w-[96px] view-tenancy-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[163px] view-tenancy-charges-tdata">
                    Lorem ipsum dolor sit amet
                  </td>
                  <td className="px-[10px] py-[5px] w-[75px] view-tenancy-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[52px] text-left text-[14px] view-tenancy-charges-tdata">
                    Pending
                  </td>
                  <td className="px-[10px] py-[5px] w-[61px] text-left text-[14px] view-tenancy-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[30px] text-left text-[14px] view-tenancy-charges-tdata">
                    3.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-tenancy-charges-tdata">
                    303.40
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mobile-table hidden">
              <div className="border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px] grid grid-cols-3 gap-2 px-[10px]">
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">No</div>
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead w-[96px]">Charge Type</div>
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">Reason</div>
              </div>
              <div className="h-[57px] grid grid-cols-3 gap-2 px-[10px] hover:bg-gray-100">
                <div className="view-tenancy-charges-tdata">01</div>
                <div className="view-tenancy-charges-tdata">Test</div>
                <div className="view-tenancy-charges-tdata">Lorem ipsum dolor sit amet</div>
              </div>
              <div className="border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px] grid grid-cols-3 gap-2 px-[10px]">
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">Due Date</div>
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">Status</div>
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">Amount</div>
              </div>
              <div className="h-[57px] grid grid-cols-3 gap-2 px-[10px] hover:bg-gray-100">
                <div className="view-tenancy-charges-tdata">300.20</div>
                <div className="view-tenancy-charges-tdata">Pending</div>
                <div className="view-tenancy-charges-tdata">300.20</div>
              </div>
              <div className="border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px] grid grid-cols-2 gap-2 px-[10px]">
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">VAT</div>
                <div className="text-left text-gray-700 uppercase view-tenancy-charges-thead">Total</div>
              </div>
              <div className="h-[57px] grid grid-cols-2 gap-2 px-[10px] hover:bg-gray-100 !border-none">
                <div className="view-tenancy-charges-tdata">3.20</div>
                <div className="view-tenancy-charges-tdata">303.40</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyViewModal;