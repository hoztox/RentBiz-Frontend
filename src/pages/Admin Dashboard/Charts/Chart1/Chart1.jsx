import React, { useState, useEffect } from "react";
import axios from "axios"; 
import CountUp from "react-countup";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "./chart1.css"; 
import { BASE_URL } from "../../../../utils/config";




const Chart1 = ({ companyId }) => {
    const COLORS = ["#C4DFFC", "#FCC2F0", "#D6F2EF"];
    const [activeIndex, setActiveIndex] = useState(null);
    const [chartData, setChartData] = useState([]); // Initialize as empty array

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/company/dashboard/tenency-expiring/${companyId}/`
                );
                const ranges = res.data.ranges;

                const transformedData = [
                    { name: "0-30 Days", value: ranges["0-30_days"] || 0 },
                    { name: "31-60 Days", value: ranges["31-60_days"] || 0 },
                    { name: "61-90 Days", value: ranges["61-90_days"] || 0 },
                ];

                setChartData(transformedData);
            } catch (err) {
                console.error("Failed to fetch tenancy expiry data:", err);
                setChartData([
                    { name: "0-30 Days", value: 0 },
                    { name: "31-60 Days", value: 0 },
                    { name: "61-90 Days", value: 0 },
                ]); // Fallback data on error
            }
        };

        fetchData();
    }, [companyId]);

    const totalProperties = chartData.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
        <div className="relative p-5 rounded-md border border-[#E9E9E9] w-[35%] chart1">
            <h2 className="chart1-head text-start">Tenancy Which are Expiring</h2>

            <div className="relative flex flex-col items-center">
                <PieChart width={250} height={250}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        startAngle={90}
                        endAngle={450}
                        cornerRadius={12}
                        strokeWidth={0}
                        stroke="#fff"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>

                <div className="absolute inset-0 flex flex-col items-center justify-center tenancy-chart">
                    <h3 className="total-properties-count">
                        {totalProperties < 10 ? "0" : ""}
                        <CountUp end={totalProperties} duration={2} />
                    </h3>
                    <p className="total-properties-head">Properties</p>
                </div>
            </div>

            <div className="flex justify-center w-full text-base legends">
                {chartData.map((entry, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-start cursor-pointer border-style last:border-r-0 days-period"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="flex items-center justify-start gap-[6px]">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            ></span>
                            <span className="entry-value">
                                {entry.value < 10 ? "0" : ""}
                                <CountUp end={entry.value || 0} duration={1.5} />
                            </span>
                        </div>
                        <span className="entry-name">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chart1;