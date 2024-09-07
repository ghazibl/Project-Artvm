import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
  
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await axios.post('/api/auth/google', {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });
  
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
   
      dispatch(signInSuccess(data)); navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      // Gérer les erreurs d'authentification côté client
    }
  };

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
      Continuer avec Google
    </Button>
  );
}
