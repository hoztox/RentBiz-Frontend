
import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import "./TenancyTerminateModal.css";
import { useModal } from "../../../../context/ModalContext";
import { BASE_URL } from "../../../../utils/config";

const TenancyTerminateModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [dueDate, setDueDate] = useState("");
  const [inDate, setInDate] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Termination Charge");
  const [applyCharge, setApplyCharge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Return null if modal is not open or type is not tenancy-terminate
  if (!modalState.isOpen || modalState.type !== "tenancy-terminate" || !modalState.data) {
    return null;
  }

  const tenancy = modalState.data;

  const handleTerminate = async () => {
    if (applyCharge) {
      if (!dueDate || !inDate || !amount || !reason) {
        setError("Please fill all required fields for termination charge");
        toast.error("Please fill all required fields for termination charge");
        return;
      }
      if (parseFloat(amount) <= 0) {
        setError("Amount must be greater than zero");
        toast.error("Amount must be greater than zero");
        return;
      }
    }

    if (!tenancy?.id) {
      setError("Invalid tenancy data");
      toast.error("Invalid tenancy data");
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

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to process termination");
      }

      toast.success("Tenancy terminated successfully");
      modalState.options?.onTerminate?.(response.data);
      triggerRefresh();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to process termination";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDueDate("");
    setInDate("");
    setAmount("");
    setReason("Termination Charge");
    setApplyCharge(false);
    setError(null);
    closeModal();
  };

  return (
    <div
      className="tenancy-terminate-overlay fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <Toaster />
      <div
        className="tenancy-terminate-wrapper bg-white rounded-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="tenancy-terminate-head">
            Terminate Tenancy for {tenancy?.tenancy_code || "N/A"}
          </h2>
          <button
            className="tenancy-terminate-close-btn duration-200"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} className="text-black" />
          </button>
        </div>
        {error && <div className="tenancy-terminate-error mb-4">{error}</div>}
        <div className="space-y-6">
          <div>
            <label className="tenancy-terminate-label mb-2 block">Tenant</label>
            <div className="tenancy-terminate-input-style">
              {tenancy?.tenant?.tenant_name || "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={applyCharge}
                onChange={(e) => setApplyCharge(e.target.checked)}
                className="tenancy-terminate-checkbox"
                disabled={loading}
              />
              <label className="tenancy-terminate-label">
                Apply Termination Charge
              </label>
            </div>
          </div>
          {applyCharge && (
            <>
              <div>
                <label className="tenancy-terminate-label mb-2 block">
                  In Date*
                </label>
                <input
                  type="date"
                  value={inDate}
                  onChange={(e) => setInDate(e.target.value)}
                  className="tenancy-terminate-input-style"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="tenancy-terminate-label mb-2 block">
                  Due Date*
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="tenancy-terminate-input-style"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="tenancy-terminate-label mb-2 block">
                  Termination Charge Amount*
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="tenancy-terminate-input-style"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="tenancy-terminate-label mb-2 block">
                  Reason*
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="tenancy-terminate-input-style"
                  placeholder="Enter reason for termination charge"
                  disabled={loading}
                  required
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-8 mb-1 flex justify-end gap-3">
          <button
            onClick={handleTerminate}
            disabled={loading}
            className={`tenancy-terminate-save-btn px-4 py-2 bg-[#E1473D] text-white rounded-md hover:bg-[#C43C33] flex items-center duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Confirm termination"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
  );
};

export default TenancyTerminateModal;
