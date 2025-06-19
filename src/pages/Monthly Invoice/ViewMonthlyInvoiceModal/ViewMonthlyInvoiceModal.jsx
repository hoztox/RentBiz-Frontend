import { X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";

const ViewMonthlyInvoiceModal = () => {
  const { modalState, closeModal } = useModal();

  // Only render for "view-monthly-invoice"
  if (!modalState.isOpen || modalState.type !== "view-monthly-invoice") return null;

  const invoice = modalState.data || {};
  const tenancy = invoice.tenancy || {};
  const tenant = tenancy.tenant || {};
  const paymentSchedules = invoice.payment_schedules || [];
  const additionalCharges = invoice.additional_charges || [];

  // Calculate totals
  const paymentSchedulesTotal = paymentSchedules.reduce((sum, ps) => sum + (Number(ps.total) || 0), 0);
  const additionalChargesTotal = additionalCharges.reduce((sum, ac) => sum + (Number(ac.total) || 0), 0);
  const grandTotal = Number(invoice.total_amount) || (paymentSchedulesTotal + additionalChargesTotal);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] p-8 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Invoice #{invoice.invoice_number || 'N/A'}</h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Invoice Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Billed To:</h3>
              <p className="text-gray-600">{tenant.tenant_name || 'N/A'}</p>
              <p className="text-gray-600">Tenancy Code: {tenancy.tenancy_code || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Invoice Date: {invoice.in_date ? new Date(invoice.in_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}</p>
              <p className="text-gray-600">Due Date: {invoice.end_date ? new Date(invoice.end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}</p>
              <p className="text-gray-600">
                Status: <span className={`capitalize font-medium ${invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{invoice.status || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Schedules Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Schedules</h3>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 h-14">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[20%]">Charge Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[30%]">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[20%]">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%]">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%]">Tax</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[10%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedules.length > 0 ? (
                  paymentSchedules.map((ps, index) => (
                    <tr key={index} className="h-14 hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 text-gray-600">{ps.charge_type?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{ps.reason || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {ps.due_date ? new Date(ps.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ps.amount ? Number(ps.amount).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-3 text-gray-600">{ps.tax ? Number(ps.tax).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-3 text-gray-600">{ps.total ? Number(ps.total).toFixed(2) : '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No payment schedules available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-4">
            <p className="text-lg font-semibold text-gray-800">Subtotal: {paymentSchedulesTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Additional Charges Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Charges</h3>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 h-14">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[20%]">Charge Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[30%]">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[20%]">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%]">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%]">Tax</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-[10%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {additionalCharges.length > 0 ? (
                  additionalCharges.map((ac, index) => (
                    <tr key={index} className="h-14 hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 text-gray-600">{ac.charge_type?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{ac.reason || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {ac.due_date ? new Date(ac.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ac.amount ? Number(ac.amount).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-3 text-gray-600">{ac.tax ? Number(ac.tax).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-3 text-gray-600">{ac.total ? Number(ac.total).toFixed(2) : '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No additional charges available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-4">
            <p className="text-lg font-semibold text-gray-800">Subtotal: {additionalChargesTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="border-t border-gray-200 pt-6 text-right">
          <p className="text-2xl font-bold text-gray-900">Grand Total: {grandTotal.toFixed(2)}</p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {/* Payment Schedules Mobile */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Schedules</h3>
            {paymentSchedules.length > 0 ? (
              paymentSchedules.map((ps, index) => (
                <div key={index} className="border-b border-gray-200 mb-6">
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Charge Type</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Reason</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-4">
                    <div className="px-4 text-gray-600">{ps.charge_type?.name || 'N/A'}</div>
                    <div className="px-4 text-gray-600">{ps.reason || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Due Date</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Amount</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-4">
                    <div className="px-4 text-gray-600">
                      {ps.due_date ? new Date(ps.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}
                    </div>
                    <div className="px-4 text-gray-600">{ps.amount ? Number(ps.amount).toFixed(2) : '0.00'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Tax</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Total</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="px-4 text-gray-600">{ps.tax ? Number(ps.tax).toFixed(2) : '0.00'}</div>
                    <div className="px-4 text-gray-600">{ps.total ? Number(ps.total).toFixed(2) : '0.00'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No payment schedules available</div>
            )}
            <div className="text-right mt-4">
              <p className="text-lg font-semibold text-gray-800">Subtotal: {paymentSchedulesTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Additional Charges Mobile */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Charges</h3>
            {additionalCharges.length > 0 ? (
              additionalCharges.map((ac, index) => (
                <div key={index} className="border-b border-gray-200 mb-6">
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Charge Type</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Reason</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-4">
                    <div className="px-4 text-gray-600">{ac.charge_type?.name || 'N/A'}</div>
                    <div className="px-4 text-gray-600">{ac.reason || 'N/A'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Due Date</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Amount</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-4">
                    <div className="px-4 text-gray-600">
                      {ac.due_date ? new Date(ac.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : 'N/A'}
                    </div>
                    <div className="px-4 text-gray-600">{ac.amount ? Number(ac.amount).toFixed(2) : '0.00'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-gray-100 h-14">
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Tax</div>
                    <div className="px-4 flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">Total</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="px-4 text-gray-600">{ac.tax ? Number(ac.tax).toFixed(2) : '0.00'}</div>
                    <div className="px-4 text-gray-600">{ac.total ? Number(ac.total).toFixed(2) : '0.00'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No additional charges available</div>
            )}
            <div className="text-right mt-4">
              <p className="text-lg font-semibold text-gray-800">Subtotal: {additionalChargesTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Total Amount Mobile */}
          <div className="border-t border-gray-200 pt-6 text-right">
            <p className="text-2xl font-bold text-gray-900">Grand Total: {grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMonthlyInvoiceModal;