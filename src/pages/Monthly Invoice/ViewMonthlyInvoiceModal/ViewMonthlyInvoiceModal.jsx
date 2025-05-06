import React from "react";
import "./ViewMonthlyInvoiceModal.css";
import closeicon from "../../../assets/Images/Monthly Invoice/close-icon.svg";

const ViewMonthlyInvoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-md w-[1006px] h-[356px] p-6 view-monthly-invoice-modal-container">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="view-monthly-invoice-modal-head">Monthly Invoice View</h2>
          <button
            onClick={onClose}
            className="view-monthly-invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
          <div className="view-monthly-invoice-modal-grid gap-4">
            <div className="pr-4 border-r border-[#E9E9E9]">
              <div className="view-monthly-invoice-modal-label mb-1">Due Date</div>
              <div className="view-monthly-invoice-modal-data">20-06-2025</div>
            </div>

            <div className="pl-4">
              <div className="view-monthly-invoice-modal-label mb-1">In Date</div>
              <div className="view-monthly-invoice-modal-data">20-05-2025</div>
            </div>
          </div>
        </div>

        {/* Invoice Charges Table */}
        <div className="mt-6 view-monthly-invoice-modal-overflow-x-auto border border-[#E9E9E9] rounded-md mb-[80px]">
          <div className="view-monthly-invoice-modal-desktop-table">
            <table className="w-full border-collapse view-monthly-invoice-modal-table">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[66px] view-monthly-invoice-charges-thead">
                    Tenancy
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[56px] view-monthly-invoice-charges-thead">
                    Tenant
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[65px] view-monthly-invoice-charges-thead">
                    Charges
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[163px] view-monthly-invoice-charges-thead">
                    Description
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[75px] view-monthly-invoice-charges-thead">
                    Date
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-monthly-invoice-charges-thead">
                    Amount
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[52px] view-monthly-invoice-charges-thead">
                    Select
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[44px] view-monthly-invoice-charges-thead">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[57px] hover:bg-gray-100">
                  <td className="px-[10px] py-[5px] w-[66px] view-monthly-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[56px] view-monthly-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[65px] view-monthly-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[163px] view-monthly-invoice-charges-tdata">
                    Lorem ipsum dolor sit amet
                  </td>
                  <td className="px-[10px] py-[5px] w-[75px] text-left text-[14px] view-monthly-invoice-charges-tdata">
                    20-04-2025
                  </td>
                  <td className="px-[10px] py-[5px] w-[80px] text-left text-[14px] view-monthly-invoice-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[52px] text-left text-[14px] view-monthly-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-monthly-invoice-charges-tdata">
                    300.20
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="view-monthly-invoice-modal-mobile-table">
            <div className="view-monthly-invoice-modal-mobile-section">
              {/* First Header: Tenancy and Tenant */}
              <div className="view-monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Tenancy
                </div>
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Tenant
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  Test
                </div>
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  Test
                </div>
              </div>

              {/* Second Header: Charges and Description */}
              <div className="view-monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Charges
                </div>
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Description
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  Test
                </div>
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  Lorem ipsum dolor sit amet
                </div>
              </div>

              {/* Third Header: Date and Amount */}
              <div className="view-monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Date
                </div>
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Amount
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  20-04-2025
                </div>
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  300.20
                </div>
              </div>

              {/* Fourth Header: Select and Total */}
              <div className="view-monthly-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase">
                  Select
                </div>
                <div className="px-[10px] flex items-center view-monthly-invoice-charges-thead uppercase ml-[70px]">
                  Total
                </div>
              </div>
              <div className="grid grid-cols-2 h-[70px]">
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata">
                  Test
                </div>
                <div className="px-[10px] py-[10px] view-monthly-invoice-charges-tdata ml-[70px]">
                  300.20
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMonthlyInvoiceModal;