import "./ViewMonthlyInvoiceModal.css";
import { useModal } from "../../../context/ModalContext";
import { X } from "lucide-react";

const ViewMonthlyInvoiceModal = () => {
  const { modalState, closeModal } = useModal();

  // Only render for "view-monthly-invoice"
  if (!modalState.isOpen || modalState.type !== "view-monthly-invoice")
    return null;

  const invoice = modalState.data || {};
  const tenancy = invoice.tenancy || {};
  const tenant = tenancy.tenant || {};
  const paymentSchedules = invoice.payment_schedules || [];
  const additionalCharges = invoice.additional_charges || [];

  // Helper function to check if additional charges exist and have data
  const hasAdditionalCharges = () => {
    return (
      invoice?.additional_charges &&
      Array.isArray(invoice.additional_charges) &&
      invoice.additional_charges.length > 0
    );
  };

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
              <th className="px-[10px] text-left text-gray-700 uppercase w-[80px] view-invoice-charges-thead">
                Tax
              </th>
              <th className="px-[10px] text-left text-gray-700 uppercase w-[100px] view-invoice-charges-thead">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={`${type}-${item.id || index}`}
                  className="h-[57px] border-b border-[#E9E9E9] last:border-b-0"
                >
                  <td className="px-[10px] py-[5px] w-[140px] view-invoice-charges-tdata">
                    {item.charge_type?.name || item.charge_type || "N/A"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[160px] view-invoice-charges-tdata">
                    {item.reason || "N/A"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[120px] view-invoice-charges-tdata">
                    {item.due_date
                      ? new Date(item.due_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[100px] view-invoice-charges-tdata">
                    {item.amount ? Number(item.amount).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[80px] view-invoice-charges-tdata">
                    {item.tax ? Number(item.tax).toFixed(2) : "0.00"}
                  </td>
                  <td className="px-[10px] py-[5px] w-[100px] view-invoice-charges-tdata">
                    {item.total ? Number(item.total).toFixed(2) : "0.00"}
                  </td>
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

      <div className="view-invoice-modal-mobile-table">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${type}-${item.id || index}`}
              className="view-invoice-modal-mobile-section border border-[#E9E9E9] rounded-md mt-3"
            >
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Charge Type
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Reason
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.charge_type?.name || item.charge_type || "N/A"}
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.reason || "N/A"}
                </div>
              </div>
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Due Date
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Amount
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#E9E9E9] h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.due_date
                    ? new Date(item.due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.amount ? Number(item.amount).toFixed(2) : "0.00"}
                </div>
              </div>
              <div className="view-invoice-modal-mobile-header border-b border-[#E9E9E9] h-[57px] grid grid-cols-2">
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Tax
                </div>
                <div className="px-[10px] flex items-center view-invoice-charges-thead uppercase">
                  Total
                </div>
              </div>
              <div className="grid grid-cols-2 h-[70px]">
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.tax ? Number(item.tax).toFixed(2) : "0.00"}
                </div>
                <div className="px-[10px] py-[10px] view-invoice-charges-tdata">
                  {item.total ? Number(item.total).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            No {title.toLowerCase()} available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-md w-[1006px] overflow-y-auto p-6 view-invoice-modal-container">
        <div className="flex justify-between items-center md:mb-6">
          <h2 className="view-invoice-modal-head">
            {modalState.title || "Monthly Invoice View"}
          </h2>
          <button
            onClick={closeModal}
            className="view-invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="border border-[#E9E9E9] rounded-md p-6 mb-6">
          <div className="view-invoice-modal-grid gap-4">
            <div className="pr-4 border-r border-[#E9E9E9]">
              <div className="view-invoice-modal-label mb-1">Invoice ID</div>
              <div className="view-invoice-modal-data">
                {invoice.invoice_number || "N/A"}
              </div>
              <div className="view-invoice-modal-label mb-1 mt-4">
                Tenancy Code
              </div>
              <div className="view-invoice-modal-data">
                {tenancy.tenancy_code || "N/A"}
              </div>
              <div className="view-invoice-modal-label mb-1 mt-4">Due Date</div>
              <div className="view-invoice-modal-data">
                {invoice.end_date
                  ? new Date(invoice.end_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
            <div className="pl-4">
              <div className="view-invoice-modal-label mb-1">In Date</div>
              <div className="view-invoice-modal-data">
                {invoice.in_date
                  ? new Date(invoice.in_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
              <div className="view-invoice-modal-label mb-1 mt-4">
                Tenant Name
              </div>
              <div className="view-invoice-modal-data">
                {tenant.tenant_name || "N/A"}
              </div>
              <div className="view-invoice-modal-label mb-1 mt-4">
                Total Amount
              </div>
              <div className="view-invoice-modal-data">
                {invoice.total_amount
                  ? Number(invoice.total_amount).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Schedules Table */}
        {renderTable(
          paymentSchedules,
          "payment_schedules",
          "Payment Schedules"
        )}

        {/* Additional Charges Table - Only render if there are additional charges */}
        {hasAdditionalCharges() &&
          renderTable(
            additionalCharges,
            "additional_charges",
            "Additional Charges"
          )}
      </div>
    </div>
  );
};

export default ViewMonthlyInvoiceModal;
