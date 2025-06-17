import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { Edit } from "lucide-react";

const UpdatePaymentScheduleModal = ({ tenancy, paymentSchedules, onClose, refreshSchedules }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState({
    amount: "",
    dueDate: "",
    frequency: "monthly",
  });
  const [applyToAllPending, setApplyToAllPending] = useState(false);

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setPaymentSchedule({
      amount: schedule.amount || "",
      dueDate: schedule.due_date || "",
      frequency: "monthly", // Default, adjust if needed
    });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Payment Schedule</h2>
        <div className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Schedules for {tenancy.tenancy_code}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 h-12 bg-gray-50 sticky top-0">
                    <th className="px-4 text-left text-sm font-semibold text-gray-600">Charge Type</th>
                    <th className="px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 text-left text-sm font-semibold text-gray-600">Due Date</th>
                    <th className="px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 text-right text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentSchedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-200 h-12 hover:bg-gray-50">
                      <td className="px-4 text-gray-700">{schedule.charge_type?.name || "N/A"}</td>
                      <td className="px-4 text-gray-700">{schedule.amount}</td>
                      <td className="px-4 text-gray-700">{schedule.due_date}</td>
                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            schedule.status === "pending"
                              ? "bg-orange-100 text-orange-600"
                              : schedule.status === "paid"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 text-right">
                        {schedule.status === "pending" && (
                          <button
                            onClick={() => handleEditClick(schedule)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Edit size={18} className="text-blue-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selectedSchedule && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenancy Code
                </label>
                <input
                  type="text"
                  value={tenancy.tenancy_code}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentSchedule.amount}
                  onChange={(e) => setPaymentSchedule({ ...paymentSchedule, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={paymentSchedule.dueDate}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={applyToAllPending}
                  onChange={(e) => setApplyToAllPending(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Apply to all pending payment schedules
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSchedule(null);
                    setApplyToAllPending(false);
                    setPaymentSchedule({ amount: "", dueDate: "", frequency: "monthly" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Schedule
                </button>
              </div>
            </form>
          )}
        </div>
        {!selectedSchedule && (
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePaymentScheduleModal;