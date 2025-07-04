import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import "./collectionlist.css";
import { ChevronDown } from "lucide-react";
import arrow from "../../../assets/Images/Dashboard/downarrow.svg";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const CollectionList = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("5");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeDropdowns, setActiveDropdowns] = useState({});

  const toggleDropdown = (collectionId) => {
    setActiveDropdowns((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const getUserCompanyId = () => {
    const companyId = localStorage.getItem("company_id");
    return companyId ? JSON.parse(companyId) : null;
  };
  const companyId = getUserCompanyId();

  const getStatusParam = (filter) => {
    if (filter === t('filters.all')) return "";
    if (filter === t('filters.partially_paid')) return "partially_paid";
    return filter.toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusParam = getStatusParam(activeFilter);
        
        const response = await axios.get(
          `${BASE_URL}/company/dashboard/collection-list/${companyId}`,
          {
            params: {
              search: searchQuery,
              status: statusParam,
              page: currentPage,
              page_size: itemsPerPage,
            },
          }
        );
        setData(response.data.results || []);
        setTotalCount(response.data.count || 0);
      } catch (err) {
        toast.error(t('errors.fetch_collections_failed'));
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId, searchQuery, activeFilter, currentPage, itemsPerPage]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setItemsPerPage(Number(option));
    setIsDropdownOpen(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "paid") {
      bgColor = "bg-[#28C76F29]";
      textColor = "text-[#28C76F]";
    } else if (
      normalizedStatus === "unpaid" ||
      normalizedStatus === "overdue"
    ) {
      bgColor = "bg-[#FFE1E1]";
      textColor = "text-[#C72828]";
    } else if (
      normalizedStatus === "partially_paid" ||
      normalizedStatus === "partially paid"
    ) {
      bgColor = "bg-[#FFF7E9]";
      textColor = "text-[#FBAD27]";
    } else {
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
    }

    return (
      <span
        className={`px-[10px] py-[5px] rounded-[4px] collection-list-status ${bgColor} ${textColor} whitespace-nowrap`}
      >
        {t(`status.${normalizedStatus}`)}
      </span>
    );
  };

  return (
    <div className="w-full rounded-md border border-[#E9E9E9] collection-list-table mb-[80px] md:mb-0">
      <Toaster />
      <h1 className="collection-list-head px-5 pt-5 pb-[18px]">
        {t('collection_list.title')}
      </h1>

      <div className="flex justify-between border-b border-[#E9E9E9] collection-list-tabs">
        <div className="px-5 pb-5 flex flex-wrap gap-[10px]">
          {["Paid", "Unpaid", "Overdue", "Partially Paid", "All"].map((filter) => (
            <button
              key={filter}
              className={`${filter === "Partially Paid" ? "w-[130px]" : "w-[85px]"} text-center px-4 py-2 rounded-[4px] duration-150 filter-btns ${
                activeFilter === filter
                  ? `${filter.toLowerCase().replace(" ", "_")}-active`
                  : `${filter.toLowerCase().replace(" ", "_")}-inactive`
              }`}
              onClick={() => handleFilterChange(t(`filters.${filter.toLowerCase().replace(" ", "_")}`))}
            >
              {t(`filters.${filter.toLowerCase().replace(" ", "_")}`)}
            </button>
          ))}
        </div>

        <div className="flex mx-5 gap-[13.36px] inputs-drop">
          <input
            type="text"
            placeholder={t('actions.search')}
            className="border border-[#E9E9E9] rounded-md w-[253px] h-[38px] px-[14px] py-[7px] outline-none focus:border-gray-300 duration-150 search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="relative w-[121px]">
            <button
              className="w-full px-[14px] py-[7px] border border-[#E9E9E9] rounded-md h-[38px] flex items-center justify-between cursor-pointer focus:border-gray-300 duration-150 table-drop-down-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedOption}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-10"
                >
                  <ul className="py-2">
                    {["5", "10", "20", "50"].map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-gray-500 text-left text-sm border-b border-[#E9E9E9] h-[57px] collection-list-theads">
              <th className="px-5 collection-list-thead md:w-[10%] w-[50%]">
                {t('table.id')}
              </th>
              <th className="px-5 collection-list-thead collection-list-tenet">
                {t('table.tenant_name')}
              </th>
              <th className="px-5 collection-list-thead collection-list-building hidden-mobile">
                {t('table.building_name')}
              </th>
              <th className="px-5 collection-list-thead list-mob">
                {t('table.unit_name')}
              </th>
              <th className="px-5 collection-list-thead w-[13%] list-mob">
                {t('table.total')}
              </th>
              <th className="px-5 collection-list-thead list-mob">
                {t('table.due_date')}
              </th>
              <th className="px-5 collection-list-thead text-end w-[7%] list-mob">
                {t('table.status')}
              </th>
              <th className="collection-drop-down-fields w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={`${item.id}-${index}`}>
                <tr
                  className={`lg:hover:bg-gray-50 cursor-pointer h-[57px] ${
                    activeDropdowns[item.id]
                      ? "mobile-no-border"
                      : "border-b border-[#E9E9E9]"
                  }`}
                >
                  <td className="px-5 collection-list-data collection-list-id">
                    {item.id}
                  </td>
                  <td className="px-5 collection-list-data collection-list-tenet">
                    {item.tenant_name}
                  </td>
                  <td className="px-5 collection-list-data collection-list-data-building hidden-mobile">
                    {item.building_name}
                  </td>
                  <td className="px-5 collection-list-data list-mob">
                    {item.unit_name}
                  </td>
                  <td className="px-5 collection-list-data list-mob">
                    {parseFloat(item.total_amount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-5 collection-list-data list-mob">
                    {item.end_date}
                  </td>
                  <td className="px-5 collection-list-data flex justify-end items-center h-[57px] list-mob">
                    <StatusBadge status={item.status} />
                  </td>
                  <td
                    className={`collection-drop-down-field ${
                      activeDropdowns[item.id] ? "active" : ""
                    }`}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    <img
                      src={arrow}
                      alt={t('logo_alt.dropdown_arrow')}
                      className={`collection-dropdown-img w-[13px] ${
                        activeDropdowns[item.id] ? "rotated" : ""
                      }`}
                    />
                  </td>
                </tr>
                <AnimatePresence>
                  {activeDropdowns[item.id] && (
                    <motion.tr
                      className={`collection-dropdown-row ${
                        activeDropdowns[item.id] ? "mobile-with-border" : ""
                      }`}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan="8" className="pb-5">
                        <div className="px-5 dropdown-content">
                          <div className="dropdown-grid hidden-mobile">
                            <div className="flex flex-col items-start">
                              <h4 className="drop-down-head">{t('table.unit_name')}</h4>
                              <p className="drop-down-data">{item.unit_name}</p>
                            </div>
                            <div className="flex flex-col items-start pl-4">
                              <h4 className="drop-down-head">{t('table.total')}</h4>
                              <p className="drop-down-data">
                                {parseFloat(item.total_amount ?? 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="grid !grid-cols-3 px-5 mt-6 hidden-mobile">
                            <div>
                              <h4 className="drop-down-head">{t('table.due_date')}</h4>
                              <p className="drop-down-data">{item.due_date}</p>
                            </div>
                            <div>
                              <h4 className="drop-down-head pb-1">{t('table.status')}</h4>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                          <div className="dropdown-flex mobile-only">
                            <div className="flex flex-row justify-between mb-4">
                              <div className="flex flex-col items-start">
                                <h4 className="drop-down-head">{t('table.building_name')}</h4>
                                <p className="drop-down-data">{item.building_name}</p>
                              </div>
                              <div className="flex flex-col items-start pl-2">
                                <h4 className="drop-down-head">{t('table.unit_name')}</h4>
                                <p className="drop-down-data">{item.unit_name}</p>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between">
                              <div className="flex flex-col items-start">
                                <h4 className="drop-down-head">{t('table.due_date')}</h4>
                                <p className="drop-down-data">{item.due_date}</p>
                              </div>
                              <div className="flex flex-col items-start pl-7">
                                <h4 className="drop-down-head">{t('table.total')}</h4>
                                <p className="drop-down-data">
                                  {parseFloat(item.total_amount ?? 0).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex flex-col items-start pl-4">
                                <h4 className="drop-down-head pb-1">{t('table.status')}</h4>
                                <StatusBadge status={item.status} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:py-[10px] md:px-5 pagination-container">
        <span className="pagination collection-list-pagination">
          {t('pagination.showing', {
            start: Math.min((currentPage - 1) * itemsPerPage + 1, totalCount),
            end: Math.min(currentPage * itemsPerPage, totalCount),
            total: totalCount,
          })}
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {t('pagination.previous')}
          </button>
          {startPage > 1 && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2 flex items-center">...</span>}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={startPage + i}
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${
                currentPage === startPage + i
                  ? "bg-[#1458A2] text-white"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
              }`}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages - 1 && (
            <span className="px-2 flex items-center">...</span>
          )}
          {endPage < totalPages && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {t('pagination.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionList;