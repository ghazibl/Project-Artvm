import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import Dashcommandes from '../components/Dashcommandes';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
import AddProduct from './Stock/AddProduct';
import ListeProduct from './Stock/ListeProduct';
import AddFactureForm from './Facturation/AddFacture';
import ListeFacture from './Facturation/ListeFacture';
import Calendrier from './Calendrier';
import AddAccess from './Stock/AddAccessoir';
import Contact from '../components/Map/Contact';
import AddDevis from './Devis/AddDevis';
import ListeAccessoires from './Stock/ListeAccessoire';
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts... */}
      {tab === 'commandes' && <Dashcommandes />}
      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments  */}
      {tab === 'comments' && <DashComments />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
      {tab === 'addproduct' && <AddProduct />}
      {tab === 'ListProduct' && <ListeProduct />}
      {tab === 'addfacture' && <AddFactureForm />}
      {tab === 'Listfacture' && <ListeFacture />}
      {tab === 'Calendrier' && <Calendrier />}
      {tab === 'ListeAccessoires' && <ListeAccessoires />}
      {tab === 'AjoutAccessoire' && <AddAccess />}
    </div>
  );
}
