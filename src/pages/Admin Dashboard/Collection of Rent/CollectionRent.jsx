import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import "./collectionrent.css";

const CollectionRent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [data, setData] = useState({
    total: 5000.00,
    collected: 4700.00,
    pending: 2450.00
  });

  const periodData = useMemo(() => ({
    'This Month': { total: 5000.00, collected: 4700.00, pending: 2450.00 },
    'Last Month': { total: 4800.00, collected: 4500.00, pending: 2200.00 },
    'Last 3 Months': { total: 14500.00, collected: 13200.00, pending: 6800.00 },
    'This Year': { total: 58000.00, collected: 52000.00, pending: 24000.00 }
  }), []);

  const progressPercentage = (data.collected / data.total) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setAnimateProgress(false);
    setData(periodData[selectedPeriod]);

    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedPeriod, periodData]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  return (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
      className=" rounded-md border border-[#E9E9E9] p-5 w-[40%] h-auto collection-rent"
    >
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
                  {Object.keys(periodData).map((period) => (
                    <motion.li 
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`px-3 py-2 hover:bg-blue-50  cursor-pointer transition-colors period-options ${selectedPeriod === period ? 'bg-blue-50 text-[#1458A2]' : 'text-[#201D1E]'}`}
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
      
      <div className="">
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
