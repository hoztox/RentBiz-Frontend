import React from 'react'
import Chart1 from './Chart1/Chart1'
import Chart2 from './Chart2/Chart2';

const Charts = () => {
    const tenancyData = [
        { name: "30 Days", value: 8 },
        { name: "31-60 Days", value: 16 },
        { name: "61-90 Days", value: 22 },
    ];

    return (
        <>
            <div className='flex w-full gap-5'>
                <Chart1 data={tenancyData} />
                <Chart2/>
            </div>
        </>
    )
}

export default Charts
