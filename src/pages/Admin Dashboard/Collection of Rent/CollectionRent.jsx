import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import "./collectionrent.css";
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';

// Function to get user company ID from localStorage
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

const CollectionRent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [data, setData] = useState({
    total: 0.00,
    collected: 0.00,
    pending: 0.00
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companyId = getUserCompanyId();

  const fetchRentData = async () => {
    if (!companyId) {
      setError('No company ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/dashboard/rent-collection/${companyId}/?filter=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const total = response.data.total || 0.00;
      const collected = response.data.collected || 0.00;
      const pending = Math.max(total - collected, 0);

      setData({ total, collected, pending });
      setError(null);
    } catch (err) {
      console.error('Error fetching rent data:', err);
      setError('Failed to load rent data');
    } finally {
      setLoading(false);
      setAnimateProgress(true);
    }
  };

  useEffect(() => {
    fetchRentData();
  }, [companyId, selectedPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  const progressPercentage = data.total > 0 ? (data.collected / data.total) * 100 : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="rounded-md border border-[#E9E9E9] p-5 w-[40%] h-auto collection-rent">
      <div className="flex justify-between items-center mb-[14px]">
        <h2 className="rent-head">Collection of Rent</h2>
        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-[5px] bg-[#FBFBFB] rounded-md border border-[#E9E9E9] hover:bg-gray-100 duration-100 period-tab"
            whileTap={{ scale: 0.97 }}
          >
            <span className="period-text">{selectedPeriod}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="h-5 w-5 text-[#201D1E]" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10 border border-gray-100 overflow-hidden"
              >
                <ul className="py-1">
                  {['This Month', 'Last Month', 'Last 3 Months', 'This Year'].map((period) => (
                    <motion.li
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors period-options ${
                        selectedPeriod === period ? 'bg-blue-50 text-[#1458A2]' : 'text-[#201D1E]'
                      }`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {period}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <p className="total-text mb-1">Total</p>
        <motion.h3
          key={data.total}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="total-count"
        >
          $<CountUp end={data.total} duration={1} decimals={2} />
        </motion.h3>
      </div>

      <div className="mb-[13px]">
        <div className="h-3 bg-[#F9F9FB] rounded-full overflow-hidden">
          <motion.div
            key={progressPercentage}
            initial={{ width: '0%' }}
            animate={{ width: animateProgress ? `${progressPercentage}%` : '0%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#68C68D] rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-[#68C68D] collected-text mb-[6px]">Collected</p>
          <motion.p
            key={data.collected}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="collected-count"
          >
            $<CountUp end={data.collected} duration={1} decimals={2} />
          </motion.p>
        </div>

        <div className="text-right">
          <p className="text-[#E44747] pending-text mb-[6px]">Pending</p>
          <motion.p
            key={data.pending}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pending-count"
          >
            $<CountUp end={data.pending} duration={1} decimals={2} />
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default CollectionRent;
