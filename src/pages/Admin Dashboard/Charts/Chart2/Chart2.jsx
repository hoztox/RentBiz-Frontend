import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import moneyin from "../../../../assets/Images/Dashboard/money-in.svg"
import moneyout from '../../../../assets/Images/Dashboard/money-out.svg';
import "./chart2.css"

const Chart2 = ({ initialData = sampleData }) => {
  const periods = [
    "April 2022 - March 2023",
    "January 2023 - December 2023",
    "April 2023 - March 2024"
  ];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive settings
  const barSettings = {
    barGap: windowWidth < 390 ? -6 : windowWidth < 430 ? -8 : windowWidth < 480 ? -8 : windowWidth < 1600 ? -6 : -8,
    barCategoryGap: windowWidth < 390 ? "34%" : windowWidth < 430 ? "33%" : windowWidth < 480 ? "34%" : windowWidth < 1600 ? "41%" : "43%",
  };



  const [highlightedBar, setHighlightedBar] = useState(null);

  const handleHighlight = (category) => {
    setHighlightedBar((prev) => (prev === category ? null : category));
  };


  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState(initialData);
  const [yAxisTicks, setYAxisTicks] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([-500, 500]);

  // Calculate dynamic Y-axis based on data with fixed 50 unit intervals
  const calculateYAxisSettings = (currentData) => {
    const maxEarning = Math.max(...currentData.map(item => item.earning));
    const maxExpense = Math.max(...currentData.map(item => Math.abs(item.expense)));
    const overallMax = Math.max(maxEarning, maxExpense);

    // Round up to the nearest 50
    const roundedMax = Math.ceil(overallMax / 50) * 50;

    // Ensure domain is symmetrical and extends beyond the max values
    const domainMax = Math.max(300, roundedMax * 1.2);
    // Round domain to nearest 50
    const adjustedDomainMax = Math.ceil(domainMax / 50) * 50;
    const newDomain = [-adjustedDomainMax, adjustedDomainMax];

    // Generate Y-axis ticks with 50 unit intervals: 0, ±50, ±100, ±150, ...
    const newTicks = [0];
    for (let i = 50; i <= adjustedDomainMax; i += 50) {
      newTicks.push(i, -i);
    }

    return { domain: newDomain, ticks: newTicks.sort((a, b) => a - b) };
  };

  // Effect to filter/adjust data when period changes
  useEffect(() => {
    let newData;

    if (selectedPeriod === periods[0]) {
      newData = initialData;
    } else if (selectedPeriod === periods[1]) {
      // Simulate different data for this period (Jan-Dec 2023)
      newData = initialData.map(item => ({
        ...item,
        earning: item.earning * (0.8 + Math.random() * 0.4),
        expense: item.expense * (0.9 + Math.random() * 0.3)
      }));
    } else {
      // Simulate different data for this period (Apr 2023-Mar 2024)
      newData = initialData.map(item => ({
        ...item,
        earning: item.earning * (1.1 + Math.random() * 0.3),
        expense: item.expense * (1.05 + Math.random() * 0.2)
      }));
    }

    // Update data
    setData(newData);

    // Update Y-axis settings based on new data
    const { domain, ticks } = calculateYAxisSettings(newData);
    setYAxisDomain(domain);
    setYAxisTicks(ticks);

  }, [selectedPeriod, initialData]);

  // Calculate totals
  const totalMoneyIn = data.reduce((sum, item) => sum + item.earning, 0);
  const totalMoneyOut = data.reduce((sum, item) => sum + Math.abs(item.expense), 0);

  // Calculate growth percentages based on period and data
  const calculateGrowth = () => {
    const baseGrowth = selectedPeriod === periods[0] ? 5.8 :
      selectedPeriod === periods[1] ? 4.2 : 6.7;

    // Adjust by a factor based on the average earning in this period vs. first period
    const avgCurrentEarning = data.reduce((sum, item) => sum + item.earning, 0) / data.length;
    const avgInitialEarning = initialData.reduce((sum, item) => sum + item.earning, 0) / initialData.length;

    // Calculate a ratio and make a reasonable growth percentage
    const ratio = avgCurrentEarning / avgInitialEarning;
    const adjustedGrowth = baseGrowth * ratio;

    // Return with 1 decimal place
    return parseFloat(adjustedGrowth.toFixed(1));
  };

  const incomingGrowth = calculateGrowth();
  const outgoingGrowth = calculateGrowth();

  // Format currency
  const formatCurrency = (value) => {
    return `$${Math.round(value).toLocaleString()}`;
  };

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
              <span className='entry-name'>{entry.name === "earning" ? "Earning" : "Expense"}: </span>
              <span className="entry-amount">
                {formatCurrency(Math.abs(entry.value))}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-md w-[65%] border border-[#E9E9E9] chart2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="revenue-report-head">Revenue Report</h1>

        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-[5px] border rounded-md select-period"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedPeriod}  <ChevronDown size={20} className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-1 w-full bg-white border rounded-lg shadow-md z-10"
            >
              {periods.map(period => (
                <button
                  key={period}
                  className="w-full text-left py-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowDropdown(false);
                  }}
                >
                  <p className='px-2 period-options'>{period}</p>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className='flex justify-between'>

        <div className="w-full line-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
              {...barSettings} // Apply responsive settings
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
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ opacity: 0 }}
              />
              <Bar
                dataKey="earning"
                fill="#1458A2"
                radius={[5, 5, 5, 5]}
                name="earning"
                opacity={highlightedBar === null || highlightedBar === "earning" ? 1 : 0.2}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#1458A2" style={{ transition: "opacity 0.5s ease-in-out" }} />
                ))}
              </Bar>

              <Bar
                dataKey="expense"
                fill="#FF9F43"
                radius={[5, 5, 5, 5]}
                name="expense"
                opacity={highlightedBar === null || highlightedBar === "expense" ? 1 : 0.2}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#FF9F43" style={{ transition: "opacity 0.5s ease-in-out" }} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col money-status-desktop">
          <div className='p-5 w-[186px] money-in mb-6'>
            <div className="money-in-count mb-[6px]">{formatCurrency(totalMoneyIn)}</div>
            <div className="flex justify-between items-center">
              <span className="money-in-head">Money in</span>
              <div className="flex items-center">
                <img src={moneyin} alt="money In" className='w-[18px] h-[18px]' />
                <span className="percentage ml-[5.46px]">{incomingGrowth}%</span>
              </div>
            </div>
          </div>

          <div className='p-5 w-[186px] money-out'>
            <div className="money-out-count mb-[6px]">{formatCurrency(totalMoneyOut)}</div>
            <div className="flex justify-between items-center">
              <span className="money-out-head">Money Out</span>
              <div className="flex items-center">
                <img src={moneyout} alt="money In" className='w-[18px] h-[18px]' />
                <span className="percentage ml-[5.46px]">{outgoingGrowth}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start mt-6 gap-8">
        <div
          className={`flex items-center gap-2 cursor-pointer ${highlightedBar === "earning" ? "font-bold" : ""}`}
          onClick={() => handleHighlight("earning")}
        >
          <div className="w-4 h-4 rounded-full bg-[#1458A2]"></div>
          <span className="earning-text">Earning</span>
        </div>
        <div
          className={`flex items-center gap-2 cursor-pointer ${highlightedBar === "expense" ? "font-bold" : ""}`}
          onClick={() => handleHighlight("expense")}
        >
          <div className="w-4 h-4 rounded-full bg-[#FF9F43]"></div>
          <span className="expense-text">Expense</span>
        </div>
      </div>

      <div className="flex flex-col money-status-mob space-x-5">
        <div className='p-5 w-[186px] money-in mb-6'>
          <div className="money-in-count mb-[6px]">{formatCurrency(totalMoneyIn)}</div>
          <div className="flex justify-between items-center money-in-div">
            <span className="money-in-head">Money in</span>
            <div className="flex items-center">
              <img src={moneyin} alt="money In" className='w-[18px] h-[18px]' />
              <span className="percentage ml-[5.46px]">{incomingGrowth}%</span>
            </div>
          </div>
        </div>

        <div className='p-5 w-[186px] money-out'>
          <div className="money-out-count mb-[6px]">{formatCurrency(totalMoneyOut)}</div>
          <div className="flex justify-between items-center money-out-div">
            <span className="money-out-head">Money Out</span>
            <div className="flex items-center">
              <img src={moneyout} alt="money In" className='w-[18px] h-[18px]' />
              <span className="percentage ml-[5.46px]">{outgoingGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

// Sample data
const sampleData = [
  { month: 'Jan', earning: 1450, expense: -550 },
  { month: 'Feb', earning: 1250, expense: -600 },
  { month: 'Mar', earning: 1100, expense: -550 },
  { month: 'Apr', earning: 1340, expense: -550 },
  { month: 'May', earning: 1050, expense: -700 },
  { month: 'Jun', earning: 1540, expense: -450 },
  { month: 'Jul', earning: 1380, expense: -500 },
  { month: 'Aug', earning: 1740, expense: -750 },
  { month: 'Sep', earning: 1900, expense: -450 },
  { month: 'Oct', earning: 1640, expense: -750 },
  { month: 'Nov', earning: 2040, expense: -950 },
  { month: 'Dec', earning: 1820, expense: -650 }
];

export default Chart2