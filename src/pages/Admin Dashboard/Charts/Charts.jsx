import React from 'react'
import Chart1 from './Chart1/Chart1'

const Charts = () => {
    const tenancyData = [
        { name: "30 Days", value: 8 },
        { name: "31-60 Days", value: 16 },
        { name: "61-90 Days", value: 22 },
    ];

    return (
        <>
            <div className='flex'>
                <Chart1 data={tenancyData} />
            </div>
        </>
    )
}

export default Charts
