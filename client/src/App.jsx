import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/Stock/ProductAchat';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import CallToProject from './components/CallToProject';
import Contact from './components/Map/Contact';
import AddDevis from './pages/Devis/AddDevis';
import DetailProduct from './pages/User/DetailProduct';
import Cart from './pages/User/cart';
import FactureAchatAdd from './pages/Stock/ProductAchatAdd';
import Commandes from './pages/User/ListeCommandes';
import ListeAcces from './pages/User/ListeAcces';
import ListeProd from './pages/User/ListeProd';
import ListDevis from './pages/User/ListeDevis';
import AddFacture from './pages/Facturation/AddFacture';
import CalendarComponent from './components/Calendar';
import ActivationPage from './components/ActivationPage';
import ProjectDetails from './pages/Stock/ListProjet';
import ListProject from './pages/User/ListProject';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        
        <Route path='/listAccess' element={<ListeAcces />} />
        <Route path='/listProd' element={<ListeProd />} />
        <Route path='/projet' element={<CallToProject />} />
        <Route path='/project/:projectId' element={<ProjectDetails />} />
        <Route path='/tousProjet' element={<ListProject />} />

        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path='/product/:productId' element={<DetailProduct />} />
        <Route path='/cart' element={<Cart/>} />

        <Route path='/commandes' element={<Commandes/>}/>
        <Route path='/listDevis' element={<ListDevis/>}/>
        <Route path='/addDevis/:id' element={<AddDevis/>}/>
         <Route path='/addfacture/:id' element={<AddFacture/>} />
         <Route path='/calendar' element={<CalendarComponent/>} />
         <Route path='/confirm/:activationcode' element={<ActivationPage/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
