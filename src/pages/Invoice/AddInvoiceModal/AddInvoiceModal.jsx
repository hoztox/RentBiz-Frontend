import React, { useEffect, useState } from "react";
import "./AddInvoiceModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Invoice/close-icon.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";

const AddInvoiceModal = () => {
  const { modalState, closeModal } = useModal();
  const [formData, setFormData] = useState({
    tenancy: "",
    inDate: "",
    building_name: "",
    unit_name: "",
    endDate: "",
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    tenancy: false,
  });

  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenancyDetails, setTenancyDetails] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPaymentSchedules, setSelectedPaymentSchedules] = useState([]);
  const [selectedAdditionalCharges, setSelectedAdditionalCharges] = useState([]);

  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();

      if (role === "company") {
        return localStorage.getItem("company_id");
      } else if (role === "user" || role === "admin") {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      }

      return null;
    } catch (e) {
      console.error("Error getting user company ID:", e);
      return null;
    }
  };

  const fetchTenancies = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("No company ID found");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/company/tenancies/company/${companyId}/`
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
        console.log("Fetched and sorted tenancies:", response.data);
      } else {
        setTenancies([]);
        console.log("No tenancies found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      setError("Failed to fetch tenancies");
      setTenancies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenancyDetails = async (tenancyId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/company/tenancies/${tenancyId}/`
      );

      if (response.data && response.data.success) {
        const tenancy = response.data.tenancy;
        setTenancyDetails(tenancy);

        setFormData((prev) => ({
          ...prev,
          building_name:
            tenancy.building?.building_name ||
            tenancy.unit?.building?.building_name ||
            "",
          unit_name: tenancy.unit?.unit_name || "",
        }));

        initializeSelectedItems(tenancy);

        console.log("Fetched tenancy details:", tenancy);
      } else {
        console.error(
          "Failed to fetch tenancy details:",
          response.data?.message || "Unknown error"
        );
        setError("Failed to fetch tenancy details");
      }
    } catch (error) {
      console.error("Error fetching tenancy details:", error);
      setError("Error fetching tenancy details");
    } finally {
      setLoading(false);
    }
  };

  const initializeSelectedItems = (tenancy) => {
    try {
      const paymentSchedules = [];
      const additionalCharges = [];

      if (
        tenancy.payment_schedules &&
        Array.isArray(tenancy.payment_schedules)
      ) {
        tenancy.payment_schedules.forEach((schedule) => {
          if (schedule.status === "pending") {
            paymentSchedules.push({
              id: schedule.id,
              charge_type: schedule.charge_type?.name || "Unknown",
              description:
                schedule.reason || `Payment - Due ${schedule.due_date}`,
              due_date: schedule.due_date || "",
              amount: schedule.amount
                ? parseFloat(schedule.amount).toFixed(2)
                : "0.00",
              tax: schedule.tax ? parseFloat(schedule.tax).toFixed(2) : "0.00",
              total: schedule.total
                ? parseFloat(schedule.total).toFixed(2)
                : "0.00",
              selected: false,
            });
          }
        });
      }

      if (
        tenancy.additional_charges &&
        Array.isArray(tenancy.additional_charges)
      ) {
        tenancy.additional_charges.forEach((charge) => {
          if (charge.status === "pending") {
            additionalCharges.push({
              id: charge.id,
              charge_type: charge.charge_type?.name || "Unknown",
              description:
                charge.reason || `Additional charge - Due ${charge.due_date}`,
              due_date: charge.due_date || "",
              amount: charge.amount
                ? parseFloat(charge.amount).toFixed(2)
                : "0.00",
              tax: charge.tax ? parseFloat(charge.tax).toFixed(2) : "0.00",
              total: charge.total
                ? parseFloat(charge.total).toFixed(2)
                : "0.00",
              selected: false,
            });
          }
        });
      }

      setSelectedPaymentSchedules(paymentSchedules);
      setSelectedAdditionalCharges(additionalCharges);
    } catch (error) {
      console.error("Error initializing selected items:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      tenancy: "",
      inDate: "",
      building_name: "",
      unit_name: "",
      endDate: "",
    });
    setTenancyDetails(null);
    setSelectedPaymentSchedules([]);
    setSelectedAdditionalCharges([]);
    setError(null);
    setOpenDropdowns({
      tenancy: false,
    });
  };

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-invoice") {
      resetForm();
      fetchTenancies();
    }
  }, [modalState.isOpen, modalState.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "tenancy" && value) {
      fetchTenancyDetails(value);
    }
  };

  const handlePaymentScheduleToggle = (index) => {
    const updatedSchedules = [...selectedPaymentSchedules];
    updatedSchedules[index].selected = !updatedSchedules[index].selected;
    setSelectedPaymentSchedules(updatedSchedules);
  };

  const handleAdditionalChargeToggle = (index) => {
    const updatedCharges = [...selectedAdditionalCharges];
    updatedCharges[index].selected = !updatedCharges[index].selected;
    setSelectedAdditionalCharges(updatedCharges);
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const calculateGrandTotal = () => {
    try {
      const paymentTotal = selectedPaymentSchedules
        .filter((item) => item.selected)
        .reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

      const chargeTotal = selectedAdditionalCharges
        .filter((item) => item.selected)
        .reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

      return (paymentTotal + chargeTotal).toFixed(2);
    } catch (error) {
      console.error("Error calculating grand total:", error);
      return "0.00";
    }
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      return userId ? parseInt(userId) : null;
    }
    return null;
  };

  const handleSave = async () => {
    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();

      if (!companyId) {
        setError("Company ID is required to create an invoice.");
        return;
      }

      setLoading(true);
      setError(null);

      const selectedItems = [
        ...selectedPaymentSchedules
          .filter((item) => item.selected)
          .map((item) => ({
            charge_type: item.charge_type,
            description: item.description,
            due_date: item.due_date,
            amount: parseFloat(item.amount) || 0,
            tax: parseFloat(item.tax) || 0,
            type: "payment_schedule",
            total: parseFloat(item.total) || 0,
            schedule_id: item.id,
          })),
        ...selectedAdditionalCharges
          .filter((item) => item.selected)
          .map((item) => ({
            charge_type: item.charge_type,
            description: item.description,
            due_date: item.due_date,
            amount: parseFloat(item.amount) || 0,
            tax: parseFloat(item.tax) || 0,
            type: "additional_charge",
            total: parseFloat(item.total) || 0,
            charge_id: item.id,
          })),
      ];

      const invoiceData = {
        company: companyId,
        user: userId,
        tenancy: formData.tenancy,
        invoice_date: formData.inDate,
        end_date: formData.endDate,
        building_name: formData.building_name,
        unit_name: formData.unit_name,
        items: selectedItems,
        total_amount: parseFloat(calculateGrandTotal()),
      };

      const response = await axios.post(
        `${BASE_URL}/company/invoice/create/`,
        invoiceData
      );

      if (response.data && response.data.success) {
        console.log("Invoice Created Successfully:", response.data);
        closeModal();
      } else {
        console.error(
          "Failed to create invoice:",
          response.data?.message || "Unknown error"
        );
        setError(response.data?.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error(
        "Error creating invoice:",
        error.response?.data?.errors || error.message
      );
      setError(error.response?.data?.errors || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="invoice-modal-container bg-white rounded-md w-[1006px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center md:p-6 border-gray-200 flex-shrink-0">
          <h2 className="text-[#201D1E] invoice-modal-head">
            Create New Invoice
          </h2>
          <button
            onClick={closeModal}
            className="invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 md:overflow-y-auto md:p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}

          <div className="invoice-modal-grid gap-6">
            <div>
              <label className="block mb-3 invoice-modal-label">
                Select Tenancy
              </label>
              <div className="relative">
                <select
                  name="tenancy"
                  value={formData.tenancy}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("tenancy")}
                  onBlur={() =>
                    setTimeout(() => toggleDropdown("tenancy"), 150)
                  }
                  className={`block w-full border py-2 px-3 pr-8 focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none invoice-modal-select ${
                    formData.tenancy === "" ? "invoice-modal-selected" : ""
                  }`}
                  disabled={loading}
                >
                  <option value="" disabled>
                    Choose Tenancy
                  </option>
                  {tenancies.map((tenancy) => (
                    <option key={tenancy.id} value={tenancy.id}>
                      {tenancy.tenancy_code} - {tenancy.tenant?.tenant_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#201D1E] pointer-events-none transition-transform duration-200 ${
                    openDropdowns.tenancy ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">In Date*</label>
              <input
                type="date"
                name="inDate"
                value={formData.inDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-input"
              />
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">
                Building Name*
              </label>
              <input
                type="text"
                name="building_name"
                value={formData.building_name}
                className="block w-full border py-2 px-3 bg-gray-100 invoice-modal-input"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">
                Unit Name*
              </label>
              <input
                type="text"
                name="unit_name"
                value={formData.unit_name}
                className="block w-full border py-2 px-3 bg-gray-100 invoice-modal-input"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full border py-2 px-3 invoice-modal-input"
              />
            </div>
          </div>

          {/* Payment Schedules Table */}
          {selectedPaymentSchedules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg mb-3 payment-heading">
                Payment Schedules
              </h3>
              <div className="border border-[#E9E9E9] rounded-md invoice-mobile-section-container">
                {/* Desktop Table */}
                <div className="invoice-desktop-table">
                  {/* Fixed Header */}
                  <div className="invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <thead className="bg-white">
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[50px]">
                            Select
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[180px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Due Date
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Tax
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[80px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-64 overflow-y-auto invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <tbody>
                        {selectedPaymentSchedules.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#E9E9E9] last:border-b-0"
                          >
                            <td className="px-[10px] py-[5px] w-[50px]">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() =>
                                  handlePaymentScheduleToggle(index)
                                }
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.charge_type}
                            </td>
                            <td className="px-[10px] py-[5px] w-[180px] invoice-modal-tdata">
                              {item.description}
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.due_date}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.tax}
                            </td>
                            <td className="px-[10px] py-[5px] w-[80px] invoice-modal-tdata">
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Table */}
                <div className="invoice-mobile-table">
                  {selectedPaymentSchedules.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-[#E9E9E9] last:border-b-0 invoice-mobile-section"
                    >
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[25%]">
                          Select
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[40%]">
                          Charge Type
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[35%]">
                          Description
                        </div>
                      </div>
                      <div className="flex justify-between h-[67px] border-b border-[#E9E9E9]">
                        <div className="px-[10px] py-[13px] w-[25%]">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() =>
                              handlePaymentScheduleToggle(index)
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="px-[10px] py-[13px] w-[40%] invoice-modal-tdata">
                          {item.charge_type}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%] invoice-modal-tdata">
                          {item.description}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Due Date
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount
                        </div>
                      </div>
                      <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.due_date}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Tax
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Total
                        </div>
                      </div>
                      <div className="flex justify-start h-[67px]">
                        <div className="px-[10px] py-[13px] w-full invoice-modal-tdata">
                          {item.tax}
                        </div>
                        <div className="px-[10px] py-[13px] w-full invoice-modal-tdata">
                          {item.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Charges Table */}
          {selectedAdditionalCharges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg mb-3 additional-charges-heading">
                Additional Charges
              </h3>
              <div className="border border-[#E9E9E9] rounded-md invoice-mobile-section-container">
                {/* Desktop Table */}
                <div className="invoice-desktop-table">
                  {/* Fixed Header */}
                  <div className="invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <thead className="bg-white">
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[50px]">
                            Select
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[180px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Due Date
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Tax
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[80px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-64 overflow-y-auto invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <tbody>
                        {selectedAdditionalCharges.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#E9E9E9] last:border-b-0"
                          >
                            <td className="px-[10px] py-[5px] w-[50px]">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() =>
                                  handleAdditionalChargeToggle(index)
                                }
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.charge_type}
                            </td>
                            <td className="px-[10px] py-[5px] w-[180px] invoice-modal-tdata">
                              {item.description}
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.due_date}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.tax}
                            </td>
                            <td className="px-[10px] py-[5px] w-[80px] invoice-modal-tdata">
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Table */}
                <div className="invoice-mobile-table">
                  {selectedAdditionalCharges.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-[#E9E9E9] last:border-b-0 invoice-mobile-section"
                    >
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[25%]">
                          Select
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[40%]">
                          Charge Type
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[35%]">
                          Description
                        </div>
                      </div>
                      <div className="flex justify-between h-[67px] border-b border-[#E9E9E9]">
                        <div className="px-[10px] py-[13px] w-[25%]">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() =>
                              handleAdditionalChargeToggle(index)
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="px-[10px] py-[13px] w-[40%] invoice-modal-tdata">
                          {item.charge_type}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%] invoice-modal-tdata">
                          {item.description}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Due Date
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.due_date}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Tax
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Total
                        </div>
                      </div>
                      <div className="flex justify-between h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.tax}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <div className="text-lg grand-total-text">
              Grand Total: {calculateGrandTotal()}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="md:p-4 mt-4 border-gray-200 flex justify-end flex-shrink-0 md:mr-2">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#076094] text-white py-2 px-6 mb-3 invoice-modal-save-btn"
            disabled={loading}
          >
            {loading ? "Generate..." : "Generate "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;