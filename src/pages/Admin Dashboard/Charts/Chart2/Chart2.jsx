import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import CountUp from 'react-countup';
import axios from 'axios';
import moneyin from '../../../../assets/Images/Dashboard/money-in.svg';
import moneyout from '../../../../assets/Images/Dashboard/money-out.svg';
import './chart2.css';
import { BASE_URL } from '../../../../utils/config';

// Function to get user company ID from localStorage
const getUserCompanyId = () => {
  const role = localStorage.getItem('role')?.toLowerCase();
  if (role === 'company') {
    return localStorage.getItem('company_id');
  } else if (role === 'user' || role === 'admin') {
    try {
      const userCompanyId = localStorage.getItem('company_id');
      return userCompanyId ? JSON.parse(userCompanyId) : null;
    } catch (e) {
      console.error('Error parsing user company ID:', e);
      return null;
    }
  }
  return null;
};

// Month mapping for display
const monthMap = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

const FinancialReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Years');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [yAxisTicks, setYAxisTicks] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([-500, 500]);
  const [totalMoneyIn, setTotalMoneyIn] = useState(0);
  const [totalMoneyOut, setTotalMoneyOut] = useState(0);
  const [yearlySummary, setYearlySummary] = useState({});
  const [overallPercentage, setOverallPercentage] = useState(0); // New state for overall percentage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get company ID
  const companyId = getUserCompanyId();

  // Responsive settings for bar chart
  const barSettings = {
    barGap: windowWidth < 390 ? -6 : windowWidth < 430 ? -8 : windowWidth < 480 ? -8 : windowWidth < 1600 ? -6 : -8,
    barCategoryGap: windowWidth < 390 ? '34%' : windowWidth < 430 ? '33%' : windowWidth < 480 ? '34%' : windowWidth < 1600 ? '41%' : '43%',
  };

  // Available periods
const currentYear = new Date().getFullYear();
const startYear = 2023; // or your company start year
const periods = ['All Years'];

