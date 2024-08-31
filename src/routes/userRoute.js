// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const rbacMiddleware = require('../middlewares/rbacMiddleware');

// Route for creating a new user and getting all users
router
  .route('/')
  .post(
    userController.createUser,
  )
  .get(
    authMiddleware('admin', 'manager', 'employee'), // Example: All roles can view users
    rbacMiddleware.checkPermission('read_user'), // Ensure permissions for reading users
    userController.getAllUsers,
  );

// Route for getting, updating, and deleting a user by ID
router
  .route('/:id')
  .get(
    authMiddleware('manager', 'employee'), // Example: All roles can view users by ID
    rbacMiddleware.checkPermission('update_user'), // Ensure permissions for reading a user
    userController.getUserById,
  )
  .put(
    authMiddleware('admin', 'manager'), // Example: Only admins and managers can update users
    rbacMiddleware.checkPermission('update_user'), // Ensure permissions for updating a user
    userController.updateUser,
  )
  .delete(
    authMiddleware('admin'), // Example: Only admins can delete users
    rbacMiddleware.checkPermission('delete_user'), // Ensure permissions for deleting a user
    userController.deleteUser,
  );

module.exports = router;
