import "./ViewInvoiceModal.css";
import closeicon from "../../../assets/Images/Invoice/close-icon.svg";
import { useModal } from "../../../context/ModalContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const ViewInvoiceModal = () => {
  const { modalState, closeModal } = useModal();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStates, setExpandedStates] = useState({ payment_schedules: {}, additional_charges: {} });

  useEffect(() => {
    console.log("Current modal state:", modalState);

    // Reset state when modal closes
    if (!modalState.isOpen) {
      setInvoice(null);
      setExpandedStates({ payment_schedules: {}, additional_charges: {} });
      setError(null);
      setLoading(false);
      return;
    }

    if (modalState.isOpen && modalState.type === "view-invoice" && modalState.data) {
      console.log("Modal opened with data:", modalState.data);

      const fetchInvoiceData = async () => {
        try {
          setLoading(true);
          setError(null);

          const invoiceId = modalState.data.dbId || modalState.data.id;
          if (!invoiceId) {
            throw new Error("No valid invoice ID provided");
          }
          console.log("Fetching invoice with ID:", invoiceId);

          const response = await axios.get(`${BASE_URL}/company/invoices/${invoiceId}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = response.data.data || response.data;
          console.log("Fetched invoice data:", data);

          // Initialize expanded states for payment schedules and additional charges
          const paymentScheduleStates = data.payment_schedules?.reduce(
            (acc, item) => ({ ...acc, [item.id]: false }),
            {}
          ) || {};
          const additionalChargeStates = data.additional_charges?.reduce(
            (acc, item) => ({ ...acc, [item.id]: false }),
            {}
          ) || {};

          setExpandedStates({
            payment_schedules: paymentScheduleStates,
            additional_charges: additionalChargeStates,
          });
          setInvoice(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching invoice data:", err);
          setError(err.message || "Failed to fetch invoice data");
          setLoading(false);

          // Fallback: use the data that was passed directly
          console.log("Using fallback data:", modalState.data);
          setInvoice({
            ...modalState.data,
            tenancy: {
              tenancy_code: modalState.data.tenancyId || "N/A",
              tenant: { tenant_name: modalState.data.tenantName || "Unknown" },
            },
            total_amount: modalState.data.amountDue || "0.00",
            in_date: modalState.data.date || "N/A",
            payment_schedules: modalState.data.payment_schedules || [],
            additional_charges: modalState.data.additional_charges || [],
          });
        }
      };

      fetchInvoiceData();
    } else {
      setError(
        `Invalid modal state: isOpen=${modalState.isOpen}, type=${modalState.type}, data=${
          modalState.data ? "present" : "missing"
        }`
      );
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const toggleItemExpand = (itemId, type) => {
    setExpandedStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [itemId]: !prev[type][itemId],
      },
    }));
  };

  // Helper function to check if additional charges exist and have data
  const hasAdditionalCharges = () => {
    return invoice?.additional_charges && 
           Array.isArray(invoice.additional_charges) && 
           invoice.additional_charges.length > 0;
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="bg-white rounded-md w-[1006px] h-[460px] p-6 view-invoice-modal-container flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="modal-overlay">
        <div className="bg-white rounded-md w-[1006px] h-[460px] p-6 view-invoice-modal-container">
          <div className="flex justify-between items-center md:mb-6">
            <h2 className="view-invoice-modal-head">{modalState.title || "Invoice View"}</h2>
            <button
              onClick={closeModal}
              className="view-invoice-modal-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
            </button>
          </div>
          <div className="text-red-700 text-center">{error || "No invoice data available"}</div>
        </div>
      </div>
    );
  }

  const renderTable = (items, type, title) => (
    <div className="mb-6">
      <h3 className="text-lg mb-2 table-title">{title}</h3>
      <div className="view-invoice-modal-desktop-table border border-[#E9E9E9] rounded-md">
        <table className="w-full border-collapse view-invoice-modal-table">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-[10px] text-left text-gray-700 uppercase w-[140px] view-invoice-charges-thead">
                Charge Type
              </th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[160px] view-invoice-charges-thead">
                Reason
              </th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[120px] view-invoice-charges-thead">
                Due Date
              </th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-invoice-charges-thead">
                Amount
              </th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-invoice-charges-thead">Tax</th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-invoice-charges-thead">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr key={`${type}-${item.id || index}`} className="h-[57px] border-b border-[#E9E9E9] last:border-b-0">
                  <td className="px-[10px] py-[5px] w-[140px] view-invoice-charges-tdata">
                    {item.charge_type?.name || "N/A"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[160px] view-invoice-charges-tdata">
                    {item.reason || "N/A"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">{item.due_date || "N/A"}</td>
                  <td className="px-[10px] py-[5px] w-[100px] view-invoice-charges-tdata">{item.amount || "0.00"}</td>
                  <td className="px-[10px] py-[5px] w-[80px] view-invoice-charges-tdata">{item.tax || "0.00"}</td>
                  <td className="px-[10px] py-[5px] w-[100px] view-invoice-charges-tdata">{item.total || "0.00"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-[10px] py-[5px] text-center">
                  No {title.toLowerCase()} available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="view-invoice-modal-mobile-table">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div key={`${type}-${item.id || index}`} className="view-invoice-modal-mobile-section border border-[#E9E9E9] rounded-md mt-3">
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Charge Type</div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Reason</div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.charge_type?.name || "N/A"}
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.reason || "N/A"}
                </div>
              </div>
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Due Date</div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Amount</div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">{item.due_date || "N/A"}</div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">{item.amount || "0.00"}</div>
              </div>
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Tax</div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">Total</div>
              </div>
              <div className="grid grid-cols-2 h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">{item.tax || "0.00"}</div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">{item.total || "0.00"}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No {title.toLowerCase()} available</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-md w-[1006px] overflow-y-auto p-6 view-invoice-modal-container">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="view-invoice-modal-head">{modalState.title || "Invoice View"}</h2>
          <button
            onClick={closeModal}
            className="view-invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="Close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
          <div className="view-invoice-modal-grid gap-4">
            <div className="pr-4 border-r border-[#E9E9E9]">
              <div className="view-invoice-modal-label mb-1">Invoice ID</div>
              <div className="view-invoice-modal-data">{invoice.invoice_number || "N/A"}</div>
              <div className="view-invoice-modal-label mb-1 mt-4">Tenancy Code</div>
              <div className="view-invoice-modal-data">{invoice.tenancy?.tenancy_code || "N/A"}</div>
              <div className="view-invoice-modal-label mb-1 mt-4">Due Date</div>
              <div className="view-invoice-modal-data">{invoice.end_date || "N/A"}</div>
            </div>
            <div className="pl-4">
              <div className="view-invoice-modal-label mb-1">In Date</div>
              <div className="view-invoice-modal-data">{invoice.in_date || "N/A"}</div>
              <div className="view-invoice-modal-label mb-1 mt-4">Tenant Name</div>
              <div className="view-invoice-modal-data">{invoice.tenancy?.tenant?.tenant_name || "N/A"}</div>
              <div className="view-invoice-modal-label mb-1 mt-4">Total Amount</div>
              <div className="view-invoice-modal-data">{invoice.total_amount || "0.00"}</div>
            </div>
          </div>
        </div>

        {/* Payment Schedules Table */}
        {renderTable(invoice.payment_schedules, "payment_schedules", "Payment Schedules")}

        {/* Additional Charges Table - Only render if there are additional charges */}
        {hasAdditionalCharges() && 
          renderTable(invoice.additional_charges, "additional_charges", "Additional Charges")
        }
      </div>
    </div>
  );
};

export default ViewInvoiceModal;