import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenancyViewModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/close-icon.svg";
import printicon from "../../../assets/Images/Admin Tenancy/download-icon-blue.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import { X } from "lucide-react";

const TenancyViewModal = () => {
  const { modalState, closeModal } = useModal();
  const [expandedStates, setExpandedStates] = useState({});
  const [tenancyData, setTenancyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "tenancy-view" &&
      modalState.data
    ) {
      console.log("Modal opened with data:", modalState.data); // Debug log

      // Initialize with modalState.data
      setTenancyData(modalState.data);

      // Initialize expanded states for additional charges and payment schedules
      const initialExpandedStates = {
        ...modalState.data.additional_charges?.reduce(
          (acc, charge) => ({
            ...acc,
            [`additional-${charge.id}`]: false,
          }),
          {}
        ),
        ...modalState.data.payment_schedules?.reduce(
          (acc, schedule) => ({
            ...acc,
            [`schedule-${schedule.id}`]: false,
          }),
          {}
        ),
      };
      setExpandedStates(initialExpandedStates);

      // Optional: Fetch additional data if needed
      const fetchTenancyData = async () => {
        try {
          setError(null);
          const tenancyId = modalState.data.tenancy_code || modalState.data.id;
          console.log("Fetching tenancy with ID:", tenancyId); // Debug log

          const response = await axios.get(
            `${BASE_URL}/company/tenancies/${tenancyId}/`
          );
          const data = response.data;
          console.log("Fetched tenancy data:", data); // Debug log
          setTenancyData(data);

          // Update expanded states with fetched data
          const updatedExpandedStates = {
            ...data.additional_charges?.reduce(
              (acc, charge) => ({
                ...acc,
                [`additional-${charge.id}`]: false,
              }),
              {}
            ),
            ...data.payment_schedules?.reduce(
              (acc, schedule) => ({
                ...acc,
                [`schedule-${schedule.id}`]: false,
              }),
              {}
            ),
          };
          setExpandedStates(updatedExpandedStates);
        } catch (err) {
          console.error("Error fetching tenancy data:", err);
          setError("Failed to fetch tenancy data");
          // Keep modalState.data as fallback
        }
      };

      // Uncomment the following line if you still want to fetch additional data
      // fetchTenancyData();
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = async () => {
    try {
      const tenancyId = modalState.data.id || modalState.data.tenancy_code;
      const response = await axios.get(
        `${BASE_URL}/company/tenancy/${tenancyId}/download-pdf/`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tenancy_${tenancyId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  // Only render for "tenancy-view" type
  if (!modalState.isOpen || modalState.type !== "tenancy-view") return null;

  if (error && !tenancyData)
    return (
      <div className="view-modal-overlay fixed inset-0 flex items-center justify-center transition-colors z-50">
        <div className="view-modal-container bg-white rounded-md p-6 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="tenancy-view-modal-head">Error</h2>
            <button
              onClick={closeModal}
              className="tenancy-view-modal-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
            </button>
          </div>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );

  if (!tenancyData) return null;

  return (
    <div
      onClick={closeModal}
      className="view-modal-overlay fixed inset-0 flex items-center justify-center transition-colors z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="view-modal-container bg-white rounded-md p-6 transition-all desktop-scrollable-content"
      >
        <div className="flex justify-between items-center mt-[5px] md:mb-[30px]">
          <h2 className="tenancy-view-modal-head">Tenancy View</h2>
          <div className="flex items-center gap-[19px]">
            <button
              onClick={handlePrint}
              className="tenancy-view-modal-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={printicon} alt="Print" className="w-[20px] h-[20px]" />
            </button>
            <button
              onClick={closeModal}
              className="tenancy-view-modal-close-btn hover:bg-gray-100 duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div>
          {/* Tenancy Details */}
          <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="pr-0 md:pr-4 border-r-0 md:border-r border-[#E9E9E9]">
                <div className="tenancy-view-modal-label mb-1">Tenant Name</div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.tenant?.tenant_name ||
                    tenancyData.tenant?.name ||
                    "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">Unit</div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.unit?.unit_name ||
                    tenancyData.unit?.name ||
                    "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Start Date
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.start_date || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  No. of Payments
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.no_payments || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Rent Per Frequency
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.rent_per_frequency || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Deposit (if Any)
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.deposit || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Remarks
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.remarks || "N/A"}
                </div>
              </div>
              <div className="pl-0 md:pl-4">
                <div className="tenancy-view-modal-label mb-1">Building</div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.building?.building_name ||
                    tenancyData.building?.name ||
                    "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Rental Months
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.rental_months || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  End Date
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.end_date || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  First Rent Due On
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.first_rent_due_on || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Total Rent Receivable
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.total_rent_receivable || "N/A"}
                </div>
                <div className="tenancy-view-modal-label mb-1 mt-4">
                  Commission (If Any)
                </div>
                <div className="tenancy-view-modal-data">
                  {tenancyData.commission || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Charges Table */}
          <div className="mt-[32px] mb-[50px]">
            <h3 className="text-[#2892CE] additional-charges-heading">
              Additional Charges
            </h3>
            <div className="mt-5 border border-[#E9E9E9] rounded-md overflow-hidden">
              {tenancyData.additional_charges &&
              tenancyData.additional_charges.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="desktop-table">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr className="border-b border-[#E9E9E9] h-[57px]">
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[40px] view-tenancy-charges-thead">
                              No
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Charge Type
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Reason
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Due Date
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-tenancy-charges-thead">
                              Status
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-tenancy-charges-thead">
                              Amount
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[50px] view-tenancy-charges-thead">
                              Tax
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[44px] view-tenancy-charges-thead">
                              Total
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className="max-h-64 overflow-y-auto overflow-x-auto border-t border-[#E9E9E9]">
                      <table className="w-full border-collapse">
                        <tbody>
                          {tenancyData.additional_charges.map(
                            (charge, index) => (
                              <tr
                                key={charge.id || index}
                                className="h-[57px] border-b border-[#E9E9E9] last:border-b-0 hover:bg-gray-100"
                              >
                                <td className="px-[10px] py-[5px] w-[40px] view-tenancy-charges-tdata">
                                  {index + 1}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {charge.charge_type || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {charge.reason || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {charge.due_date || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[80px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {charge.status || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[80px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {charge.amount || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[50px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {charge.tax || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {charge.total || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Table */}
                  <div className="mobile-table">
                    {tenancyData.additional_charges.map((charge, index) => (
                      <div
                        key={charge.id || index}
                        className="view-tenancy-mobile-section-container border-b border-[#E9E9E9] last:border-b-0"
                      >
                        <div
                          className={`flex justify-between h-[57px] bg-[#F2F2F2] ${
                            expandedStates[`additional-${charge.id || index}`]
                              ? "rounded-t"
                              : ""
                          }`}
                          onClick={() =>
                            toggleExpand(`additional-${charge.id || index}`)
                          }
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
                            expandedStates[`additional-${charge.id || index}`]
                              ? "border-b border-[#E9E9E9]"
                              : ""
                          }`}
                        >
                          <div className="px-[13px] py-[13px] text-[14px] view-tenancy-charges-tdata">
                            {index + 1}
                          </div>
                          <div className="px-[10px] py-[13px] w-[40%] text-[14px] view-tenancy-charges-tdata">
                            {charge.charge_type || "N/A"}
                          </div>
                          <div className="px-[10px] py-[13px] w-[35%] text-[14px] view-tenancy-charges-tdata">
                            {charge.reason || "N/A"}
                          </div>
                        </div>
                        {expandedStates[`additional-${charge.id || index}`] && (
                          <>
                            <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[33%]">
                                DUE DATE
                              </div>
                              <div className="px-[10px] flex items-center w-[33%] view-tenancy-charges-thead uppercase">
                                STATUS
                              </div>
                              <div className="px-[10px] flex items-center w-[33%] view-tenancy-charges-thead uppercase">
                                AMOUNT
                              </div>
                            </div>
                            <div className="flex justify-between h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {charge.due_date || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {charge.status || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {charge.amount || "N/A"}
                              </div>
                            </div>
                            <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[50%]">
                                TAX
                              </div>
                              <div className="px-[10px] flex items-center w-[50%] view-tenancy-charges-thead uppercase">
                                TOTAL
                              </div>
                            </div>
                            <div className="flex justify-between h-[57px]">
                              <div className="px-[10px] py-[13px] w-[50%] text-[14px] view-tenancy-charges-tdata">
                                {charge.tax || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[50%] text-[14px] view-tenancy-charges-tdata">
                                {charge.total || "N/A"}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No additional charges found
                </div>
              )}
            </div>
          </div>

          {/* Payment Schedule Table */}
          <div className="mt-[32px] mb-[50px]">
            <h3 className="text-[#2892CE] additional-charges-heading">
              Payment Schedule
            </h3>
            <div className="mt-5 border border-[#E9E9E9] rounded-md overflow-hidden">
              {tenancyData.payment_schedules &&
              tenancyData.payment_schedules.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="desktop-table">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr className="border-b border-[#E9E9E9] h-[57px]">
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[40px] view-tenancy-charges-thead">
                              No
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Charge Type
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Reason
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-tenancy-charges-thead">
                              Due Date
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-tenancy-charges-thead">
                              Status
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-tenancy-charges-thead">
                              Amount
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[50px] view-tenancy-charges-thead">
                              Tax
                            </th>
                            <th className="px-[10px] text-left text-gray-700 uppercase w-[44px] view-tenancy-charges-thead">
                              Total
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div className="max-h-64 overflow-y-auto overflow-x-auto border-t border-[#E9E9E9]">
                      <table className="w-full border-collapse">
                        <tbody>
                          {tenancyData.payment_schedules.map(
                            (schedule, index) => (
                              <tr
                                key={schedule.id || index}
                                className="h-[57px] border-b border-[#E9E9E9] last:border-b-0 hover:bg-gray-100"
                              >
                                <td className="px-[10px] py-[5px] w-[40px] view-tenancy-charges-tdata">
                                  {index + 1}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {schedule.charge_type_name ||
                                    schedule.charge_type ||
                                    "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {schedule.reason || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[100px] view-tenancy-charges-tdata">
                                  {schedule.due_date || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[80px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {schedule.status || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[80px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {schedule.amount || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[50px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {schedule.tax || "N/A"}
                                </td>
                                <td className="px-[10px] py-[5px] w-[44px] text-left text-[14px] view-tenancy-charges-tdata">
                                  {schedule.total || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Table */}
                  <div className="mobile-table">
                    {tenancyData.payment_schedules.map((schedule, index) => (
                      <div
                        key={schedule.id || index}
                        className="view-tenancy-mobile-section-container border-b border-[#E9E9E9] last:border-b-0"
                      >
                        <div
                          className={`flex justify-between h-[57px] bg-[#F2F2F2] ${
                            expandedStates[`schedule-${schedule.id || index}`]
                              ? "rounded-t"
                              : ""
                          }`}
                          onClick={() =>
                            toggleExpand(`schedule-${schedule.id || index}`)
                          }
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
                            expandedStates[`schedule-${schedule.id || index}`]
                              ? "border-b border-[#E9E9E9]"
                              : ""
                          }`}
                        >
                          <div className="px-[13px] py-[13px] text-[14px] view-tenancy-charges-tdata">
                            {index + 1}
                          </div>
                          <div className="px-[10px] py-[13px] w-[40%] text-[14px] view-tenancy-charges-tdata">
                            {schedule.charge_type_name ||
                              schedule.charge_type ||
                              "N/A"}
                          </div>
                          <div className="px-[10px] py-[13px] w-[35%] text-[14px] view-tenancy-charges-tdata">
                            {schedule.reason || "N/A"}
                          </div>
                        </div>
                        {expandedStates[`schedule-${schedule.id || index}`] && (
                          <>
                            <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[33%]">
                                DUE DATE
                              </div>
                              <div className="px-[10px] flex items-center w-[33%] view-tenancy-charges-thead uppercase">
                                STATUS
                              </div>
                              <div className="px-[10px] flex items-center w-[33%] view-tenancy-charges-thead uppercase">
                                AMOUNT
                              </div>
                            </div>
                            <div className="flex justify-between h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {schedule.due_date || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {schedule.status || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[33%] text-[14px] view-tenancy-charges-tdata">
                                {schedule.amount || "N/A"}
                              </div>
                            </div>
                            <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                              <div className="px-[10px] flex items-center view-tenancy-charges-thead uppercase w-[50%]">
                                TAX
                              </div>
                              <div className="px-[10px] flex items-center w-[50%] view-tenancy-charges-thead uppercase">
                                TOTAL
                              </div>
                            </div>
                            <div className="flex justify-between h-[57px]">
                              <div className="px-[10px] py-[13px] w-[50%] text-[14px] view-tenancy-charges-tdata">
                                {schedule.tax || "N/A"}
                              </div>
                              <div className="px-[10px] py-[13px] w-[50%] text-[14px] view-tenancy-charges-tdata">
                                {schedule.total || "N/A"}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No payment schedules found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyViewModal;