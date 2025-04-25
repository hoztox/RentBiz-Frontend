import React from "react";
import "./ViewInvoiceModal.css";
import closeicon from "../../../assets/Images/Invoice/close-icon.svg";

const ViewInvoiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-[1006px] h-[460px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="invoice-view-modal-head">Invoice View</h2>
          <button
            onClick={onClose}
            className="invoice-view-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="pr-4 border-r border-[#E9E9E9]">
              <div className="invoice-view-modal-label mb-1">
                Select Tenancy
              </div>
              <div className="invoice-view-modal-data">Test</div>

              <div className="invoice-view-modal-label mb-1 mt-4">
                Building Name
              </div>
              <div className="invoice-view-modal-data">DANAT ALZAHIA</div>

              <div className="invoice-view-modal-label mb-1 mt-4">Due Date</div>
              <div className="invoice-view-modal-data">20-06-2025</div>
            </div>

            <div className="pl-4">
              <div className="invoice-view-modal-label mb-1">In Date</div>
              <div className="invoice-view-modal-data">20-05-2025</div>

              <div className="invoice-view-modal-label mb-1 mt-4">
                Unit Name
              </div>
              <div className="invoice-view-modal-data">Furniture shop</div>
            </div>
          </div>
        </div>

        {/* Invoice Charges Table */}
        <div className="mt-6 overflow-x-auto border border-[#E9E9E9] rounded-md">
          <table className="w-full border-collapse">
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
                <th className="px-[10px] text-left text-gray-700 uppercase w-[60px] view-invoice-charges-thead">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-[57px] hover:bg-gray-100">
                {/* CHARGE */}
                <td className="px-[10px] py-[5px] w-[110px] view-invoice-charges-tdata">
                  Test
                </td>

                {/* DESCRIPTION */}
                <td className="px-[10px] py-[5px] w-[160px] view-invoice-charges-tdata">
                  Lorem ipsum dolor sit amet
                </td>

                {/* DATE */}
                <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">
                  20-04-2025
                </td>

                {/* AMOUNT */}
                <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">
                  300.20
                </td>

                {/* TOTAL */}
                <td className="px-[10px] py-[5px] w-[60px] text-left text-[14px] view-invoice-charges-tdata">
                  300.20
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;
