import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);  // Log the authorization header

  if (!authHeader) {
    return res.status(403).json({ message: 'Token non fourni.' });
  }
  
  const token = authHeader.split(' ')[1]; // Split the token to extract the actual token value
  console.log("Extracted token:", token);  // Log the extracted token

  if (!token) {
    return res.status(403).json({ message: 'Token non fourni.' });
  }

  jwt.verify(token, "abc123", (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return next(errorHandler(401, 'Unauthorized'));
    }
    console.log('Verified user:', user);  // Log the verified user details
    req.user = user;
    next();
  });
};