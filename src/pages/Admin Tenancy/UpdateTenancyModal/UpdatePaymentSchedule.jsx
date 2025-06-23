import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { X } from "lucide-react";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import tickicon from "../../../assets/Images/Admin Tenancy/tick-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { motion, AnimatePresence } from "framer-motion";
import "./UpdatePaymentScheduleModal.css";

const UpdatePaymentScheduleModal = ({
  tenancy,
  paymentSchedules,
  onClose,
  refreshSchedules,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState({
    amount: "",
    dueDate: "",
    frequency: "monthly",
  });
  const [applyToAllPending, setApplyToAllPending] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const handleEditClick = (schedule) => {
    setSelectedSchedule(selectedSchedule === schedule ? null : schedule);
    setPaymentSchedule({
      amount: schedule.amount || "",
      dueDate: schedule.due_date || "",
      frequency: "monthly",
    });
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: paymentSchedule.amount,
        apply_to_all_pending: applyToAllPending,
      };

      await axios.patch(
        `${BASE_URL}/company/tenancies/${tenancy.id}/payment-schedules/${selectedSchedule.id}/`,
        payload
      );
      await refreshSchedules();
      setSelectedSchedule(null);
      setApplyToAllPending(false);
      setPaymentSchedule({ amount: "", dueDate: "", frequency: "monthly" });
      alert("Payment schedule updated successfully!");
    } catch (error) {
      console.error("Error updating payment schedule:", error);
      alert("Failed to update payment schedule.");
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      onClick={onClose}
      className="update-schedule-modal-overlay fixed inset-0 flex items-center justify-center transition-colors z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-schedule-modal-container bg-white rounded-md p-6 transition-all desktop-scrollable-content"
      >
        <div className="flex justify-between items-center mt-[5px] md:mb-[30px]">
          <h2 className="update-schedule-modal-head">
            Update Payment Schedule
          </h2>
          <button
            onClick={onClose}
            className="update-schedule-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="payment-schedules-heading mb-5">
          Payment Schedules for {tenancy.tenancy_code}
        </h3>

        <div className="border border-[#E9E9E9] rounded-md mb-6 overflow-hidden">
          {/* Desktop Table */}
          <div className="desktop-table">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="border-b border-[#E9E9E9] h-[57px]">
                    <th className="px-[20px] text-left uppercase w-[100px] update-schedule-thead">
                      Charge Type
                    </th>
                    <th className="px-[10px] text-left uppercase w-[100px] update-schedule-thead">
                      Amount
                    </th>
                    <th className="px-[10px] text-left uppercase w-[100px] update-schedule-thead">
                      Due Date
                    </th>
                    <th className="px-[10px] text-left uppercase w-[80px] update-schedule-thead">
                      Status
                    </th>
                    <th className="px-[10px] text-left uppercase w-[50px] update-schedule-thead">
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="table-body-container overflow-y-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {paymentSchedules.map((schedule) => (
                    <React.Fragment key={schedule.id}>
                      <tr className="h-[57px] border-b border-[#E9E9E9] last:border-b-0 hover:bg-gray-100">
                        <td className="px-[20px] py-[5px] w-[100px] update-schedule-tdata">
                          {schedule.charge_type?.name || "N/A"}
                        </td>
                        <td className="px-[10px] py-[5px] w-[100px] update-schedule-tdata">
                          {schedule.amount}
                        </td>
                        <td className="px-[10px] py-[5px] w-[100px] update-schedule-tdata">
                          {schedule.due_date}
                        </td>
                        <td className="px-[10px] py-[5px] w-[80px] update-schedule-tdata">
                          <span
                            className={`px-3 py-1 rounded-md text-sm ${
                              schedule.status === "pending"
                                ? "bg-[#FFF7E9] text-[#FBAD27]"
                                : schedule.status === "paid"
                                ? "bg-[#DDF6E8] text-[#28C76F]"
                                : "bg-[#E8EFF6] text-[#1458A2]"
                            }`}
                          >
                            {schedule.status.charAt(0).toUpperCase() +
                              schedule.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-[10px] py-[5px] w-[50px] update-schedule-tdata">
                          {(schedule.status === "pending" ||
                            schedule.status === "invoice") && (
                            <button
                              onClick={() =>
                                schedule.status === "pending"
                                  ? handleEditClick(schedule)
                                  : null
                              }
                              className={`${
                                schedule.status === "invoice"
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                              }`}
                              disabled={schedule.status === "invoice"}
                            >
                              <img
                                src={editicon}
                                alt="Edit"
                                className={`w-[18px] h-[18px] ml-3 edit-btn duration-200 ${
                                  schedule.status === "invoice"
                                    ? "opacity-50"
                                    : ""
                                }`}
                              />
                            </button>
                          )}
                        </td>
                      </tr>
                      {selectedSchedule?.id === schedule.id && (
                        <tr className="border-b last:border-0">
                          <td
                            colSpan={5}
                            className="px-[20px] py-[15px] h-[96px]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {/* Tenancy Code */}
                                <div className="w-[164px]">
                                  <label className="block mb-1.5 payment-field-label">
                                    Tenancy Code
                                  </label>
                                  <input
                                    type="text"
                                    value={tenancy.tenancy_code}
                                    disabled
                                    className="w-full h-[38px] payment-input-field"
                                  />
                                </div>

                                {/* Payment Amount */}
                                <div className="w-[164px]">
                                  <label className="block mb-1.5 payment-field-label">
                                    Payment Amount
                                  </label>
                                  <input
                                    type="number"
                                    value={paymentSchedule.amount}
                                    onChange={(e) =>
                                      setPaymentSchedule({
                                        ...paymentSchedule,
                                        amount: e.target.value,
                                      })
                                    }
                                    className="w-full h-[38px] payment-input-field"
                                    placeholder="Enter amount"
                                    required
                                  />
                                </div>

                                {/* Due Date */}
                                <div className="w-[164px]">
                                  <label className="block mb-1.5 payment-field-label">
                                    Due Date
                                  </label>
                                  <input
                                    type="date"
                                    value={paymentSchedule.dueDate}
                                    disabled
                                    className="w-full h-[38px] payment-input-field"
                                  />
                                </div>

                                {/* Checkbox */}
                                <div className="relative top-5 flex items-center min-w-[250px]">
                                  <input
                                    type="checkbox"
                                    id={`applyToAll-${schedule.id}`}
                                    checked={applyToAllPending}
                                    onChange={(e) =>
                                      setApplyToAllPending(e.target.checked)
                                    }
                                    className="h-[15px] w-[15px] apply-to-all-checkbox"
                                  />
                                  <label
                                    htmlFor={`applyToAll-${schedule.id}`}
                                    className="ml-2 whitespace-nowrap apply-to-all-label"
                                  >
                                    Apply to all pending payment schedules
                                  </label>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="relative top-3 flex items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSchedule(null);
                                    setApplyToAllPending(false);
                                    setPaymentSchedule({
                                      amount: "",
                                      dueDate: "",
                                      frequency: "monthly",
                                    });
                                  }}
                                  className="w-[32px] h-[32px] flex items-center justify-center border border-[#FF725E] bg-white rounded hover:bg-red-100 duration-200"
                                >
                                  <X size={20} color="#FF725E" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSubmit}
                                  className="w-[32px] h-[32px] flex items-center justify-center border border-[#138567] bg-white rounded hover:bg-green-100 duration-200"
                                >
                                  <img src={tickicon} alt="Save" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table */}
          <div className="mobile-table block md:hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="payment-table-row-head">
                  <th className="px-5 w-[50%] text-left update-schedule-thead payment-charge-column">
                    CHARGE TYPE
                  </th>
                  <th className="px-3 w-[50%] text-left update-schedule-thead payment-amount-column">
                    AMOUNT
                  </th>
                  <th className="px-5 text-right update-schedule-thead"></th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedules.map((schedule) => (
                  <React.Fragment key={schedule.id}>
                    <tr
                      className={`${
                        expandedRows[schedule.id]
                          ? "payment-mobile-no-border"
                          : "payment-mobile-with-border"
                      } border-b border-[#E9E9E9] h-[57px]`}
                    >
                      <td className="px-5 text-left update-schedule-tdata payment-charge-column">
                        {schedule.charge_type?.name || "N/A"}
                      </td>
                      <td className="px-3 text-left update-schedule-tdata payment-amount-column">
                        {schedule.amount}
                      </td>
                      <td className="py-4 flex items-center justify-end h-[57px]">
                        <div
                          className={`payment-dropdown-field ${
                            expandedRows[schedule.id] ? "active" : ""
                          }`}
                          onClick={() => toggleRowExpand(schedule.id)}
                        >
                          <img
                            src={downarrow}
                            alt="drop-down-arrow"
                            className={`payment-dropdown-img ${
                              expandedRows[schedule.id] ? "text-white" : ""
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedRows[schedule.id] && (
                        <motion.tr
                          className="payment-mobile-with-border border-b border-[#E9E9E9]"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <td colSpan={3} className="px-5">
                            <div className="payment-dropdown-content">
                              {/* Single row with all three items */}
                              <div className="payment-grid grid grid-cols-3 gap-4">
                                <div className="payment-grid-item w-[40%]">
                                  <div className="payment-dropdown-label">
                                    DUE DATE
                                  </div>
                                  <div className="payment-dropdown-value">
                                    {schedule.due_date}
                                  </div>
                                </div>
                                <div className="payment-grid-item w-[30%]">
                                  <div className="payment-dropdown-label">
                                    STATUS
                                  </div>
                                  <div className="payment-dropdown-value">
                                    <span
                                      className={`px-3 py-1 rounded-md text-sm payment-status ${
                                        schedule.status === "pending"
                                          ? "bg-[#FFF7E9] text-[#FBAD27]"
                                          : schedule.status === "paid"
                                          ? "bg-[#DDF6E8] text-[#28C76F]"
                                          : "bg-[#E8EFF6] text-[#1458A2]"
                                      }`}
                                    >
                                      {schedule.status.charAt(0).toUpperCase() +
                                        schedule.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <div className="payment-grid-item payment-action-column w-[15%]">
                                  <div className="payment-dropdown-label">
                                    ACTION
                                  </div>
                                  <div className="payment-dropdown-value payment-flex payment-items-center payment-gap-2">
                                    {(schedule.status === "pending" ||
                                      schedule.status === "invoice") && (
                                      <button
                                        onClick={() =>
                                          schedule.status === "pending"
                                            ? handleEditClick(schedule)
                                            : null
                                        }
                                        className={`${
                                          schedule.status === "invoice"
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                        }`}
                                        disabled={schedule.status === "invoice"}
                                      >
                                        <img
                                          src={editicon}
                                          alt="Edit"
                                          className={`w-[18px] h-[18px] mt-2 edit-btn duration-200 ${
                                            schedule.status === "invoice"
                                              ? "opacity-50"
                                              : ""
                                          }`}
                                        />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Mobile Edit Form */}
                              {selectedSchedule?.id === schedule.id && (
                                <div className="mobile-edit-form mt-4 p-4 bg-gray-50 rounded-md">
                                  <div className="space-y-4">
                                    {/* Tenancy Code */}
                                    <div>
                                      <label className="block mb-1.5 payment-field-label">
                                        Tenancy Code
                                      </label>
                                      <input
                                        type="text"
                                        value={tenancy.tenancy_code}
                                        disabled
                                        className="w-full h-[38px] payment-input-field"
                                      />
                                    </div>

                                    {/* Payment Amount */}
                                    <div>
                                      <label className="block mb-1.5 payment-field-label">
                                        Payment Amount
                                      </label>
                                      <input
                                        type="number"
                                        value={paymentSchedule.amount}
                                        onChange={(e) =>
                                          setPaymentSchedule({
                                            ...paymentSchedule,
                                            amount: e.target.value,
                                          })
                                        }
                                        className="w-full h-[38px] payment-input-field"
                                        placeholder="Enter amount"
                                        required
                                      />
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                      <label className="block mb-1.5 payment-field-label">
                                        Due Date
                                      </label>
                                      <input
                                        type="date"
                                        value={paymentSchedule.dueDate}
                                        disabled
                                        className="w-full h-[38px] payment-input-field"
                                      />
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`mobile-applyToAll-${schedule.id}`}
                                        checked={applyToAllPending}
                                        onChange={(e) =>
                                          setApplyToAllPending(e.target.checked)
                                        }
                                        className="h-[15px] w-[15px] apply-to-all-checkbox"
                                      />
                                      <label
                                        htmlFor={`mobile-applyToAll-${schedule.id}`}
                                        className="ml-2 apply-to-all-label"
                                      >
                                        Apply to all pending payment schedules
                                      </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end space-x-3 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSchedule(null);
                                          setApplyToAllPending(false);
                                          setPaymentSchedule({
                                            amount: "",
                                            dueDate: "",
                                            frequency: "monthly",
                                          });
                                        }}
                                        className="w-[32px] h-[32px] flex items-center justify-center border border-[#FF725E] bg-white rounded hover:bg-red-100 duration-200"
                                      >
                                        <X size={20} color="#FF725E" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-[32px] h-[32px] flex items-center justify-center border border-[#138567] bg-white rounded hover:bg-green-100 duration-200"
                                      >
                                        <img src={tickicon} alt="Save" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePaymentScheduleModal;