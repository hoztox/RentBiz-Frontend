import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";

const TenancyTerminateModal = ({ isOpen, onCancel, onTerminate, tenancy }) => {
  const [dueDate, setDueDate] = useState("");
  const [inDate, setInDate] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Termination Charge");
  const [applyCharge, setApplyCharge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTerminate = async () => {
    if (applyCharge) {
      if (!dueDate || !inDate || !amount || !reason) {
        setError("Please fill all required fields for termination charge");
        return;
      }
      if (parseFloat(amount) <= 0) {
        setError("Amount must be greater than zero");
        return;
      }
    }

    if (!tenancy?.id) {
      setError("Invalid tenancy data");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = applyCharge
        ? {
            due_date: dueDate,
            in_date: inDate,
            amount: parseFloat(amount),
            reason: reason,
            apply_charge: true,
          }
        : { apply_charge: false };

      const response = await axios.put(
        `${BASE_URL}/company/tenancies/${tenancy.id}/terminate/`,
        payload
      );

      onTerminate(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process termination");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDueDate("");
    setInDate("");
    setAmount("");
    setReason("Termination Charge");
    setApplyCharge(false);
    setError(null);
    onCancel();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Terminate Tenancy
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant
                </label>
                <div className="w-full p-3 bg-gray-100 rounded-lg">
                  {tenancy?.tenant?.tenant_name || "N/A"}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={applyCharge}
                    onChange={(e) => setApplyCharge(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Apply Termination Charge
                  </span>
                </label>
              </div>

              {applyCharge && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In Date *
                    </label>
                    <input
                      type="date"
                      value={inDate}
                      onChange={(e) => setInDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Termination Charge Amount *
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason *
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter reason for termination charge"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleTerminate}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Termination"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyTerminateModal;