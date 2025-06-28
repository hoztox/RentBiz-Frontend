import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import properties from "../../../assets/Images/Dashboard/total properties.svg";
import units from "../../../assets/Images/Dashboard/total units.svg";
import acquired from "../../../assets/Images/Dashboard/total acquired.svg";
import vacant from '../../../assets/Images/Dashboard/total vacant.svg';
import "./propertiescards.css";
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';

// Define BASE_URL (replace with your actual backend base URL)

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

const PropertiesCards = () => {
  const [propertyData, setPropertyData] = useState({
    total_properties: 0,
    total_units: 0,
    total_acquired: 0,
    total_vacant: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get company ID
  const companyId = getUserCompanyId();

  // Function to fetch data from API
  const fetchPropertiesData = async () => {
    if (!companyId) {
      setError('No company ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/dashboard/properties-summary/${companyId}/`, // Updated URL with companyId
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if your API requires authentication
          },
        }
      );
      
      setPropertyData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties data:', err);
      setError('Failed to load properties data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or companyId changes
  useEffect(() => {
    fetchPropertiesData();
  }, [companyId]);

  // Card configuration with dynamic data
  const cardConfig = [
    {
      title: "Total Properties",
      value: propertyData.total_properties,
      icon: <img src={properties} alt="Total Properties" />,
      backgroundColor: "bg-[#F1FDFB]",
      iconBackground: "bg-[#64C8BC]",
    },
    {
      title: "Total Units",
      value: propertyData.total_units,
      icon: <img src={units} alt="Total Units" />,
      backgroundColor: "bg-[#F2FEED]",
      iconBackground: "bg-[#90E471]",
    },
    {
      title: "Total Acquired",
      value: propertyData.total_acquired,
      icon: <img src={acquired} alt="Total Acquired" />,
      backgroundColor: "bg-[#FFF2FC]",
      iconBackground: "bg-[#FF93E7]",
    },
    {
      title: "Total Vacant",
      value: propertyData.total_vacant,
      icon: <img src={vacant} alt="Total Vacant" />,
      backgroundColor: "bg-[#F0F8FF]",
      iconBackground: "bg-[#017EF4]",
    },
  ];

  return (
    <div className="p-5 rounded-md border border-[#E9E9E9] w-[60%] properties-cards">
      <h2 className="properties-head pb-[15px]">Properties</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:!grid-cols-4 gap-[17px]">
          {cardConfig.map((item, index) => (
            <div key={index} className={`${item.backgroundColor} p-3 rounded-[10px] w-full h-auto flex flex-col`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`${item.iconBackground} p-[6px] rounded-md w-[44px] h-[44px] flex justify-center items-center`}>
                  {item.icon}
                </div>
              </div>
              <p className="cards-title mb-3">{item.title}</p>
              <h3 className="cards-count">
                <CountUp start={0} end={item.value} duration={2} />
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesCards;