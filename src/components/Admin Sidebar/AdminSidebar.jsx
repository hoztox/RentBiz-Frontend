import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import logo from "../../assets/Images/Admin Sidebar/Rentbiz Logo.svg"
import dashboard from "../../assets/Images/Admin Sidebar/dashboard.svg";
import users from "../../assets/Images/Admin Sidebar/users.svg";
import properties from '../../assets/Images/Admin Sidebar/properties.svg'
import tenants from '../../assets/Images/Admin Sidebar/tenants.svg'
import tenancy from '../../assets/Images/Admin Sidebar/tenancy.svg'
import masters from '../../assets/Images/Admin Sidebar/masters.svg'
import currency from '../../assets/Images/Admin Sidebar/currency.svg'
import additionalCharges from '../../assets/Images/Admin Sidebar/additional charges.svg'
import invoice from '../../assets/Images/Admin Sidebar/invoice.svg'
import monthlyInvoice from '../../assets/Images/Admin Sidebar/monthly invoice.svg'
import financialCollection from '../../assets/Images/Admin Sidebar/financial collection.svg'
import expense from '../../assets/Images/Admin Sidebar/expense.svg'
import refund from '../../assets/Images/Admin Sidebar/refund.svg'
import tenancyReport from '../../assets/Images/Admin Sidebar/tenancy report.svg'
import upcomingCollection from '../../assets/Images/Admin Sidebar/upcoming collection.svg'
import reportCollection from '../../assets/Images/Admin Sidebar/report collection.svg'
import incomeExpense from '../../assets/Images/Admin Sidebar/income-expense.svg'
import "./adminsidebar.css"

const AdminSidebar = () => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [expandedMenus, setExpandedMenus] = useState({
        Properties: false,
        Tenants: false,
        Tenancy: false,
        Masters: false,
        Currency: false
    });

    const toggleMenu = (menu) => {
        // Create a new object with all menus closed
        const newExpandedState = {
            Properties: false,
            Tenants: false,
            Tenancy: false,
            Masters: false,
            Currency: false
        };
        
        // Only toggle the selected menu
        newExpandedState[menu] = !expandedMenus[menu];
        
        // Update the state with the new object
        setExpandedMenus(newExpandedState);
    };
    
    // For non-dropdown menu items, close all dropdowns
    const handleNonDropdownClick = (item) => {
        setActiveItem(item);
        setExpandedMenus({
            Properties: false,
            Tenants: false,
            Tenancy: false,
            Masters: false,
            Currency: false
        });
    };

    return (
        <div className="flex flex-col admin-sidebar">
            {/* Logo */}
            <div className="flex justify-center items-center pt-[30px] pb-[32px]">
                <img src={logo} alt="Rentbiz Logo" className="h-[78px] w-[128px] cursor-pointer" />
            </div>


            {/* Navigation */}
            <div className="flex flex-col overflow-y-auto">
                <div className="mx-5 mb-8">
                    <div
                        className={`flex items-center px-[12px] py-[7px] gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Dashboard' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Dashboard')}
                    >
                        <img src={dashboard} alt="Dashboard" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Dashboard</p>
                    </div>
                </div>

                <div className='mx-5'>
                    <h3 className="pb-3 category-head">USER MANAGEMENT</h3>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Users' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Users')}
                    >
                        <img src={users} alt="Users" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Users</p>
                    </div>
                    <div className='border-t border-[#E8E8E8] mb-6'></div>
                </div>

                <div className="mx-5">
                    <h3 className="pb-3 category-head">OPERATIONS</h3>

                    {/* Properties with dropdown */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Properties' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => {
                                toggleMenu('Properties');
                                setActiveItem('Properties');
                            }}
                        >
                            <div className="flex items-center gap-[10px]">
                                <img src={properties} alt="Properties" className='w-[18px] sidebar-icon' />
                                <p className='pb-[2px] menu-text'>Properties</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Properties ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedMenus.Properties ? 'max-h-24 opacity-100 mb-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="ml-10 text-sm">
                                <div
                                    className={`cursor-pointer mb-3 transition-all duration-300 ease-in-out sub-menu ${activeItem === 'Buildings' ? 'submenu-active' : ''}`}
                                    onClick={() => setActiveItem('Buildings')}
                                >
                                    <p>Buildings</p>
                                </div>
                                <div
                                    className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu ${activeItem === 'Units' ? 'submenu-active' : ''}`}
                                    onClick={() => setActiveItem('Units')}
                                >
                                    <p>Units</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tenants with dropdown */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Tenants' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => {
                                toggleMenu('Tenants');
                                setActiveItem('Tenants');
                            }}
                        >
                            <div className="flex items-center gap-[10px]">
                                <img src={tenants} alt="Tenants" className='w-[18px] sidebar-icon' />
                                <p className='pb-[2px] menu-text'>Tenants</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Tenants ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedMenus.Tenants ? 'max-h-24 opacity-100 mb-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="ml-12 text-sm">
                                {/* Dropdown items would go here */}
                            </div>
                        </div>
                    </div>

                    {/* Tenancy with dropdown */}
                    <div className='mb-6'>
                        <div
                            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Tenancy' ? 'menu-active' : ' hover:bg-gray-200'}`}
                            onClick={() => {
                                toggleMenu('Tenancy');
                                setActiveItem('Tenancy');
                            }}
                        >
                            <div className="flex items-center gap-[10px]">
                                <img src={tenancy} alt="Tenancy" className='w-[18px] sidebar-icon' />
                                <p className='pb-[2px] menu-text'>Tenancy</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Tenancy ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedMenus.Tenancy ? 'max-h-24 opacity-100 mb-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="ml-12 text-sm">
                                {/* Dropdown items would go here */}
                            </div>
                        </div>
                    </div>
                    <div className='border-t border-[#E8E8E8] mb-6'></div>
                </div>

                <div className="mx-5">
                    <h3 className="pb-3 category-head">MASTERS</h3>
                    {/* Masters with dropdown */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Masters' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => {
                                toggleMenu('Masters');
                                setActiveItem('Masters');
                            }}
                        >
                            <div className="flex items-center gap-[10px]">
                                <img src={masters} alt="Masters" className='w-[18px] sidebar-icon' />
                                <p className='pb-[2px] menu-text'>Masters</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Masters ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedMenus.Masters ? 'max-h-24 opacity-100 mb-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="ml-12 text-sm">
                                {/* Dropdown items would go here */}
                            </div>
                        </div>
                    </div>

                    {/* Currency with dropdown */}
                    <div className='mb-6'>
                        <div
                            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Currency' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => {
                                toggleMenu('Currency');
                                setActiveItem('Currency');
                            }}
                        >
                            <div className="flex items-center gap-[10px]">
                                <img src={currency} alt="Currency" className='w-[18px] sidebar-icon' />
                                <p className='pb-[2px] menu-text'>Currency</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Currency ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedMenus.Currency ? 'max-h-24 opacity-100 mb-3' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="ml-12 text-sm">
                                {/* Dropdown items would go here */}
                            </div>
                        </div>
                    </div>
                    <div className='border-t border-[#E8E8E8] mb-6'></div>
                </div>

                <div className="mx-5">
                    <h3 className="pb-3 category-head">FINANCIAL</h3>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'AdditionalCharges' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('AdditionalCharges')}
                    >
                        <img src={additionalCharges} alt="Additional Charges" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Additional Charges</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Invoice' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Invoice')}
                    >
                        <img src={invoice} alt="Invoice" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Invoice</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'MonthlyInvoice' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('MonthlyInvoice')}
                    >
                        <img src={monthlyInvoice} alt="Monthly Invoice" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Monthly Invoice</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Collection' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Collection')}
                    >
                        <img src={financialCollection} alt="Financial Collection" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Collection</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Expense' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Expense')}
                    >
                        <img src={expense} alt="Expense" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Expense</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'Refund' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('Refund')}
                    >
                        <img src={refund} alt="Refund" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Refund</p>
                    </div>
                    <div className='border-t border-[#E8E8E8] mb-6'></div>
                </div>

                <div className="mx-5">
                    <h3 className="pb-3 category-head">REPORTS</h3>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'TenancyReport' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('TenancyReport')}
                    >
                        <img src={tenancyReport} alt="Tenancy Report" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Tenancy Report</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'UpcomingCollection' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('UpcomingCollection')}
                    >
                        <img src={upcomingCollection} alt="Upcoming Collection" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Upcoming Collection</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'ReportCollection' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('ReportCollection')}
                    >
                        <img src={reportCollection} alt="Report Collection" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Collection</p>
                    </div>
                    <div
                        className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === 'IncomeExpense' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleNonDropdownClick('IncomeExpense')}
                    >
                        <img src={incomeExpense} alt="Income Expense" className='w-[18px] sidebar-icon' />
                        <p className='pb-[2px] menu-text'>Income/Expense</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mx-5 border-t border-[#E8E8E8] text-start py-6 side-footer-text">
                Powered By RentBiz - 2025
            </div>
        </div>
    );
};

export default AdminSidebar