import React, { useEffect, useState } from "react";
import { ChevronDown, X, Calendar } from "lucide-react";
import axios from "axios";
import { useModal } from "../../../context/ModalContext";
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
    // Assuming input is in dd/mm/yyyy format
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleSave = () => {
    const { selectInvoice, paymentDate, paymentMethod, amount, accountHolderName, accountNumber, referenceNumber, chequeNumber, chequeDate } = form;

    // Validate required fields
    let requiredFields = [selectInvoice, paymentDate, paymentMethod, amount];
    if (paymentMethod === "bank_transfer") {
      requiredFields.push(accountHolderName, accountNumber, referenceNumber);
    }
    if (paymentMethod === "cheque") {
      requiredFields.push(accountHolderName, accountNumber, referenceNumber, chequeNumber, chequeDate);
    }

    if (requiredFields.every((field) => field)) {
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
    } else {
      setError("Please fill all required fields.");
    }
  };

  if (!modalState.isOpen || modalState.type !== "create-collection") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">New Collection Receipt</h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
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
          <div className="space-y-6">
            {/* Invoice Summary Section */}
            <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Invoice Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Select Invoice*</label>
                  <div className="relative w-2/3">
                    <select
                      value={form.selectInvoice}
                      onChange={(e) => updateForm("selectInvoice", e.target.value)}
                      onFocus={() => setIsSelectOpenInvoice(true)}
                      onBlur={() => setIsSelectOpenInvoice(false)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm ${
                        form.selectInvoice === "" ? "text-gray-400" : ""
                      } disabled:bg-gray-100`}
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
                    <ChevronDown
                      size={16}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform ${
                        isSelectOpenInvoice ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Tenancy Name</label>
                  <input
                    type="text"
                    value={form.tenancyName}
                    readOnly
                    className="w-2/3 px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <div className="relative w-2/3">
                    <input
                      type="text"
                      value={form.endDate}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 text-sm"
                    />
                    <Calendar
                      size={16}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Total Balance</label>
                  <input
                    type="text"
                    value={Number(invoiceDetails.total_amount_to_collect).toFixed(2)}
                    readOnly
                    className="w-2/3 px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 text-sm font-semibold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Total Tax</label>
                  <input
                    type="text"
                    value={Number(invoiceDetails.total_tax_amount).toFixed(2)}
                    readOnly
                    className="w-2/3 px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-800 text-sm font-semibold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Applicable Taxes</label>
                  <div className="w-2/3 flex flex-wrap gap-2">
                    {invoiceDetails.taxes.length > 0 ? (
                      invoiceDetails.taxes.map((tax, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs"
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
            </div>

            {/* Collection Details */}
            <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Collection Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Amount*</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => updateForm("amount", e.target.value)}
                    placeholder="Enter Amount"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Payment Date*</label>
                  <div className="relative w-2/3">
                    <input
                      type="text"
                      value={form.paymentDate}
                      onChange={(e) => updateForm("paymentDate", e.target.value)}
                      placeholder="dd/mm/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                      disabled={loading}
                    />
                    <Calendar
                      size={16}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Payment Method*</label>
                  <div className="relative w-2/3">
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => updateForm("paymentMethod", e.target.value)}
                      onFocus={() => setIsSelectOpenPaymentMethod(true)}
                      onBlur={() => setIsSelectOpenPaymentMethod(false)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                        form.paymentMethod === "" ? "text-gray-400" : ""
                      } disabled:bg-gray-100`}
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
                    <ChevronDown
                      size={16}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform ${
                        isSelectOpenPaymentMethod ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {(form.paymentMethod === "bank_transfer" || form.paymentMethod === "cheque") && (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600">Account Holder Name*</label>
                      <input
                        type="text"
                        value={form.accountHolderName}
                        onChange={(e) => updateForm("accountHolderName", e.target.value)}
                        placeholder="Enter Account Holder Name"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600">Account Number*</label>
                      <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) => updateForm("accountNumber", e.target.value)}
                        placeholder="Enter Account Number"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600">Reference Number*</label>
                      <input
                        type="text"
                        value={form.referenceNumber}
                        onChange={(e) => updateForm("referenceNumber", e.target.value)}
                        placeholder="Enter Reference Number"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}
                {form.paymentMethod === "cheque" && (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600">Cheque Number*</label>
                      <input
                        type="text"
                        value={form.chequeNumber}
                        onChange={(e) => updateForm("chequeNumber", e.target.value)}
                        placeholder="Enter Cheque Number"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600">Cheque Date*</label>
                      <div className="relative w-2/3">
                        <input
                          type="text"
                          value={form.chequeDate}
                          onChange={(e) => updateForm("chequeDate", e.target.value)}
                          placeholder="dd/mm/yyyy"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
                          disabled={loading}
                        />
                        <Calendar
                          size={16}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Toggleable Collection Items Table */}
            <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Payment Details</h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
              </div>
              {showDetails && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {[
                          "Charge Type",
                          "Description",
                          "Date",
                          "Amount",
                          "Tax",
                          "Total",
                          "Balance",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.collectionItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800">{item.chargeType}</td>
                          <td className="px-3 py-2 text-sm text-gray-800">{item.description}</td>
                          <td className="px-3 py-2 text-sm text-gray-800">{item.date}</td>
                          <td className="px-3 py-2 text-sm text-gray-800">
                            {Number(item.amount).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800">
                            {Number(item.tax).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800">
                            {Number(item.total).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800">
                            {Number(item.balance).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:ring-1 focus:ring-gray-500 text-sm transition-colors disabled:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 text-sm transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Collection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollectionModal;