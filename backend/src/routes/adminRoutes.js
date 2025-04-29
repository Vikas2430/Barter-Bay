const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin authentication routes
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);

// Protected admin routes
router.use(authMiddleware.verifyAdmin);

// Dashboard routes
router.get('/dashboard', adminController.getDashboardStats);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Content management routes
router.get('/content', adminController.getAllContent);
router.post('/content', adminController.createContent);
router.put('/content/:id', adminController.updateContent);
router.delete('/content/:id', adminController.deleteContent);

// Settings routes
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router; 