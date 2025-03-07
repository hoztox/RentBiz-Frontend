import React from 'react'
import "./admindashboard.css"
import PropertiesCards from './Properties Cards/PropertiesCards'
import CollectionRent from "./Collection of Rent/CollectionRent"

const AdminDashboard = () => {
  return (
    <div className='flex w-full'>
      <PropertiesCards />
      <CollectionRent />
    </div>
  )
}

export default AdminDashboard
