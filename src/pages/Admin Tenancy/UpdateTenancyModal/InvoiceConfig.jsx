import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { BASE_URL } from "../../../utils/config";
import "./InvoiceConfig.css";

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
      await axios.put(
        `${BASE_URL}/company/tenancies/${tenancy.id}/invoice-config/`,
        {
          days_before_due: daysBeforeDue,
          combine_charges: combineCharges,
          is_active: isActive,
        }
      );
      alert(
        `Invoice configuration ${
          hasConfig ? "updated" : "created"
        } successfully!`
      );
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
    <div className="invoice-config-modal-overlay">
      <div className="invoice-config-modal-wrapper p-6">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="invoice-config-modal-head">
            Invoice Configuration for {tenancy.tenancy_code}
          </h2>
          <button
            className="invoice-config-close-btn duration-200"
            onClick={onClose}
          >
            <X size={20} className="text-black" />
          </button>
        </div>
        {error && <div className="invoice-config-error mb-4">{error}</div>}
        <div className="space-y-6">
          <div>
            <label className="invoice-config-modal-label mb-2 block">
              Days Before Due Date
            </label>
            <input
              type="number"
              value={daysBeforeDue}
              onChange={(e) => setDaysBeforeDue(parseInt(e.target.value))}
              min="1"
              className="invoice-config-input-style"
              disabled={loading}
            />
            <span className="mt-2 block invoice-config-helper-text">
              Number of days before due date to generate and send invoice
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="invoice-config-modal-label">
              Combine Charges
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={combineCharges}
                onChange={(e) => setCombineCharges(e.target.checked)}
                className="invoice-config-checkbox"
                disabled={loading}
              />
              <span className="invoice-config-helper-text">
                Combine payment schedule and additional charge in one invoice
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="invoice-config-modal-label">Active</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="invoice-config-checkbox"
                disabled={loading}
              />
              <span className="invoice-config-helper-text">
                Enable invoice automation
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 mb-1 flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`invoice-config-modal-save-btn px-4 py-2 bg-[#2892CE] text-white rounded-md hover:bg-[#2276a7] transition-colors duration-200 flex items-center${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceConfig;
