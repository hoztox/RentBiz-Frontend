import React from 'react';
import CountUp from 'react-countup';
import properties from "../../../assets/Images/Dashboard/total properties.svg";
import units from "../../../assets/Images/Dashboard/total units.svg";
import acquired from "../../../assets/Images/Dashboard/total acquired.svg";
import vacant from '../../../assets/Images/Dashboard/total vacant.svg';
import "./propertiescards.css";

const PropertiesCards = () => {
  const propertyData = [
    {
      title: "Total Properties",
      value: 120,
      icon: <img src={properties} alt="Total Properties" />,
      backgroundColor: "bg-[#F1FDFB]",
      iconBackground: "bg-[#64C8BC]"
    },
    {
      title: "Total Units",
      value: 120,
      icon: <img src={units} alt="Total Units" />,
      backgroundColor: "bg-[#F2FEED]",
      iconBackground: "bg-[#90E471]"
    },
    {
      title: "Total Acquired",
      value: 120,
      icon: <img src={acquired} alt="Total Acquired" />,
      backgroundColor: "bg-[#FFF2FC]",
      iconBackground: "bg-[#FF93E7]"
    },
    {
      title: "Total Vacant",
      value: 120,
      icon: <img src={vacant} alt="Total Vacant" />,
      backgroundColor: "bg-[#F0F8FF]",
      iconBackground: "bg-[#017EF4]"
    }
  ];

  return (
    <div className="p-5 rounded-md border border-[#E9E9E9] w-[60%] properties-cards">
      <h2 className="properties-head pb-[15px]">Properties</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:!grid-cols-4 gap-[17px]">
        {propertyData.map((item, index) => (
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
    </div>
  );
};

export default PropertiesCards;
