import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { sendConfirmEmail } from '../utils/nodemailer.js';

// Sign up a new user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const characters = 
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTUVWXYZ"
  let activationCode ="";
  for (let i = 0; i < 10; i++) {
    activationCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    activationCode: activationCode,
  });
  
  try {
    await newUser.save();
    sendConfirmEmail(newUser.email, newUser.activationCode);
    const notificationService = req.app.get('notificationService');
  if (notificationService) {
    notificationService.emit('SignUpNotification', {newUser,username:newUser.username} );
    console.log(`Notification sent for user: ${newUser.username}`);
  } else {
    console.error("NotificationService not found");
  }
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
 
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
    if (user && isPasswordValid && !user.isActive)  {
      return res.status(401).json({ message: 'Veuillez vérifier votre boite email pour activation du compte.' });
    }
    const isAdmin = user.isAdmin;

    const token = jwt.sign({ userId: user._id, isAdmin,username: user.username ,profilePicture: user.profilePicture }, 'abc123', { expiresIn: '100d' });

    res.status(200).json({ token, userId : user._id,isAdmin,username: user.username , email:user.email ,profilePicture: user.profilePicture });
    console.log(token);
  } catch (error) {
    next(error);
  }
};

// Sign in with Google OAuth
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        "abc123"
      );
      const { password, ...rest } = user._doc;
      res.status(200).json({ token, ...rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        "abc123"
      );
      const { password, ...rest } = newUser._doc;
      res.status(200).json({ token, ...rest });
    }
  } catch (error) {
    next(error);
  }
};
 export const verifyUser = async (req, res) => {
  try {
      const user = await User.findOne({ activationCode: req.params.activationcode });

      if (!user) {
          return res.status(400).send({
              message: "Ce code d'activation est incorrect.",
          });
      }

      if (user.isActive) {
          return res.status(400).send({
              message: "Votre compte est déjà activé.",
          });
      }

      user.isActive = true;
      await user.save();

      res.send({
          message: "Votre compte est activé avec succès.",
      });
  } catch (error) {
      res.status(500).send({
          message: "Erreur serveur. Veuillez réessayer plus tard.",
      });
  }
}