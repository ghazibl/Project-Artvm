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
import FactureAchat from './Stock/ProductAchat';
import FactureAchatAdd from './Stock/ProductAchatAdd';
import ContactComp from '../components/Map/GetContact';
import DashCompUser from './User/DashCompUser';
import AddFacture from './Facturation/AddFacture';
import ImprimerFact from './Facturation/ImprimerFact';
import ListeDevis from './Devis/ListeDevis';
import CreatePost from './CreatePost';
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
      {tab === 'comments' && <ContactComp />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
      {tab === 'dashUser' && <DashCompUser />}
      
      {tab === 'factAchat' && <FactureAchat />}
      {tab === 'addproduct' && <AddProduct />}
      {tab === 'ListProduct' && <ListeProduct />}
      {tab === 'addfacture' && <AddFacture />}
      {tab === 'Listfacture' && <ListeFacture />}
      {tab === 'Calendrier' && <Calendrier />}
      {tab === 'ListeAccessoires' && <ListeAccessoires />}
      {tab === 'AjoutAccessoire' && <AddAccess />}
      {tab === 'addProductAchat' && <FactureAchatAdd />}
      {tab === 'addDevis/:id' && <AddDevis/>}
      {tab === 'demandeDevis/:id' && <AddDevis />}
      {tab === 'addfacture/:id' && <AddFacture />}
      {tab === 'devis' && <ListeDevis />}
      {tab ==='create-post' && <CreatePost /> }
    </div>
  );
}
