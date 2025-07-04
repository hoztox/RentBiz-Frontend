import React from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import Chart1 from "./Chart1/Chart1";
import Chart2 from "./Chart2/Chart2";
import "./charts.css";

const getUserCompanyId = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  if (role === "company") {
    return localStorage.getItem("company_id");
  } else if (role === "user" || role === "admin") {
    try {
      const userCompanyId = localStorage.getItem("company_id");
      return userCompanyId ? JSON.parse(userCompanyId) : null;
    } catch (e) {
      console.error("Error parsing user company ID:", e);
      return null;
    }
  }
  return null;
};

const Charts = () => {
  const { t } = useTranslation();
  const { companyId: companyIdFromParams } = useParams();
  const companyId = companyIdFromParams || getUserCompanyId();

  return (
    <div className="flex w-full gap-5 mb-5 charts">
      <Chart1 companyId={companyId} title={t('charts.chart1')} />
      <Chart2 companyId={companyId} title={t('charts.chart2')} />
    </div>
  );
};

export default Charts;