for (let year = currentYear; year >= startYear; year--) {
  periods.push(year.toString());
}


  // Format currency
  const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="label">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="entry-name">{entry.name === 'earning' ? 'Collections' : 'Expenses'}: </span>
              <span className="entry-amount">{formatCurrency(Math.abs(entry.value))}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate dynamic Y-axis settings
  const calculateYAxisSettings = (currentData) => {
    const maxEarning = Math.max(...currentData.map((item) => item.earning || 0));
    const maxExpense = Math.max(...currentData.map((item) => Math.abs(item.expense || 0)));
    const overallMax = Math.max(maxEarning, maxExpense);

    // Round up to the nearest 100
    const roundedMax = Math.ceil(overallMax / 100) * 100;

    // Ensure domain is symmetrical and extends beyond max values
    const domainMax = Math.max(300, roundedMax * 1.2);
    const adjustedDomainMax = Math.ceil(domainMax / 100) * 100;
    const newDomain = [-adjustedDomainMax, adjustedDomainMax];

    // Adjust Y-axis intervals based on screen size
    let interval = 100;
    if (windowWidth < 480) interval = 50;

    // Generate Y-axis ticks
    const newTicks = [];
    for (let i = -adjustedDomainMax; i <= adjustedDomainMax; i += interval) {
      newTicks.push(i);
    }

    return { domain: newDomain, ticks: newTicks };
  };

  // Fetch data from API
  const fetchFinancialData = async () => {
    if (!companyId) {
      setError('No company ID found');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = selectedPeriod === 'All Years'
        ? `${BASE_URL}/company/dashboard/revenue-report/${companyId}/`
        : `${BASE_URL}/company/dashboard/revenue-report/${companyId}/?year=${selectedPeriod}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { monthly_breakdown, total_money_in, total_money_out, yearly_summary, overall_percentage } = response.data;

      // Transform monthly_breakdown for Recharts with month abbreviations
      const transformedData = monthly_breakdown.map((item) => {
        const [year, month] = item.month.split('-');
        return {
          month: monthMap[month] || item.month, // Use 'Jan', 'Feb', etc., or fallback to original
          earning: item.collections || 0,
          expense: -Math.abs(item.expenses || 0),
        };
      });

      setData(transformedData);
      setTotalMoneyIn(total_money_in || 0);
      setTotalMoneyOut(total_money_out || 0);
      setYearlySummary(yearly_summary || {});
      setOverallPercentage(overall_percentage || 0); // Set the overall percentage

      // Update Y-axis settings
      const { domain, ticks } = calculateYAxisSettings(transformedData);
      setYAxisDomain(domain);
      setYAxisTicks(ticks);
      setError(null);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.response?.data?.error || 'Failed to load financial data');
      setData([]);
      setTotalMoneyIn(0);
      setTotalMoneyOut(0);
      setYearlySummary({});
      setOverallPercentage(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data when component mounts or selectedPeriod changes
  useEffect(() => {
    fetchFinancialData();
  }, [companyId, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  if (loading) return <div className="text-[#201D1E]">Loading...</div>;
  if (error) return <div className="text-[#E44747]">{error}</div>;

  return (
    <div className="p-5 rounded-md w-[65%] border border-[#E9E9E9] chart2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="revenue-report-head">Revenue Report</h1>
        <div className="relative">
          <motion.button
            className="flex items-center gap-2 px-3 py-[5px] border rounded-md select-period"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.97 }}
          >
            <span>{selectedPeriod}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-1 w-full bg-white border rounded-lg shadow-md z-10"
              >
                {periods.map((period) => (
                  <motion.button
                    key={period}
                    className="w-full text-left py-2 hover:bg-gray-100 rounded period-options"
                    onClick={() => handlePeriodChange(period)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="px-2">{period}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-full line-chart max-[480px]:h-[30vh]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
              {...barSettings}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF' }}
                domain={yAxisDomain}
                ticks={yAxisTicks}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
              <Bar
                dataKey="earning"
                fill="#1458A2"
                radius={[5, 5, 5, 5]}
                name="earning"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#1458A2"
                    style={{ transition: 'opacity 0.5s ease-in-out' }}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="expense"
                fill="#FF9F43"
                radius={[5, 5, 5, 5]}
                name="expense"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#FF9F43"
                    style={{ transition: 'opacity 0.5s ease-in-out' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col money-status-desktop">
          <div className="p-5 w-[186px] money-in mb-6">
            <motion.div
              key={totalMoneyIn}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="money-in-count mb-[6px]"
            >
              <CountUp end={totalMoneyIn} duration={1} decimals={2} prefix="$" />
            </motion.div>
            <div className="flex justify-between items-center">
              <span className="money-in-head">Money In</span>
              <div className="flex items-center">
                <img src={moneyin} alt="Money In" className="w-[18px] h-[18px]" />
                <span className="percentage ml-[5.46px]">0%</span>
              </div>
            </div>
          </div>

          <div className="p-5 w-[186px] money-out">
            <motion.div
              key={totalMoneyOut}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="money-out-count mb-[6px]"
            >
              <CountUp end={totalMoneyOut} duration={1} decimals={2} prefix="$" />
            </motion.div>
            <div className="flex justify-between items-center">
              <span className="money-out-head">Money Out</span>
              <div className="flex items-center">
                <img src={moneyout} alt="Money Out" className="w-[18px] h-[18px]" />
                <span className="percentage ml-[5.46px]">{overallPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-start mt-6 gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#1458A2]"></div>
          <span className="earning-text">Collections</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FF9F43]"></div>
          <span className="expense-text">Expenses</span>
        </div>
      </div>

      <div className="flex flex-col money-status-mob space-x-5">
        <div className="p-5 w-[186px] money-in mb-6">
          <motion.div
            key={totalMoneyIn}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="money-in-count mb-[6px]"
          >
            <CountUp end={totalMoneyIn} duration={1} decimals={2} prefix="$" />
          </motion.div>
          <div className="flex justify-between items-center money-in-div">
            <span className="money-in-head">Money In</span>
            <div className="flex items-center">
              <img src={moneyin} alt="Money In" className="w-[18px] h-[18px]" />
              <span className="percentage ml-[5.46px]">0%</span>
            </div>
          </div>
        </div>

        <div className="p-5 w-[186px] money-out">
          <motion.div
            key={totalMoneyOut}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="money-out-count mb-[6px]"
          >
            <CountUp end={totalMoneyOut} duration={1} decimals={2} prefix="$" />
          </motion.div>
          <div className="flex justify-between items-center money-out-div">
            <span className="money-out-head">Money Out</span>
            <div className="flex items-center">
              <img src={moneyout} alt="Money Out" className="w-[18px] h-[18px]" />
              <span className="percentage ml-[5.46px]">{overallPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>

       
      </div>

      
      
    </div>
  );
};

export default FinancialReport;