import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import { BASE_URL } from "../../../utils/config";

const InvoiceConfig = ({ tenancy, onClose }) => {
  const [daysBeforeDue, setDaysBeforeDue] = useState(7);
  const [combineCharges, setCombineCharges] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasConfig, setHasConfig] = useState(true);

  useEffect(() => {
    const fetchInvoiceConfig = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/${tenancy.id}/invoice-config/`
        );
        const config = response.data;
        setHasConfig(true);
        setDaysBeforeDue(config.days_before_due);
        setCombineCharges(config.combine_charges);
        setIsActive(config.is_active);
      } catch (err) {
        console.error("Error fetching invoice config:", err);
        setHasConfig(false);
        setError(
          err.response?.data?.error ||
          "Failed to load invoice configuration. Please save to create a new configuration."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceConfig();
  }, [tenancy.id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/company/tenancies/${tenancy.id}/invoice-config/`, {
        days_before_due: daysBeforeDue,
        combine_charges: combineCharges,
        is_active: isActive,
      });
      alert(`Invoice configuration ${hasConfig ? "updated" : "created"} successfully!`);
      setHasConfig(true);
      setError(null);
      onClose();
    } catch (err) {
      console.error("Error saving invoice config:", err);
      setError("Failed to save invoice configuration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Invoice Configuration for {tenancy.tenancy_code}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Days Before Due Date
            </label>
            <input
              type="number"
              value={daysBeforeDue}
              onChange={(e) => setDaysBeforeDue(parseInt(e.target.value))}
              min="1"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="mt-1 block text-sm text-gray-600">
              Number of days before due date to generate and send invoice
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Combine Charges
            </label>
            <input
              type="checkbox"
              checked={combineCharges}
              onChange={(e) => setCombineCharges(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              Combine PaymentSchedule and AdditionalCharge in one invoice
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Active
            </label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              Enable invoice automation
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceConfig;