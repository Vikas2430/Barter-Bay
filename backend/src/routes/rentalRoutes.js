const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const auth = require('../middleware/auth');

// Get all available rentals
router.get('/available', rentalController.getAvailableRentals);

// Get user's rentals
router.get('/user', auth, rentalController.getUserRentals);

// Create a new rental
router.post('/', auth, rentalController.createRental);

// Rent an item
router.post('/rent', auth, rentalController.rentItem);

// Return a rented item
router.post('/return/:rentalId', auth, rentalController.returnItem);

module.exports = router; 