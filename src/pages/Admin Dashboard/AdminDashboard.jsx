import React from 'react';
import { useTranslation } from 'react-i18next';
import "./admindashboard.css";
import "./admindashboard.css"
import PropertiesCards from './Properties Cards/PropertiesCards'
import CollectionRent from "./Collection of Rent/CollectionRent"
import Charts from './Charts/Charts'
import CollectionList from './Collection List/CollectionList'


const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='body-head'>{t('dashboard')}</h1>
      <div className='flex w-full gap-5 mb-5 cards-progress'>
        <PropertiesCards />
        <CollectionRent />
      </div>
      <Charts />
      <CollectionList />
    </>
  );
};

export default AdminDashboard;