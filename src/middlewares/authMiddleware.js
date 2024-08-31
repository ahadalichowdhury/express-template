const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Make sure to require your User model
const AppError = require('../utils/appError');

require('dotenv').config();

const authMiddleware = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const authorization = req.headers['authorization'];
      const token = authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ status: 'unauthorized', message: 'No token provided' });
      }

      // Promisify jwt.verify
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const userId = decoded.userId;
      const role = decoded.role;

      // Fetch user from the database
      req.user = await User.findById(userId);

      if (!req.user) {
        // return res.status(404).json({ status: "unauthorized", message: "User not found" });

        throw new AppError('User not found', 400);
      }

      req.headers.userId = userId;
      req.headers.role = role;

      // Check if user has the required role
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return next(new AppError('You are not permitted!', 401));
      }

      next();
    } catch (err) {
      console.error(err); // Log the error for debugging
      // res.status(401).json({ status: 'unauthorized', message: err.message });
      throw new AppError('Unauthorized', 400);
    }
  };
};

module.exports = {
  authMiddleware,
};
