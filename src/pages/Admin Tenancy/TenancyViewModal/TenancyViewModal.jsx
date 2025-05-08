import React, { useState } from "react";
import "./TenancyViewModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/close-icon.svg";

const TenancyViewModal = ({ isOpen, onClose }) => {
  const [expandedStates, setExpandedStates] = useState({
    "01": false,
    "02": false,
  });

  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isOpen) return null;

  const additionalCharges = [
    {
      id: "01",
      chargeType: "Test",
      reason: "Deposit",
      dueDate: "20-04-2025",
      status: "Pending",
      amount: "300.20",
      vat: "3.20",
      total: "303.40",
    },
    {
      id: "02",
      chargeType: "Test",
      reason: "Deposit",
      dueDate: "20-04-2025",
      status: "Pending",
      amount: "300.20",
      vat: "3.20",
      total: "303.40",
    },
  ];

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
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[110px] view-tenancy-charges-thead">
                    Charge Type
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[110px] view-tenancy-charges-thead">
                    Reason
                  </th>
                  <th className="px-[10px] text-left text-gray-700 uppercase w-[120px] view-tenancy-charges-thead">
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
                {additionalCharges.map((charge) => (
                  <tr
                    key={charge.id}
                    className="h-[57px] border-b border-[#E9E9E9] hover:bg-gray-100"
                  >
                    <td className="px-[10px] py-[5px] w-[20px] view-tenancy-charges-tdata">
                      {charge.id}
                    </td>
                    <td className="px-[10px] py-[5px] w-[110px] view-tenancy-charges-tdata">
                      {charge.chargeType}
                    </td>
                    <td className="px-[10px] py-[5px] w-[110px] view-tenancy-charges-tdata">
                      {charge.reason}
                    </td>
                    <td className="px-[10px] py-[5px] w-[120px] view-tenancy-charges-tdata">
                      {charge.dueDate}
                    </td>
                    <td className="px-[10px] py-[5px] w-[52px] text-left text-[14px] view-tenancy-charges-tdata">
                      {charge.status}
                    </td>
                    <td className="px-[10px] py-[5px] w-[61px] text-left text-[14px] view-tenancy-charges-tdata">
                      {charge.amount}
                    </td>
                    <td className="px-[10px] py-[5px] w-[30px] text-left text-[14px] view-tenancy-charges-tdata">
                      {charge.vat}
                    </td>
                    <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-tenancy-charges-tdata">
                      {charge.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mobile-table">
              {additionalCharges.map((charge) => (
                <div
                  key={charge.id}
                  className="view-tenancy-mobile-section-container"
                >
                  <div
                    className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${
                      expandedStates[charge.id] ? "bg-[#F2F2F2]" : "bg-white"
                    }`}
                  >
                    <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase">
                      NO
                    </div>
                    <div className="px-[10px] w-[40%] flex items-center view-tenancy-charges-thead uppercase">
                      CHARGE TYPE
                    </div>
                    <div className="px-[10px] w-[35%] flex items-center view-tenancy-charges-thead uppercase">
                      REASON
                    </div>
                  </div>
                  <div
                    className={`flex justify-between h-[57px] cursor-pointer ${
                      expandedStates[charge.id] ? "border-b border-[#E9E9E9]" : ""
                    }`}
                    onClick={() => toggleExpand(charge.id)}
                  >
                    <div className="px-[13px] py-[13px] text-[14px] view-tenancy-charges-tdata">
                      {charge.id}
                    </div>
                    <div className="px-[10px] py-[13px] w-[40%] text-[14px] view-tenancy-charges-tdata">
                      {charge.chargeType}
                    </div>
                    <div className="px-[10px] py-[13px] w-[35%] text-[14px] view-tenancy-charges-tdata">
                      {charge.reason}
                    </div>
                  </div>

                  {expandedStates[charge.id] && (
                    <>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase">
                          DUE DATE
                        </div>
                        <div className="px-[10px] flex items-center w-[15%] view-tenancy-charges-thead uppercase">
                          STATUS
                        </div>
                        <div className="px-[10px] flex items-center w-[28.5%] view-tenancy-charges-thead uppercase">
                          AMOUNT
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[57px]">
                        <div className="px-[9px] py-[13px] w-[90%] text-[14px] view-tenancy-charges-tdata">
                          {charge.dueDate}
                        </div>
                        <div className="py-[10px] w-[65%] text-[14px] view-tenancy-charges-tdata">
                          {charge.status}
                        </div>
                        <div className="px-[10px] py-[13px] w-[58%] text-[14px] view-tenancy-charges-tdata">
                          {charge.amount}
                        </div>
                      </div>

                      <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                        <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[50%]">
                          VAT
                        </div>
                        <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[50%]">
                          TOTAL
                        </div>
                      </div>
                      <div className="flex justify-between h-[57px]">
                        <div className="px-[13px] py-[13px] text-[14px] view-tenancy-charges-tdata text-center">
                          {charge.vat}
                        </div>
                        <div className="px-[13px] py-[13px] text-[14px] view-tenancy-charges-tdata w-[51%]">
                          {charge.total}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyViewModal;