const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createListing, getUserListings, updateListing, deleteListing, getListingById } = require('../controllers/listingController');
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 8 // Maximum 8 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all listings (public)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate({
        path: 'images',
        select: 'data contentType filename'
      })
      .populate({
        path: 'seller',
        select: 'username'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        listings
      }
    });
  } catch (error) {
    console.error('Get all listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching listings'
    });
  }
});

// Create new listing (protected)
router.post('/', auth, upload.array('images', 8), createListing);

// Get user's listings (protected)
router.get('/my-listings', auth, getUserListings);

// Get single listing by ID (protected)
router.get('/:id', auth, getListingById);

// Update listing (protected)
router.put('/:id', auth, upload.array('images', 8), updateListing);

// Delete listing (protected)
router.delete('/:id', auth, deleteListing);

module.exports = router; 