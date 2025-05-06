import React from "react";
import "./ViewInvoiceModal.css";
import closeicon from "../../../assets/Images/Invoice/close-icon.svg";

const ViewInvoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-md w-[1006px] h-[460px] p-6 view-invoice-modal-container">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="view-invoice-modal-head">Invoice View</h2>
          <button
            onClick={onClose}
            className="view-invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
          <div className="view-invoice-modal-grid gap-4">
            <div className="pr-4 border-r border-[#E9E9E9]">
              <div className="view-invoice-modal-label mb-1">Select Tenancy</div>
              <div className="view-invoice-modal-data">Test</div>

              <div className="view-invoice-modal-label mb-1 mt-4">Building Name</div>
              <div className="view-invoice-modal-data">DANAT ALZAHIA</div>

              <div className="view-invoice-modal-label mb-1 mt-4">Due Date</div>
              <div className="view-invoice-modal-data">20-06-2025</div>
            </div>

            <div className="pl-4">
              <div className="view-invoice-modal-label mb-1">In Date</div>
              <div className="view-invoice-modal-data">20-05-2025</div>

              <div className="view-invoice-modal-label mb-1 mt-4">Unit Name</div>
              <div className="view-invoice-modal-data">Furniture shop</div>
            </div>
          </div>
        </div>

        {/* Invoice Charges Table */}
        <div className="md:mt-6 view-invoice-modal-overflow-x-auto border border-[#E9E9E9] rounded-md mt-[40px] mb-[70px]">
          <div className="view-invoice-modal-desktop-table">
            <table className="w-full border-collapse view-invoice-modal-table">
              <thead>
                <tr className="border-b border-[#E9E9E9] h-[57px]">
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[110px] view-invoice-charges-thead">
                    Charge
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[160px] view-invoice-charges-thead">
                    Description
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[120px] view-invoice-charges-thead">
                    Date
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[120px] view-invoice-charges-thead">
                    Amount
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[110px] view-invoice-charges-thead">
                    Select
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[60px] view-invoice-charges-thead">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[57px] hover:bg-gray-100">
                  <td className="px-[10px] py-[5px] w-[110px] view-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[160px] view-invoice-charges-tdata">
                    Lorem ipsum dolor sit amet
                  </td>
                  <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">
                    20-04-2025
                  </td>
                  <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">
                    300.20
                  </td>
                  <td className="px-[10px] py-[5px] w-[60px] text-left text-[14px] view-invoice-charges-tdata">
                    Test
                  </td>
                  <td className="px-[10px] py-[5px] w-[60px] text-left text-[14px] view-invoice-charges-tdata">
                    300.20
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="view-invoice-modal-mobile-table">
            <div className="view-invoice-modal-mobile-section">
              {/* First Header: Charge and Description */}
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Charge
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Description
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  Test
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  Lorem ipsum dolor sit amet
                </div>
              </div>

              {/* Second Header: Date and Amount */}
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Date
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Amount
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  20-04-2025
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  300.20
                </div>
              </div>

              {/* Third Header: Total */}
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
              <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  SELECT
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase ml-[70px]">
                  Total
                </div>
              </div>
              <div className="grid grid-cols-2 h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  Test
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata ml-[70px]">
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

export default ViewInvoiceModal;