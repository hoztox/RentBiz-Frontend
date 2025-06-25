import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";

const AddRefundModal = () => {
  const { modalState, closeModal } = useModal();
  const [form, setForm] = useState({
    selectCompany: "",
    selectBuilding: "",
    selectUnit: "",
    selectTenancy: "",
    endDate: "",
    paymentDate: "",
    paymentMethod: "",
    remarks: "",
    amountToRefund: "",
  });
  const [refundData, setRefundData] = useState({
    depositAmount: 0,
    excessAmount: 0,
    totalRefundable: 0,
    alreadyRefunded: 0,
    refundItems: [],
  });
  const [companies, setCompanies] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const role = localStorage.getItem("role")?.toLowerCase();
      if (role === "company") {
        const companyId = getUserCompanyId();
        if (companyId) {
          setCompanies([{ id: companyId, name: "Current Company" }]);
          setForm((prev) => ({ ...prev, selectCompany: companyId }));
        }
      } else {
        const response = await axios.get(`${BASE_URL}/company/companies/`);
        if (response.data && Array.isArray(response.data)) {
          setCompanies(response.data);
        } else {
          setCompanies([]);
          setError("No companies found");
        }
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId) {
        setError("No company selected");
        return;
      }
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/buildings/occupied/${companyId}/`
      );
      if (response.data && Array.isArray(response.data)) {
        const sortedBuildings = response.data.sort((a, b) => a.id - b.id);
        setBuildings(sortedBuildings);
      } else {
        setBuildings([]);
        setError("No buildings found");
      }
    } catch (err) {
      console.error("Error fetching buildings:", err);
      setError("Failed to fetch buildings");
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (buildingId) => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId || !buildingId) {
        setError("Company or Building not selected");
        return;
      }
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/units/${buildingId}/occupied-units/`
      );
      if (response.data && Array.isArray(response.data)) {
        const sortedUnits = response.data.sort((a, b) => a.id - b.id);
        setUnits(sortedUnits);
      } else {
        setUnits([]);
        setError("No units found");
      }
    } catch (err) {
      console.error("Error fetching units:", err);
      setError("Failed to fetch units");
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenancies = async (unitId) => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId || !unitId) {
        setError("Company or Unit not selected");
        return;
      }
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/company/${companyId}/${unitId}/`
      );
      if (response.data && Array.isArray(response.data.results)) {
        const sortedTenancies = response.data.results.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
      } else {
        setTenancies([]);
        setError("No tenancies found");
      }
    } catch (err) {
      console.error("Error fetching tenancies:", err);
      setError("Failed to fetch tenancies");
      setTenancies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExcessDeposits = async (tenancyId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${BASE_URL}/finance/${tenancyId}/excess-deposits/`
      );
      const data = response.data;
      if (data.deposit_amount || data.excess_amount) {
        setRefundData({
          depositAmount: data.deposit_amount || 0,
          excessAmount: data.excess_amount || 0,
          totalRefundable: data.total_refundable || 0,
          alreadyRefunded: data.already_refunded || 0,
          refundItems: data.refund_items || [],
        });
      } else {
        setRefundData({
          depositAmount: 0,
          excessAmount: 0,
          totalRefundable: 0,
          alreadyRefunded: 0,
          refundItems: [],
        });
        setError("No refundable items found for this tenancy");
      }
    } catch (err) {
      console.error("Error fetching refundable items:", err);
      setError("Failed to load refundable items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (form.selectCompany) {
      fetchBuildings();
      setForm((prev) => ({
        ...prev,
        selectBuilding: "",
        selectUnit: "",
        selectTenancy: "",
        amountToRefund: "",
      }));
      setUnits([]);
      setTenancies([]);
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectCompany]);

  useEffect(() => {
    if (form.selectBuilding) {
      fetchUnits(form.selectBuilding);
      setForm((prev) => ({
        ...prev,
        selectUnit: "",
        selectTenancy: "",
        amountToRefund: "",
      }));
      setTenancies([]);
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectBuilding]);

  useEffect(() => {
    if (form.selectUnit) {
      fetchTenancies(form.selectUnit);
      setForm((prev) => ({
        ...prev,
        selectTenancy: "",
        amountToRefund: "",
      }));
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectUnit]);

  useEffect(() => {
    if (form.selectTenancy) {
      fetchExcessDeposits(form.selectTenancy);
    }
  }, [form.selectTenancy]);

  useEffect(() => {
    if (modalState.isOpen) {
      const companyId = getUserCompanyId();
      setForm({
        selectCompany: companyId || "",
        selectBuilding: "",
        selectUnit: "",
        selectTenancy: "",
        endDate: "",
        paymentDate: "",
        paymentMethod: "",
        remarks: "",
        amountToRefund: "",
      });
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
      setError("");
      setBuildings([]);
      setUnits([]);
      setTenancies([]);
      if (companyId) {
        setForm((prev) => ({ ...prev, selectCompany: companyId }));
      }
    }
  }, [modalState.isOpen]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const { selectTenancy, paymentDate, paymentMethod, amountToRefund } = form;
    const { totalRefundable, alreadyRefunded } = refundData;

    if (
      selectTenancy &&
      paymentDate &&
      paymentMethod &&
      amountToRefund &&
      parseFloat(amountToRefund) > 0 &&
      parseFloat(amountToRefund) <= (totalRefundable - alreadyRefunded)
    ) {
      try {
        setLoading(true);
        setError("");
        const payload = {
          tenancy_id: parseInt(selectTenancy),
          amount_refunded: parseFloat(amountToRefund),
          payment_method: paymentMethod,
          payment_date: paymentDate,
          remarks: form.remarks || "",
        };

        const response = await axios.post(`${BASE_URL}/finance/create/refund/`, payload);
        console.log("Refund created:", response.data);
        closeModal();
      } catch (err) {
        console.error("Failed to create refund:", err);
        setError("Failed to create refund. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill all required fields and ensure refund amount is valid");
    }
  };

  if (!modalState.isOpen || modalState.type !== "create-refund") {
    return null;
  }

  const role = localStorage.getItem("role")?.toLowerCase();
  const showCompanyDropdown = role !== "company";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Create Refund</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-2 bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="px-6 py-2 bg-blue-100 text-blue-700 text-sm">
            Loading...
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {showCompanyDropdown && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select Company*
                </label>
                <div className="relative">
                  <select
                    value={form.selectCompany}
                    onChange={(e) => updateForm("selectCompany", e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="" disabled hidden>
                      Choose Company
                    </option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name || `Company ${company.id}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Building*
              </label>
              <div className="relative">
                <select
                  value={form.selectBuilding}
                  onChange={(e) => updateForm("selectBuilding", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-gray-100"
                  disabled={!form.selectCompany}
                >
                  <option value="" disabled hidden>
                    Choose Building
                  </option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name || `Building ${building.id}`}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Unit*
              </label>
              <div className="relative">
                <select
                  value={form.selectUnit}
                  onChange={(e) => updateForm("selectUnit", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-gray-100"
                  disabled={!form.selectBuilding}
                >
                  <option value="" disabled hidden>
                    Choose Unit
                  </option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name || `Unit ${unit.id}`}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Tenancy*
              </label>
              <div className="relative">
                <select
                  value={form.selectTenancy}
                  onChange={(e) => updateForm("selectTenancy", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-gray-100"
                  disabled={!form.selectUnit}
                >
                  <option value="" disabled hidden>
                    Choose Tenancy
                  </option>
                  {tenancies.map((tenancy) => (
                    <option key={tenancy.id} value={tenancy.id}>
                      {tenancy.tenant_name || `Tenancy ${tenancy.id}`}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => updateForm("endDate", e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Refund Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Deposit Amount</p>
                <p className="text-lg font-medium">{refundData.depositAmount.toFixed(2)} INR</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Excess Amount</p>
                <p className="text-lg font-medium">{refundData.excessAmount.toFixed(2)} INR</p>
              </div>
            </div>
          </div>

          {/* Detailed Refund Items Table */}
          {refundData.refundItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excess</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Refundable</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Collections</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {refundData.refundItems.map((item, index) => (
                      <tr key={`${item.type}-${item.id}`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.charge_type}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.reason}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.due_date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{Number(item.original_amount).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{Number(item.tax).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{Number(item.total).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{Number(item.excess_amount).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{Number(item.total_refundable).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {Object.entries(item.collections_per_invoice).map(([invoice, amount]) => (
                            <div key={invoice}>{`${invoice}: ${Number(amount).toFixed(2)}`}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Refund Amount Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Refund Amount</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Refundable</p>
                <p className="text-lg font-medium">{refundData.totalRefundable.toFixed(2)} INR</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Already Refunded</p>
                <p className="text-lg font-medium">{refundData.alreadyRefunded.toFixed(2)} INR</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount to Refund*</label>
                <input
                  type="number"
                  value={form.amountToRefund}
                  onChange={(e) => updateForm("amountToRefund", e.target.value)}
                  placeholder="Enter amount"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Bottom Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Date*
              </label>
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => updateForm("paymentDate", e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method*
              </label>
              <div className="relative">
                <select
                  value={form.paymentMethod}
                  onChange={(e) => updateForm("paymentMethod", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="" disabled hidden>
                    Choose Method
                  </option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="credit_note">Credit Note</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <input
                type="text"
                value={form.remarks}
                onChange={(e) => updateForm("remarks", e.target.value)}
                placeholder="Enter remarks"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
          >
            {loading ? 'Processing...' : 'Save Refund'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRefundModal;