import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import plusicon from "../../../assets/Images/Admin Buildings/plus-icon.svg"
import downloadicon from "../../../assets/Images/Admin Buildings/download-icon.svg";
import "./buildings.css"

const Buildings = () => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const demoData = [
        { id: "B24090001", date: "09 Sept 2024", name: "Emaar Square Area", address: "Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE", units: "12 Shops", status: "Active" },
        { id: "B24090002", date: "10 Sept 2024", name: "Marina Bay", address: "Dubai Marina, PO Box 112233 Dubai, UAE", units: "8 Shops", status: "Active" },
        { id: "B24090003", date: "11 Sept 2024", name: "Palm Jumeirah", address: "Palm Jumeirah, PO Box 113344 Dubai, UAE", units: "15 Shops", status: "Active" },
        { id: "B24090004", date: "12 Sept 2024", name: "Downtown View", address: "Downtown Dubai, PO Box 114455 Dubai, UAE", units: "10 Shops", status: "Inactive" },
        { id: "B24090005", date: "13 Sept 2024", name: "JBR Walk", address: "Jumeirah Beach Residences, PO Box 115566 Dubai, UAE", units: "20 Shops", status: "Active" }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(demoData.length / itemsPerPage);
    const paginatedData = demoData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    return (
        <div className="border border-[#E9E9E9]  rounded-md">
            <div className="flex justify-between items-center p-5">
                <h1 className='buildings-head'>Buildings</h1>
                <div className="flex gap-[10px]">
                    <input type="text" placeholder="Search" className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-[302px] focus:border-gray-300 duration-200 building-search" />
                    <div className="relative">
                        <select
                            name="select"
                            id=""
                            className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[121px] cursor-pointer focus:border-gray-300 duration-200 building-selection"
                            onFocus={() => setIsSelectOpen(true)}
                            onBlur={() => setIsSelectOpen(false)}
                        >
                            <option value="showing">Showing</option>
                            <option value="all">All</option>
                        </select>
                        <ChevronDown className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${isSelectOpen ? "rotate-180" : "rotate-0"}`} />
                    </div>
                    <button className="flex items-center justify-center gap-2 w-[176px] h-[38px] rounded-md add-new-building duration-200">Add New Building  
                        <img src={plusicon} alt="plus icon" className='w-[15px] h-[15px]' />
                    </button>
                    <button className="flex items-center justify-center gap-2 w-[122px] h-[38px] rounded-md duration-200 download-btn">Download
                        <img src={downloadicon} alt="Download Icon" className='w-[15px] h-[15px] download-img' />
                    </button>
                </div>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">ID</th>
                        <th className="p-2">DATE</th>
                        <th className="p-2">NAME</th>
                        <th className="p-2">ADDRESS</th>
                        <th className="p-2">NO. OF UNITS</th>
                        <th className="p-2">STATUS</th>
                        <th className="p-2">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((building, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-2">{building.id}</td>
                            <td className="p-2">{building.date}</td>
                            <td className="p-2">{building.name}</td>
                            <td className="p-2">{building.address}</td>
                            <td className="p-2">{building.units}</td>
                            <td className="p-2">
                                <span className="bg-green-200 text-green-700 px-2 py-1 rounded-md">
                                    {building.status}
                                </span>
                            </td>
                            <td className="p-2 flex gap-2">
                                <button className="text-gray-600">✏️</button>
                                <button className="text-red-600">🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <span>
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, demoData.length)} to {Math.min(currentPage * itemsPerPage, demoData.length)} of {demoData.length} entries
                </span>
                <div className="flex gap-2">
                    <button
                        className={`px-3 py-1 ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded-md`}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-md`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className={`px-3 py-1 ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"} rounded-md`}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Buildings
