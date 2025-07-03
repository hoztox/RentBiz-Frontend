import React, { useEffect, useState } from "react";
import "./UpdateCollectionModal.css";
import { Calendar, ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import toast, { Toaster } from "react-hot-toast";

const UpdateCollectionModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [form, setForm] = useState({
    id: "",
    selectInvoice: "",
    tenancyName: "",
    endDate: "",
    paymentDate: "",
    paymentMethod: "",
    referenceNumber: "",
    amount: "",
    accountHolderName: "",
    accountNumber: "",
    chequeNumber: "",
    chequeDate: "",
  });
  const [invoiceDetails, setInvoiceDetails] = useState({
    payment_schedules: [],
    additional_charges: [],
    total_amount_to_collect: "0.00",
    total_tax_amount: "0.00",
    taxes: [],
  });
  const [isSelectOpenPaymentMethod, setIsSelectOpenPaymentMethod] = useState(false);
  const [formData, setFormData] = useState({
    collectionItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Function to convert date from "12 Dec 2025" format to "YYYY-MM-DD"
  const convertDateToInput = (dateStr) => {
    if (!dateStr) return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Convert from "12 Dec 2025" format to "YYYY-MM-DD"
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateStr}`);
        return "";
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error converting date: ${dateStr}`, error);
      return "";
    }
  };

  // Function to format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateStr}`);
        return "";
      }
      return date.toLocaleDateString("en-GB");
    } catch (error) {
      console.error(`Error formatting date: ${dateStr}`, error);
      return "";
    }
  };

  // Fetch collection details when modal opens
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "update-collection" &&
      modalState.data?.id
    ) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/finance/collections/${modalState.data.id}/`)
        .then((response) => {
          const data = response.data;
          console.log("Fetched collection data:", data);
          
          setForm({
            id: data.id || "",
            selectInvoice: data.invoice?.id || "",
            tenancyName: data.invoice?.tenancy_name || "",
            invoiceNumber: data.invoice?.invoice_number || "",
            endDate: formatDateForDisplay(data.invoice?.end_date) || "",
            paymentDate: convertDateToInput(data.collection_date) || "",
            paymentMethod: data.collection_mode || "",
            referenceNumber: data.reference_number || "",
            amount: data.amount || "",
            accountHolderName: data.account_holder_name || "",
            accountNumber: data.account_number || "",
            chequeNumber: data.cheque_number || "",
            chequeDate: convertDateToInput(data.cheque_date) || "",
          });
          
          setInvoiceDetails({
            payment_schedules: data.payment_schedules || [],
            additional_charges: data.additional_charges || [],
            total_amount_to_collect: data.invoice?.total_amount_to_collect || "0.00",
            total_tax_amount: data.invoice?.total_tax_amount || "0.00",
            taxes: data.invoice?.taxes || [],
          });
          
          setFormData({
            collectionItems: [
              ...(data.payment_schedules || []).map((ps) => ({
                id: ps.id,
                type: "payment_schedule",
                chargeType: ps.charge_type || "",
                description: ps.reason || "",
                date: formatDateForDisplay(ps.due_date) || "",
                amount: ps.amount || "0.00",
                tax: ps.tax || "0.00",
                total: ps.total || "0.00",
                amount_paid: ps.amount_paid || "0.00",
                balance: ps.balance || "0.00",
              })),
              ...(data.additional_charges || []).map((ac) => ({
                id: ac.id,
                type: "additional_charge",
                chargeType: ac.charge_type || "",
                description: ac.reason || "",
                date: formatDateForDisplay(ac.due_date) || "",
                amount: ac.amount || "0.00",
                tax: ac.tax || "0.00",
                total: ac.total || "0.00",
                amount_paid: ac.amount_paid || "0.00",
                balance: ac.balance || "0.00",
              })),
            ],
          });
          
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching collection details:", error);
          toast.error("Failed to fetch collection details. Please try again.", {
            duration: 3000,
            position: "top-center",
          });
          setError("Failed to fetch collection details.");
          setLoading(false);
        });
    }
  }, [modalState.isOpen, modalState.data?.id]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Convert from DD/MM/YYYY format to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    
    console.error(`Invalid date format: ${dateStr}, expected YYYY-MM-DD or DD/MM/YYYY`);
    return "";
  };

  const handleUpdate = () => {
    const {
      id,
      selectInvoice,
      paymentDate,
      paymentMethod,
      amount,
      accountHolderName,
      accountNumber,
      referenceNumber,
      chequeNumber,
      chequeDate,
    } = form;

    let requiredFields = [selectInvoice, paymentDate, paymentMethod, amount];
    if (paymentMethod === "bank_transfer" || paymentMethod === "cheque") {
      requiredFields.push(accountHolderName, accountNumber, referenceNumber);
    }
    if (paymentMethod === "cheque") {
      requiredFields.push(chequeNumber, chequeDate);
    }

    if (!requiredFields.every((field) => field)) {
      toast.error("Please fill all required fields.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
      toast.error("Invalid payment date format. Please select a valid date.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    if (paymentMethod === "cheque" && !/^\d{4}-\d{2}-\d{2}$/.test(chequeDate)) {
      toast.error("Invalid cheque date format. Please select a valid date.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    const collectionData = {
      invoice: selectInvoice,
      amount: parseFloat(amount),
      collection_date: formatDateForBackend(paymentDate),
      collection_mode: paymentMethod,
      reference_number: referenceNumber || null,
      status: "completed",
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

    setLoading(true);
    axios
      .put(`${BASE_URL}/finance/collections/${id}/update/`, collectionData)
      .then((response) => {
        console.log("Collection updated:", response.data);
        toast.success("Collection updated successfully!", {
          duration: 3000,
          position: "top-center",
        });
        triggerRefresh();
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating collection:", error);
        toast.error("Failed to update collection. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!modalState.isOpen || modalState.type !== "update-collection") {
    return null;
  }

  return (
    <div className="financial-collection-modal-wrapper">
      <Toaster />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 financial-collection-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 financial-collection-modal-container">
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] financial-collection-head">
              Update Collection
            </h2>
            <button
              onClick={closeModal}
              className="financial-collection-close-btn hover:bg-gray-100 duration-200"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="md:p-6 md:mt-[-15px]">
            <div className="mb-5 -mt-1 financial-form-heading">
              <h3>Invoice Summary</h3>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="grid gap-6 financial-collection-modal-grid">
              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Select Invoice*
                </label>
                <input
                  type="text"
                  value={form.invoiceNumber}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Tenancy Name
                </label>
                <input
                  type="text"
                  value={form.tenancyName}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.endDate}
                    readOnly
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input bg-gray-100"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center px-2">
                    <Calendar size={18} color="gray" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Total Balance
                </label>
                <input
                  type="text"
                  value={Number(invoiceDetails.total_amount_to_collect).toFixed(2)}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Total Tax
                </label>
                <input
                  type="text"
                  value={Number(invoiceDetails.total_tax_amount).toFixed(2)}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input bg-gray-100"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Applicable Taxes
                </label>
                <div className="w-full flex flex-wrap gap-2">
                  {invoiceDetails.taxes.length > 0 ? (
                    invoiceDetails.taxes.map((tax, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-[#E8EFF6] text-[#1458A2] rounded-md tax-applied"
                      >
                        {tax.tax_type}: {tax.tax_percentage}% (
                        {Number(tax.tax_amount).toFixed(2)})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No taxes applied
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5 mt-6 financial-form-heading">
              <h3>Collection Details</h3>
            </div>
            <div className="grid gap-6 financial-collection-modal-grid">
              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Amount*
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => updateForm("amount", e.target.value)}
                  placeholder="Enter Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Payment Date*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) => updateForm("paymentDate", e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Payment Method*
                </label>
                <div className="relative">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => {
                      updateForm("paymentMethod", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("financial-collection-selected");
                      } else {
                        e.target.classList.remove(
                          "financial-collection-selected"
                        );
                      }
                    }}
                    onFocus={() => setIsSelectOpenPaymentMethod(true)}
                    onBlur={() => setIsSelectOpenPaymentMethod(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-selection ${
                      form.paymentMethod === ""
                        ? "financial-collection-selected"
                        : ""
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
                    <label className="block financial-collection-label">
                      Account Holder Name*
                    </label>
                    <input
                      type="text"
                      value={form.accountHolderName}
                      onChange={(e) =>
                        updateForm("accountHolderName", e.target.value)
                      }
                      placeholder="Enter Account Holder Name"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                      disabled={loading}
                    />
                  </div>

                  <div class ClassName="space-y-2">
                    <label className="block financial-collection-label">
                      Account Number*
                    </label>
                    <input
                      type="text"
                      value={form.accountNumber}
                      onChange={(e) =>
                        updateForm("accountNumber", e.target.value)
                      }
                      placeholder="Enter Account Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block financial-collection-label">
                      Reference Number*
                    </label>
                    <input
                      type="text"
                      value={form.referenceNumber}
                      onChange={(e) =>
                        updateForm("referenceNumber", e.target.value)
                      }
                      placeholder="Enter Reference Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {form.paymentMethod === "cheque" && (
                <>
                  <div className="space-y-2">
                    <label className="block financial-collection-label">
                      Cheque Number*
                    </label>
                    <input
                      type="text"
                      value={form.chequeNumber}
                      onChange={(e) =>
                        updateForm("chequeNumber", e.target.value)
                      }
                      placeholder="Enter Cheque Number"
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block financial-collection-label">
                      Cheque Date*
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.chequeDate}
                        onChange={(e) =>
                          updateForm("chequeDate", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="financial-collection-modal-table-wrapper">
              <div className="flex justify-between items-center mt-10 mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Payment Details
                </h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[#1458A2] hover:text-[#0f3e77] toggle-details-btn duration-200"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {showDetails && (
                <div className="mt-[10px] overflow-x-auto border border-[#E9E9E9] rounded-md financial-collection-modal-overflow-x-auto">
                  <div className="financial-collection-modal-desktop-table">
                    <table className="w-full border-collapse financial-collection-modal-table">
                      <thead>
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[117px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[132px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[137px]">
                            Date
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[117px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[42px]">
                            Tax
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[50px]">
                            Total
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[66px]">
                            Amount Paid
                          </th>
                          <th className="px-[10px] text-left financial-collection-modal-thead uppercase w-[66px]">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.collectionItems.map((item, index) => (
                          <tr
                            key={index}
                            className="h-[57px] hover:bg-gray-100 border-b last:border-0"
                          >
                            <td className="px-[5px] py-[5px] w-[117px] text-[14px] font-normal text-[#201D1E]">
                              {item.chargeType}
                            </td>
                            <td className="px-[5px] py-[5px] w-[132px] text-[14px] font-normal text-[#201D1E]">
                              {item.description}
                            </td>
                            <td className="px-[5px] py-[5px] w-[137px] text-[14px] font-normal text-[#201D1E]">
                              {item.date}
                            </td>
                            <td className="px-[5px] py-[5px] w-[117px] text-[14px] font-normal text-[#201D1E]">
                              {Number(item.amount).toFixed(2)}
                            </td>
                            <td className="px-[5px] py-[5px] w-[42px] text-[14px] font-normal text-[#201D1E]">
                              {Number(item.tax).toFixed(2)}
                            </td>
                            <td className="px-[5px] py-[5px] w-[50px] text-[14px] font-normal text-[#201D1E]">
                              {Number(item.total).toFixed(2)}
                            </td>
                            <td className="px-[5px] py-[5px] w-[66px] text-[14px] font-normal text-[#201D1E]">
                              {Number(item.amount_paid).toFixed(2)}
                            </td>
                            <td className="px-[5px] py-[5px] w-[66px] text-[14px] font-normal text-[#201D1E]">
                              {Number(item.balance).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="financial-collection-modal-mobile-table">
                    {formData.collectionItems.map((item, index) => (
                      <div
                        key={index}
                        className="financial-collection-modal-mobile-section"
                      >
                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Charge Type
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Description
                          </div>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E9E9E9]">
                          <div className="px-[10px] py-[10px] h-[57px] text-[14px] font-normal text-[#201D1E]">
                            {item.chargeType}
                          </div>
                          <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E] w-[50%]">
                            {item.description}
                          </div>
                        </div>

                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] flex justify-between">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[38%]">
                            Date
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Amount
                          </div>
 
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                            Tax
                          </div>
                        </div>
                        <div className="flex grid-cols-3 border-b h-[57px] border-[#E9E9E9] justify-between">
                          <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E] w-[34%]">
                            {item.date}
                          </div>
                          <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E]">
                            {Number(item.amount).toFixed(2)}
                          </div>
                          <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E]">
                            {Number(item.tax).toFixed(2)}
                          </div>
                        </div>

                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Total
                          </div>
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Amount Paid
                          </div>
                        </div>
                        <div className="grid grid-cols-2 h-[57px]">
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text #201D1E] w-[50%]">
                            {Number(item.total).toFixed(2)}
                          </div>
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E] w-[50%]">
                            {Number(item.amount_paid).toFixed(2)}
                          </div>
                        </div>

                        <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-1">
                          <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase w-[50%]">
                            Balance
                          </div>
                        </div>
                        <div className="grid grid-cols-1 h-[57px]">
                          <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E] w-[50%]">
                            {Number(item.balance).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end justify-end mt-5 mb-1">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#2892CE] text-white financial-collection-save-btn duration-200"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCollectionModal;