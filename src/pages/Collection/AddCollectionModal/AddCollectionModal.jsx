import React, { useEffect, useState } from "react";
import "./AddCollectionModal.css";
import { Calendar, ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const AddCollectionModal = () => {
  const { modalState, closeModal } = useModal();
  const [form, setForm] = useState({
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
  const [invoices, setInvoices] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    payment_schedules: [],
    additional_charges: [],
    total_amount_to_collect: "0.00",
    total_tax_amount: "0.00",
    taxes: [],
  });
  const [isSelectOpenInvoice, setIsSelectOpenInvoice] = useState(false);
  const [isSelectOpenPaymentMethod, setIsSelectOpenPaymentMethod] = useState(false);
  const [formData, setFormData] = useState({
    collectionItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-collection") {
      setLoading(true);
      setError(null);
      axios
        .get(`${BASE_URL}/finance/unpaid-invoices/`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setInvoices(response.data);
          } else {
            console.error("Unexpected response format:", response.data);
            setError("Invalid data format received from server");
            setInvoices([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching unpaid invoices:", error);
          setError("Failed to fetch invoices. Please try again.");
          setInvoices([]);
          setLoading(false);
        });
    }
  }, [modalState.isOpen]);

  useEffect(() => {
    if (form.selectInvoice) {
      setLoading(true);
      setError(null);
      axios
        .get(`${BASE_URL}/finance/invoice-details/${form.selectInvoice}/`)
        .then((response) => {
          setInvoiceDetails(response.data);
          setForm((prev) => ({
            ...prev,
            tenancyName: response.data.invoice.tenancy_name || "",
            endDate: response.data.invoice.end_date
              ? new Date(response.data.invoice.end_date).toLocaleDateString("en-GB")
              : "",
          }));
          setFormData({
            collectionItems: [
              ...response.data.payment_schedules.map((ps) => ({
                id: ps.id,
                type: "payment_schedule",
                chargeType: ps.charge_type || "",
                description: ps.reason || "",
                date: ps.due_date
                  ? new Date(ps.due_date).toLocaleDateString("en-GB")
                  : "",
                amount: ps.amount || "0.00",
                tax: ps.tax || "0.00",
                total: ps.total || "0.00",
                balance: ps.balance || "0.00",
              })),
              ...response.data.additional_charges.map((ac) => ({
                id: ac.id,
                type: "additional_charge",
                chargeType: ac.charge_type || "",
                description: ac.reason || "",
                date: ac.due_date
                  ? new Date(ac.due_date).toLocaleDateString("en-GB")
                  : "",
                amount: ac.amount || "0.00",
                tax: ac.tax || "0.00",
                total: ac.total || "0.00",
                balance: ac.balance || "0.00",
              })),
            ],
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching invoice details:", error);
          setError("Failed to fetch invoice details. Please try again.");
          setLoading(false);
        });
    }
  }, [form.selectInvoice]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateForBackend = (dateStr) => {
  if (!dateStr) return "";
  // Validate that dateStr is in YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    console.error(`Invalid date format: ${dateStr}, expected YYYY-MM-DD`);
    return "";
  }
  return dateStr; // Already in YYYY-MM-DD format
};

  const handleSave = () => {
  const { selectInvoice, paymentDate, paymentMethod, amount, accountHolderName, accountNumber, referenceNumber, chequeNumber, chequeDate } = form;

  let requiredFields = [selectInvoice, paymentDate, paymentMethod, amount];
  if (paymentMethod === "bank_transfer") {
    requiredFields.push(accountHolderName, accountNumber, referenceNumber);
  }
  if (paymentMethod === "cheque") {
    requiredFields.push(accountHolderName, accountNumber, referenceNumber, chequeNumber, chequeDate);
  }

  // Validate required fields
  if (!requiredFields.every((field) => field)) {
    setError("Please fill all required fields.");
    return;
  }

  // Validate date formats
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
    setError("Invalid payment date format. Please select a valid date (YYYY-MM-DD).");
    return;
  }
  if (paymentMethod === "cheque" && !/^\d{4}-\d{2}-\d{2}$/.test(chequeDate)) {
    setError("Invalid cheque date format. Please select a valid date (YYYY-MM-DD).");
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
  setError(null);
  axios
    .post(`${BASE_URL}/finance/create-collection/`, collectionData)
    .then((response) => {
      console.log("Collection created:", response.data);
      closeModal();
    })
    .catch((error) => {
      console.error("Error creating collection:", error);
      setError("Failed to create collection. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
};

  if (!modalState.isOpen || modalState.type !== "create-collection") {
    return null;
  }

  return (
    <div className="financial-collection-modal-wrapper">
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 financial-collection-modal-overlay">
    <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 financial-collection-modal-container">
      <div className="flex justify-between items-center md:p-6 mt-2">
        <h2 className="text-[#201D1E] financial-collection-head">
          New Collection Receipt
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-md text-sm">
            Loading...
          </div>
        )}

        <div className="mb-5 -mt-1 financial-form-heading">
          <h3>Invoice Summary</h3>
        </div>
        <div className="grid gap-6 financial-collection-modal-grid">
          {/* First row */}
          <div className="space-y-2">
            <label className="block financial-collection-label">
              Select Invoice*
            </label>
            <div className="relative">
              <select
                value={form.selectInvoice}
                onChange={(e) => {
                  updateForm("selectInvoice", e.target.value);
                  if (e.target.value === "") {
                    e.target.classList.add("financial-collection-selected");
                  } else {
                    e.target.classList.remove("financial-collection-selected");
                  }
                }}
                onFocus={() => setIsSelectOpenInvoice(true)}
                onBlur={() => setIsSelectOpenInvoice(false)}
                className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-selection ${
                  form.selectInvoice === "" ? "financial-collection-selected" : ""
                }`}
                disabled={loading}
              >
                <option value="" disabled hidden>
                  Choose Invoice
                </option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number} - {invoice.tenancy_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown
                  size={16}
                  className={`text-[#201D1E] transition-transform duration-300 ${
                    isSelectOpenInvoice ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
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

          {/* Second row */}
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
                <Calendar size={18} color="gray"/>
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

          {/* Third row */}
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
                    {tax.tax_type}: {tax.tax_percentage}% ({Number(tax.tax_amount).toFixed(2)})
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No taxes applied</span>
              )}
            </div>
          </div>
        </div>

        {/* New Heading: Collection Details */}
        <div className="mb-5 mt-6 financial-form-heading">
          <h3>Collection Details</h3>
        </div>
        <div className="grid gap-6 financial-collection-modal-grid">
          {/* Fourth row - Amount, Payment Date */}
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

          {/* Fifth row */}
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
                    e.target.classList.remove("financial-collection-selected");
                  }
                }}
                onFocus={() => setIsSelectOpenPaymentMethod(true)}
                onBlur={() => setIsSelectOpenPaymentMethod(false)}
                className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-selection ${
                  form.paymentMethod === "" ? "financial-collection-selected" : ""
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

          {(form.paymentMethod === "bank_transfer" || form.paymentMethod === "cheque") && (
            <>
              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Account Holder Name*
                </label>
                <input
                  type="text"
                  value={form.accountHolderName}
                  onChange={(e) => updateForm("accountHolderName", e.target.value)}
                  placeholder="Enter Account Holder Name"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-collection-label">
                  Account Number*
                </label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => updateForm("accountNumber", e.target.value)}
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
                  onChange={(e) => updateForm("referenceNumber", e.target.value)}
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
                  onChange={(e) => updateForm("chequeNumber", e.target.value)}
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
                    onChange={(e) => updateForm("chequeDate", e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-collection-input"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Table Section */}
        <div className="financial-collection-modal-table-wrapper">
  <div className="flex justify-between items-center mt-10 mb-3">
    <h3 className="text-lg font-medium text-gray-800">Payment Details</h3>
    <button
      onClick={() => setShowDetails(!showDetails)}
      className="text-[#1458A2] hover:hover:text-[#0f3e77] toggle-details-btn duration-200"
    >
      {showDetails ? "Hide Details" : "Show Details"}
    </button>
  </div>
  
  {showDetails && (
    <div className="mt-[10px] overflow-x-auto border border-[#E9E9E9] rounded-md financial-collection-modal-overflow-x-auto">
      {/* Desktop Table */}
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
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.collectionItems.map((item, index) => (
              <tr key={index} className="h-[57px] hover:bg-gray-100 border-b last:border-0">
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
                  {Number(item.balance).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="financial-collection-modal-mobile-table">
        {formData.collectionItems.map((item, index) => (
          <div key={index} className="financial-collection-modal-mobile-section">
            {/* First Header: Charge Type and Description */}
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

            {/* Second Header: Date, Amount, Tax */}
            <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-3">
              <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                Date
              </div>
              <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                Amount
              </div>
              <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                Tax
              </div>
            </div>
            <div className="grid grid-cols-3 border-b h-[57px] border-[#E9E9E9]">
              <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E]">
                {item.date}
              </div>
              <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E]">
                {Number(item.amount).toFixed(2)}
              </div>
              <div className="px-[10px] py-[10px] text-[14px] font-normal text-[#201D1E]">
                {Number(item.tax).toFixed(2)}
              </div>
            </div>

            {/* Third Header: Total, Balance */}
            <div className="financial-collection-modal-mobile-header border-b border-[#E9E9E9] h-[50px] grid grid-cols-2">
              <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                Total
              </div>
              <div className="px-[10px] flex items-center financial-collection-modal-thead uppercase">
                Balance
              </div>
            </div>
            <div className="grid grid-cols-2 h-[57px]">
              <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                {Number(item.total).toFixed(2)}
              </div>
              <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
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
      onClick={handleSave}
      className="bg-[#2892CE] text-white financial-collection-save-btn duration-200"
      disabled={loading}
    >
      {loading ? "Saving..." : "Save"}
    </button>
  </div>
</div>
      </div>
    </div>
  </div>
</div>
  );
};

export default AddCollectionModal;

