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
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import UpdateFacture from './pages/Facturation/updateFacture';
import CallToProject from './components/CallToProject';
import Contact from './components/Map/Contact';
import AddDevis from './pages/Devis/AddDevis';
import DetailProduct from './pages/User/DetailProduct';
import Cart from './pages/User/cart';
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
        <Route path='/addDevis' element={<AddDevis />} />
        <Route path='/projet' element={<CallToProject />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path="/updateFacture/:id" component={UpdateFacture} />
        <Route path='/product/:productId' element={<DetailProduct />} />
        <Route path='/cart' element={<Cart/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
