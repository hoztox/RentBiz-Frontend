import React, { useState, useEffect } from 'react';
import "./collectionlist.css"
import { ChevronDown } from "lucide-react";
import arrow from "../../../assets/Images/Dashboard/downarrow.svg";
import { motion, AnimatePresence } from "framer-motion";

const CollectionList = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("5");
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    const [activeDropdowns, setActiveDropdowns] = useState({});

    const toggleDropdown = (collectionId) => {
        setActiveDropdowns(prev => {
            // Create a new object where only the clicked traveler's dropdown is open
            const newActiveDropdowns = {};

            // If the clicked dropdown is not already open, open it
            if (!prev[collectionId]) {
                newActiveDropdowns[collectionId] = true;
            }

            return newActiveDropdowns;
        });
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    // Sample data
    const data = [
        { id: 'TC0002-1', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Paid' },
        { id: 'TC0002-2', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Unpaid' },
        { id: 'TC0002-3', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Overdue' },
        { id: 'TC0002-4', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Paid' },
        { id: 'TC0002-5', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Unpaid' },
        { id: 'TC0002-6', tenant: 'Pharmacy', building: 'Danat Alzahia', unit: 'Shop 1', charge: 'Rent', total: 150.00, dueDate: '04-03-2025', status: 'Unpaid' }
    ];

    // Filter by status and search query
    const filteredData = data
        .filter(item => activeFilter === 'All' || item.status === activeFilter)
        .filter(item =>
            searchQuery === '' ||
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

    // Calculate pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredData.slice(startIndex, endIndex);

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery, itemsPerPage]);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setItemsPerPage(Number(option));
        setIsDropdownOpen(false);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // Generate pagination buttons
    const generatePaginationButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxButtonsToShow) {
            // Display all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // Calculate which pages to show
            const halfButtons = Math.floor(maxButtonsToShow / 2);

            if (currentPage <= halfButtons + 1) {
                // Near the start
                startPage = 1;
                endPage = maxButtonsToShow;
            } else if (currentPage >= totalPages - halfButtons) {
                // Near the end
                startPage = totalPages - maxButtonsToShow + 1;
                endPage = totalPages;
            } else {
                // In the middle
                startPage = currentPage - halfButtons;
                endPage = currentPage + halfButtons;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`px-4 h-[38px] rounded-[3px] cursor-pointer duration-200 page-no-btns ${currentPage === i
                        ? 'bg-[#1458A2] text-white'
                        : 'bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]'
                        }`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    const StatusBadge = ({ status }) => {
        let bgColor = '';

        switch (status) {
            case 'Paid':
                bgColor = 'bg-[#28C76F28] text-[#28C76F]';
                break;
            case 'Unpaid':
                bgColor = 'bg-[#EA545529] text-[#EA5455]';
                break;
            case 'Overdue':
                bgColor = 'bg-[#A8AAAE29] text-[#A8AAAE]';
                break;
            default:
                bgColor = 'bg-gray-100';
        }

        return (
            <span className={`px-[10px] py-[5px] rounded-[4px] collection-list-status ${bgColor}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="w-full rounded-md border border-[#E9E9E9] collection-list-table mb-[80px] md:mb-0">
            <h1 className="collection-list-head px-5 pt-5 pb-[18px]">Collection List</h1>

            {/* Filter tabs */}
            <div className="flex justify-between border-b border-[#E9E9E9] collection-list-tabs">
                <div className='px-5 pb-5 space-x-[10px] tabs'>
                    <button
                        className={`px-5 py-2 rounded-[4px] duration-100 w-[70px] filter-btns ${activeFilter === 'Paid'
                            ? 'paid-active '
                            : 'paid-inactive'
                            }`}
                        onClick={() => handleFilterChange('Paid')}
                    >
                        Paid
                    </button>
                    <button
                        className={`px-5 py-2 rounded-[4px] duration-100 w-[88px] filter-btns ${activeFilter === 'Unpaid'
                            ? 'unpaid-active'
                            : 'unpaid-inactive'
                            }`}
                        onClick={() => handleFilterChange('Unpaid')}
                    >
                        Unpaid
                    </button>
                    <button
                        className={`px-5 py-2 rounded-[4px] duration-100 w-[98px] filter-btns ${activeFilter === 'Overdue'
                            ? 'overdue-active'
                            : 'overdue-inactive'
                            }`}
                        onClick={() => handleFilterChange('Overdue')}
                    >
                        Overdue
                    </button>
                    <button
                        className={`px-5 py-2 rounded-[4px] duration-100 w-[58px] filter-btns ${activeFilter === 'All'
                            ? 'all-active'
                            : 'all-inactive'
                            }`}
                        onClick={() => handleFilterChange('All')}
                    >
                        All
                    </button>
                </div>

                <div className="flex mx-5 gap-[13.36px] inputs-drop">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-[#E9E9E9] rounded-md w-[253px] h-[38px] px-[14px] py-[7px] outline-none focus:border-gray-300 duration-150 search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="relative w-[121px]">
                        {/* Dropdown button */}
                        <button
                            className="w-full px-[14px] py-[7px] border border-[#E9E9E9] rounded-md h-[38px] flex items-center justify-between cursor-pointer focus:border-gray-300 duration-150 table-drop-down-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedOption}
                            <ChevronDown
                                className={`w-4 h-4 ml-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>

                        {/* Dropdown options with animation */}
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
                                        {["5", "10", "20", "50"].map((option, index) => (
                                            <li
                                                key={index}
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-gray-500 text-left text-sm border-b border-[#E9E9E9] h-[57px] collection-list-theads">
                            <th className="px-5 collection-list-thead ">ID</th>
                            <th className="px-5 collection-list-thead collection-list-tenet">TENANT NAME</th>
                            <th className="px-5 collection-list-thead collection-list-building">BUILDING NAME</th>
                            <th className="px-5 collection-list-thead list-mob">UNIT NAME</th>
                            <th className="px-5 collection-list-thead list-mob">CHARGE CODE</th>
                            <th className="px-5 collection-list-thead w-[13%] list-mob">TOTAL</th>
                            <th className="px-5 collection-list-thead list-mob">DUE DATE</th>
                            <th className="px-5 collection-list-thead text-end w-[7%] list-mob">STATUS</th>
                            <div className="collection-drop-down-fields"></div>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <React.Fragment key={`${item.id}-${index}`}>
                                <tr
                                    key={index}
                                    className={`lg:hover:bg-gray-50 cursor-pointer h-[57px] ${activeDropdowns[item.id]
                                        ? 'mobile-no-border'
                                        : 'border-b border-[#E9E9E9]'
                                        }`}
                                >
                                    <td className="px-5 collection-list-data collection-list-id">{item.id}</td>
                                    <td className="px-5 collection-list-data collection-list-tenet">{item.tenant}</td>
                                    <td className="px-5 collection-list-data collection-list-data-building">{item.building}</td>
                                    <td className="px-5 collection-list-data list-mob">{item.unit}</td>
                                    <td className="px-5 collection-list-data list-mob">{item.charge}</td>
                                    <td className="px-5 collection-list-data list-mob">{item.total.toFixed(2)}</td>
                                    <td className="px-5 collection-list-data list-mob">{item.dueDate}</td>
                                    <td className="px-5 collection-list-data flex justify-end items-center h-[57px] list-mob">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <div
                                        className={`collection-drop-down-field ${activeDropdowns[item.id] ? "active" : ""}`}
                                        onClick={() => toggleDropdown(item.id)}
                                    >
                                        <img
                                            src={arrow}
                                            alt="drop-down arrow"
                                            className={`collection-dropdown-img w-[13px] ${activeDropdowns[item.id] ? "rotated" : ""}`}
                                        />
                                    </div>
                                </tr>
                                <AnimatePresence>
                                    {activeDropdowns[item.id] && (
                                        <motion.tr
                                            className={`collection-dropdown-row ${activeDropdowns[item.id]
                                                    ? 'mobile-with-border'
                                                    : ''
                                                }`}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={dropdownVariants}
                                        >
                                            <td colSpan="4" className="pb-5">
                                                {/* Dropdown content goes here */}
                                                <div className="grid grid-cols-3 px-5">
                                                    <div className='flex flex-col items-start'>
                                                        <h4 className='drop-down-head'>UNIT NAME</h4>
                                                        <p className='drop-down-data'>
                                                            {item.unit}
                                                        </p>
                                                    </div>
                                                    <div className='flex flex-col items-start'>
                                                        <h4 className='drop-down-head w-[100px]'>CHARGE CODE</h4>
                                                        <p className='drop-down-data'>
                                                            {item.charge}
                                                        </p>
                                                    </div>
                                                    <div className='flex flex-col items-start pl-4'>
                                                        <h4 className='drop-down-head'>TOTAL</h4>
                                                        <p className='drop-down-data'>
                                                            {item.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 px-5 mt-6">
                                                    <div>
                                                        <h4 className='drop-down-head'>DUE DATE</h4>
                                                        <p className='drop-down-data'>
                                                            {item.dueDate}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className='drop-down-head pb-1'>STATUS</h4>
                                                        <StatusBadge status={item.status} />
                                                    </div>
                                                    <div>

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

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 h-[78px] collection-list-pagination-div ">
                <div className="collection-list-pagination">
                    Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                </div>
                <div className="flex gap-[5px]">
                    <button
                        className="px-[10px] py-[6px] rounded-[3px] bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </button>

                    {generatePaginationButtons()}

                    <button
                        className="px-[10px] py-[6px] rounded-[3px] bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectionList;