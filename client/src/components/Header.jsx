import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import SmoothScroll from 'smooth-scroll';
import { FaShoppingCart } from "react-icons/fa";
import Notification from './Notification.jsx';
import logo from '../assets/logo1.png';
import SearchComponent from './SearchComponent.jsx';


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [user, setUser] = useState('');
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const User = JSON.parse(localStorage.getItem('user'));
    console.log("currentUser",User);
    if (currentUser && currentUser.userId) {
      
      const fetchUserInfo = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/user/${currentUser.userId}`);
          const data = await res.json();
          if (res.ok) {
            setUserInfo(data);
            setUser(data.username);
          } else {
            console.error('API error:', data);
          }
        } catch (error) {
          console.error('Error fetching user info:', error.message);
        }
      };
      fetchUserInfo();
    }
  }, [currentUser]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        dispatch(signoutSuccess()); // Dispatch the signoutSuccess action upon successful signout
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const scroll = new SmoothScroll();

  const scrollToSection = (event) => {
    event.preventDefault();
    scroll.animateScroll(document.querySelector('#contact-section'), null, {
      speed: 500, // Durée de l'animation en millisecondes (par exemple, 1000 pour une seconde)
    });
  };
  const commonStyles = {
    width: '3rem', // equivalent to w-12
    height: '2.5rem', // equivalent to h-10
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', // Set background color
    color: 'gray', // Set text/icon color
    borderRadius: '9999px', // equivalent to pill
    textDecoration: 'none', // Remove underline from link
    border: '1px solid gray', // Add border color and width
  };
  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center pl-10 whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <img src={logo} className='w-16'/>
        
      </Link>
      
      <SearchComponent/>
     
      <div className='flex gap-2 md:order-2'>
     {currentUser && !currentUser.isAdmin ?( <Link
        to="/cart"
        style={commonStyles}
        className="lg:inline "
      >
        <FaShoppingCart className="text-blue-500 "/>
      </Link>) :(<div></div>) } 
      {currentUser ? (
                    <Notification setNotifications={setNotifications} />
                ) : null}
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header className=' '>
              <span className='text-blue-700 text-base'>Bonjour, Mr {user}</span>
             
            </Dropdown.Header>
            {currentUser && !currentUser.isAdmin ? (
    <Link to={'/dashboard?tab=dashUser'}>
        <Dropdown.Item>Tableau de bord </Dropdown.Item>
    </Link>
) : (
    <Link to={'/dashboard?tab=dash'}>
        <Dropdown.Item>Tableau de bord </Dropdown.Item>
    </Link>
)}
            
          
            
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Se déconnecter</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
            Se connecter
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Acceuil</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>
À propos</Link>
        </Navbar.Link>
        <a href='#contact-section' onClick={scrollToSection}>
          Autres informations
        </a>
      </Navbar.Collapse>
    </Navbar>
  );
}