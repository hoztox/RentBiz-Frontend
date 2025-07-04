import React from "react";
import { BASE_URL } from "../../utils/config";
import downarrow from "../../assets/Images/IncomeExpenseReport/downarrow.svg";
import downloadicon from "../../assets/Images/Admin Tenancy/download-icon.svg";
import GenericTable from "../../components/ui/GenericTable";

const IncomeExpenseReport = () => {
  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      let companyId = null;
      if (role === "company" || role === "user" || role === "admin") {
        companyId = localStorage.getItem("company_id");
      }
      return companyId ? parseInt(companyId) : null;
    } catch (e) {
      toast.error("Error retrieving company information");
      return null;
    }
  };

  const viewTypeOptions = [
    { value: "building", label: "By Building" },
    { value: "tenant", label: "By Tenant" },
    { value: "tenancy", label: "By Tenancy" },
    { value: "unit", label: "By Unit" },
  ];

  const getEntityName = (item, filters = { view_type: "building" }) => {
    switch (filters.view_type) {
      case "building":
        return item.building_name || "N/A";
      case "tenant":
        return item.tenant_name || "N/A";
      case "tenancy":
        return item.tenancy_code || "N/A";
      case "unit":
        return item.unit_name || "N/A";
      default:
        return "N/A";
    }
  };

  const getSecondaryInfo = (item, filters = { view_type: "building" }) => {
    if (filters.view_type === "tenancy") {
      return `${item.tenant_name || "N/A"} - ${item.unit_name || "N/A"}`;
    } else if (filters.view_type === "unit") {
      return item.building_name || "N/A";
    }
    return "";
  };

  return (
    <GenericTable
      title="Income-Expense Report"
      apiEndpoint={(companyId) => `${BASE_URL}/finance/income-expenses/${companyId}/`}
      downloadEndpoint={(companyId) => `${BASE_URL}/finance/income-expenses/${companyId}/export/`}
      getCompanyId={getUserCompanyId}
      dataKey={(filters = { view_type: "building" }) => `${filters.view_type}_id`}
      filterOptions={[
        {
          key: "view_type",
          type: "dropdown",
          options: () => viewTypeOptions,
        },
        {
          key: "date_range",
          type: "date",
        },
      ]}
      columns={{
        headerGroups: [
          { label: "", colSpan: 2 },
          { label: "INCOME", colSpan: 3, className: "income-expense-income-header" },
          { label: "EXPENSE", colSpan: 3, className: "income-expense-expense-header" },
        ],
        main: [
          {
            key: "entity",
            label: "ENTITY",
            render: (item, filters) => getEntityName(item, filters),
          },
          {
            key: "details",
            label: "DETAILS",
            render: (item, filters) => getSecondaryInfo(item, filters),
          },
          {
            key: "total_income",
            label: "TOTAL INCOME",
            className: "text-center bg-[#F2FCF7] text-[#28C76F]",
            render: (item) => item.total_income.toFixed(2),
          },
          {
            key: "total_refunded",
            label: "TOTAL REFUNDED",
            className: "text-center bg-[#F2FCF7] text-[#28C76F]",
            render: (item) => item.total_refunded.toFixed(2),
          },
          {
            key: "net_income",
            label: "NET INCOME",
            className: "text-center bg-[#F2FCF7] text-[#28C76F]",
            render: (item) => item.net_income.toFixed(2),
          },
          {
            key: "total_expense",
            label: "TOTAL EXPENSE",
            className: "text-center bg-[#FFF7F6] text-[#FE7062]",
            render: (item) => item.total_expense.toFixed(2),
          },
          {
            key: "total_general_expense",
            label: "GENERAL EXPENSE",
            className: "text-center bg-[#FFF7F6] text-[#FE7062]",
            render: (item) => item.total_general_expense.toFixed(2),
          },
          {
            key: "net_balance",
            label: "NET BALANCE",
            className: "text-center bg-[#FFF7F6] text-[#FE7062]",
            render: (item) => (item.net_income - item.total_expense).toFixed(2),
          },
        ],
        mobile: [
          {
            key: "entity",
            label: "ENTITY",
            render: (item, filters) => getEntityName(item, filters),
            className: "w-[50%]",
          },
          {
            key: "details",
            label: "DETAILS",
            render: (item, filters) => getSecondaryInfo(item, filters),
            className: "w-[33%]",
          },
          { key: "dropdown", label: "", align: "right" },
        ],
      }}
      customMobileRow={(item, { filters }) => (
        <div className="table-dropdown-content income-expense-table-container">
          <table className="w-full border-collapse border-t border-b border-gray-200">
            <thead>
              <tr className="h-10 income-expense-income-header">
                <th colSpan="3" className="text-center">INCOME</th>
              </tr>
              <tr className="h-12 border-b border-gray-200">
                <th className="table-thead bg-[#F2FCF7] text-[#28C76F]">TOTAL</th>
                <th className="table-thead bg-[#F2FCF7] text-[#28C76F]">REFUNDED</th>
                <th className="table-thead bg-[#F2FCF7] text-[#28C76F]">NET INCOME</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10 border-b border-gray-200">
                <td className="table-data bg-[#F2FCF7] text-[#28C76F] text-center">{item.total_income.toFixed(2)}</td>
                <td className="table-data bg-[#F2FCF7] text-[#28C76F] text-center">{item.total_refunded.toFixed(2)}</td>
                <td className="table-data bg-[#F2FCF7] text-[#28C76F] text-center">{item.net_income.toFixed(2)}</td>
              </tr>
              <tr className="h-10 income-expense-expense-header">
                <th colSpan="3" className="text-center">EXPENSE</th>
              </tr>
              <tr className="h-12 border-b border-gray-200">
                <th className="table-thead bg-[#FFF7F6] text-[#FE7062]">TOTAL</th>
                <th className="table-thead bg-[#FFF7F6] text-[#FE7062]">GENERAL</th>
                <th className="table-thead bg-[#FFF7F6] text-[#FE7062]">NET BALANCE</th>
              </tr>
              <tr className="h-10">
                <td className="table-data bg-[#FFF7F6] text-[#FE7062] text-center">{item.total_expense.toFixed(2)}</td>
                <td className="table-data bg-[#FFF7F6] text-[#FE7062] text-center">{item.total_general_expense.toFixed(2)}</td>
                <td className="table-data bg-[#FFF7F6] text-[#FE7062] text-center">{(item.net_income - item.total_expense).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      customStyles={{
        container: "income-expense-table",
      }}
    />
  );
};

export default IncomeExpenseReport;