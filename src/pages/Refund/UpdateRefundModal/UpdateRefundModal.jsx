import React, { useState, useEffect } from "react";
import "./UpdateRefundModal.css";
import { ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const UpdateRefundModal = () => {
  const { modalState, closeModal } = useModal();
  console.log("Modal State:", modalState);
  const [form, setForm] = useState({
    tenancy_id: "",
    paymentDate: "",
    paymentMethod: "",
    remarks: "",
    amountToRefund: "",
    accountHolderName: "",
    accountNumber: "",
    referenceNumber: "",
    chequeNumber: "",
    chequeDate: "",
  });
  const [refundData, setRefundData] = useState({
    depositAmount: 0,
    excessAmount: 0,
    totalRefundable: 0,
    alreadyRefunded: 0,
    refundItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSelectOpenPaymentMethod, setIsSelectOpenPaymentMethod] = useState(false);

  const fetchRefundData = async (refundId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${BASE_URL}/finance/refunds/?search=${refundId}`);
      const refund = response.data.results?.find(r => r.id === refundId);
      if (!refund) {
        throw new Error("Refund not found");
      }
      setForm({
        tenancy_id: refund.tenancy?.id || "",
        paymentDate: refund.processed_date || "",
        paymentMethod: refund.refund_method || "",
        remarks: refund.reason || "",
        amountToRefund: refund.amount || "",
        accountHolderName: refund.account_holder_name || "",
        accountNumber: refund.account_number || "",
        referenceNumber: refund.reference_number || "",
        chequeNumber: refund.cheque_number || "",
        chequeDate: refund.cheque_date || "",
      });

      // Fetch excess deposits for the tenancy
      const excessResponse = await axios.get(
        `${BASE_URL}/finance/${refundId}/excess-deposits/`
      );
      const data = excessResponse.data;
      console.log("Excess Deposits Data:", data);
      setRefundData({
        depositAmount: data.deposit_amount || 0,
        excessAmount: data.excess_amount || 0,
        totalRefundable: data.total_refundable || 0,
        alreadyRefunded: data.already_refunded || 0,
        refundItems: data.refund_items || [],
      });
    } catch (err) {
      console.error("Error fetching refund data:", err);
      setError("Failed to load refund data");
      toast.error("Failed to load refund data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-refund" && modalState.data?.id) {
      fetchRefundData(modalState.data.id);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
      console.error(`Invalid date format: ${dateStr}, expected YYYY-MM-DD`);
      return "";
    }
    return dateStr;
  };

  const handleUpdate = async () => {
    const {
      tenancy_id,
      paymentDate,
      paymentMethod,
      amountToRefund,
      accountHolderName,
      accountNumber,
      referenceNumber,
      chequeNumber,
      chequeDate,
    } = form;
    const { totalRefundable, alreadyRefunded } = refundData;

    let requiredFields = [
      tenancy_id,
      paymentDate,
      paymentMethod,
      amountToRefund,
    ];
    if (paymentMethod === "bank_transfer" || paymentMethod === "cheque") {
      requiredFields.push(accountHolderName, accountNumber, referenceNumber);
    }
    if (paymentMethod === "cheque") {
      requiredFields.push(chequeNumber, chequeDate);
    }

    if (!requiredFields.every((field) => field)) {
      setError("Please fill all required fields.");
      toast.error("Please fill all required fields.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
      setError(
        "Invalid payment date format. Please select a valid date (YYYY-MM-DD)."
      );
      toast.error(
        "Invalid payment date format. Please select a valid date (YYYY-MM-DD)."
      );
      return;
    }
    if (paymentMethod === "cheque" && !/^\d{4}-\d{2}-\d{2}$/.test(chequeDate)) {
      setError(
        "Invalid cheque date format. Please select a valid date (YYYY-MM-DD)."
      );
      toast.error(
        "Invalid cheque date format. Please select a valid date (YYYY-MM-DD)."
      );
      return;
    }

    if (
      parseFloat(amountToRefund) <= 0 ||
      parseFloat(amountToRefund) > totalRefundable - alreadyRefunded
    ) {
      setError("Please enter a valid refund amount");
      toast.error("Please enter a valid refund amount");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const payload = {
        tenancy_id: parseInt(tenancy_id),
        amount_refunded: parseFloat(amountToRefund),
        payment_method: paymentMethod,
        payment_date: formatDateForBackend(paymentDate),
        remarks: form.remarks || "",
        reference_number: referenceNumber || null,
        ...(paymentMethod === "bank_transfer" || paymentMethod === "cheque"
          ? {
              account_holder_name: accountHolderName,
              account_number: accountNumber,
            }
          : {}),
        ...(paymentMethod === "cheque"
          ? {
              cheque_number: chequeNumber,
              cheque_date: formatDateForBackend(chequeDate),
            }
          : {}),
      };

      const response = await axios.put(
        `${BASE_URL}/finance/refunds/${modalState.data.id}/`,
        payload
      );
      console.log("Refund updated:", response.data);
      toast.success("Refund updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Failed to update refund:", err);
      setError("Failed to update refund. Please try again.");
      toast.error("Failed to update refund. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!modalState.isOpen || modalState.type !== "update-refund") {
    return null;
  }

  return (
    <div className="update-refund-modal-wrapper">
      <Toaster />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 update-refund-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 update-refund-modal-container">
          {/* Header */}
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] update-refund-head">Update Refund</h2>
            <button
              onClick={closeModal}
              className="update-refund-close-btn hover:bg-gray-100 duration-200"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="px-6 py-2 bg-blue-100 text-blue-700 text-sm">
              Loading...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-6 py-2 bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Scrollable Content */}
          <div className="md:p-6 md:mt-[-15px]">
            <div className="grid gap-6 update-refund-modal-grid">
              {/* Refund Summary Section */}
              <div className="update-refund-modal-table-wrapper">
                <div className="mt-[5px]">
                  <h3 className="mb-5 -mt-3 refund-section-title">
                    Refund Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1.5 update-refund-label">Deposit Amount</p>
                      <p className="text-[#1458A2] refund-amount-value">
                        ${refundData.depositAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 update-refund-label">Excess Amount</p>
                      <p className="text-[#1458A2] refund-amount-value">
                        ${refundData.excessAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Amount Section */}
              <div className="update-refund-modal-table-wrapper">
                <div className="mt-[5px]">
                  <h3 className="text-lg font-semibold mb-5 -mt-3 refund-section-title">
                    Refund Amount
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="mb-1.5 update-refund-label">
                        Total Refundable
                      </p>
                      <p className="text-[#1458A2] refund-amount-value">
                        ${refundData.totalRefundable.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 update-refund-label">
                        Already Refunded
                      </p>
                      <p className="text-[#1458A2] refund-amount-value">
                        ${refundData.alreadyRefunded.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block update-refund-label">
                  Amount to Refund*
                </label>
                <input
                  type="number"
                  value={form.amountToRefund}
                  onChange={(e) => updateForm("amountToRefund", e.target.value)}
                  placeholder="Enter amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block update-refund-label">Payment Date*</label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => updateForm("paymentDate", e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block update-refund-label">
                  Payment Method*
                </label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => {
                      updateForm("paymentMethod", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("update-refund-selected");
                      } else {
                        e.target.classList.remove("update-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenPaymentMethod(true)}
                    onBlur={() => setIsSelectOpenPaymentMethod(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-selection ${
                      form.paymentMethod === "" ? "update-refund-selected" : ""
                    }`}
                    disabled={loading}
                  >
                    <option value="" disabled hidden>
                      Choose
                    </option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="online_payment">Online Payment</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpenPaymentMethod ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {(form.paymentMethod === "bank_transfer" ||
                form.paymentMethod === "cheque") && (
                <>
                  <div className="space-y-2">
                    <label className="block update-refund-label">
                      Account Holder Name*
                    </label>
                    <input
                      type="text"
                      value={form.accountHolderName}
                      onChange={(e) =>
                        updateForm("accountHolderName", e.target.value)
                      }
                      placeholder="Enter Account Holder Name"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block update-refund-label">
                      Account Number*
                    </label>
                    <input
                      type="text"
                      value={form.accountNumber}
                      onChange={(e) =>
                        updateForm("accountNumber", e.target.value)
                      }
                      placeholder="Enter Account Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block update-refund-label">
                      Reference Number*
                    </label>
                    <input
                      type="text"
                      value={form.referenceNumber}
                      onChange={(e) =>
                        updateForm("referenceNumber", e.target.value)
                      }
                      placeholder="Enter Reference Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {form.paymentMethod === "cheque" && (
                <>
                  <div className="space-y-2">
                    <label className="block update-refund-label">
                      Cheque Number*
                    </label>
                    <input
                      type="text"
                      value={form.chequeNumber}
                      onChange={(e) =>
                        updateForm("chequeNumber", e.target.value)
                      }
                      placeholder="Enter Cheque Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block update-refund-label">
                      Cheque Date*
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.chequeDate}
                        onChange={(e) =>
                          updateForm("chequeDate", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 mb-1">
                <label className="block update-refund-label">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => updateForm("remarks", e.target.value)}
                  placeholder="Enter Remarks"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-refund-input"
                  disabled={loading}
                />
              </div>

              {/* Detailed Refund Items Table */}
              {refundData.refundItems.length > 0 && (
                <div className="update-refund-modal-table-wrapper">
                  <div className="mt-[10px]">
                    <h3 className="mb-5 -mt-3 refund-section-title">
                      Detailed Breakdown
                    </h3>
                    <div className="overflow-x-auto border border-[#E9E9E9] rounded-md update-refund-modal-overflow-x-auto">
                      <div className="update-refund-modal-desktop-table">
                        <table className="w-full border-collapse update-refund-modal-table">
                          <thead>
                            <tr className="border-b border-[#E9E9E9] h-[57px]">
                              <th className="!pl-[10px] text-left refund-modal-thead uppercase w-[100px]">
                                Charge
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[100px]">
                                Date
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[100px]">
                                Amount
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[80px]">
                                Tax
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[80px]">
                                Total
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[80px]">
                                Excess
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[140px]">
                                Total Refundable
                              </th>
                              <th className="text-left refund-modal-thead uppercase w-[150px]">
                                Invoice Collections
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {refundData.refundItems.map((item, index) => (
                              <tr
                                key={`${item.type}-${item.id}`}
                                className="border-b h-[57px] last:border-0 hover:bg-gray-100"
                              >
                                <td className="!pl-[10px] text-left text-[#201D1E]">
                                  {item.charge_type}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  {item.due_date}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  ${Number(item.original_amount).toFixed(2)}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  ${Number(item.tax).toFixed(2)}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  ${Number(item.total).toFixed(2)}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  ${Number(item.excess_amount).toFixed(2)}
                                </td>
                                <td className="text-left text-[#201D1E]">
                                  ${Number(item.total_refundable).toFixed(2)}
                                </td>
                                <td className="text-left text-[#201D1E] last:border-r-0">
                                  {Object.entries(
                                    item.collections_per_invoice
                                  ).map(([invoice, amount]) => (
                                    <div key={invoice}>{`${invoice}: $${Number(
                                      amount
                                    ).toFixed(2)}`}</div>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="update-refund-modal-mobile-table">
                        {refundData.refundItems.map((item, index) => (
                          <div
                            key={`${item.type}-${item.id}`}
                            className="update-refund-modal-mobile-section"
                          >
                            <div className="update-refund-modal-mobile-header flex justify-start border-b border-[#E9E9E9] h-[50px]">
                              <div className="px-[10px] flex w-[51%] items-center update-refund-modal-mobile-thead uppercase">
                                Charge
                              </div>
                            </div>
                            <div className="flex justify-between border-b border-[#E9E9E9]">
                              <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">
                                {item.charge_type}
                              </div>
                            </div>

                            <div className="update-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                              <div className="px-[10px] w-[20%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Date
                              </div>
                              <div className="px-[10px] flex items-center update-refund-modal-mobile-thead uppercase">
                                Amount
                              </div>
                              <div className="px-[10px] w-[15%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Tax
                              </div>
                            </div>
                            <div className="flex justify-between border-b border-[#E9E9E9]">
                              <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">
                                {item.due_date}
                              </div>
                              <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">
                                ${Number(item.original_amount).toFixed(2)}
                              </div>
                              <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">
                                ${Number(item.tax).toFixed(2)}
                              </div>
                            </div>

                            <div className="update-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                              <div className="px-[10px] w-[16%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Total
                              </div>
                              <div className="px-[10px] w-[22%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Excess
                              </div>
                              <div className="px-[10px] w-[42%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Total Refundable
                              </div>
                              <div className="px-[10px] w-[19%] flex items-center update-refund-modal-mobile-thead uppercase">
                                Collections
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div className="px-[10px] py-[5px] w-[18%] flex items-center text-[14px] font-normal text-[#201D1E]">
                                ${Number(item.total).toFixed(2)}
                              </div>
                              <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">
                                ${Number(item.excess_amount).toFixed(2)}
                              </div>
                              <div className="px-[10px] py-[5px] w-[42%] flex items-center text-[14px] font-normal text-[#201D1E]">
                                ${Number(item.total_refundable).toFixed(2)}
                              </div>
                              <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                                {Object.entries(
                                  item.collections_per_invoice
                                ).map(([invoice, amount]) => (
                                  <div key={invoice}>{`${invoice}: $${Number(
                                    amount
                                  ).toFixed(2)}`}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex mt-5 items-end justify-end mb-1">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`bg-[#2892CE] text-white update-refund-save-btn duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRefundModal;