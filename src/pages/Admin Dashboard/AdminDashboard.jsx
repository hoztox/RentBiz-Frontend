import React from 'react'
import "./admindashboard.css"
import PropertiesCards from './Properties Cards/PropertiesCards'
import CollectionRent from "./Collection of Rent/CollectionRent"
import Charts from './Charts/Charts'

const AdminDashboard = () => {
  return (
    <>
      <div className='flex w-full gap-5 mb-5'>
        <PropertiesCards />
        <CollectionRent />
      </div>
      <Charts />
    </>
  )
}

export default AdminDashboard
