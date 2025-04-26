const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Create new order (protected)
router.post('/', auth, createOrder);

// Get user's orders (protected)
router.get('/', auth, getUserOrders);

// Get single order (protected)
router.get('/:id', auth, getOrder);

module.exports = router; 