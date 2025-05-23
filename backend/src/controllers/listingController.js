const Listing = require('../models/Listing');
const Image = require('../models/Image');

// Create new listing
exports.createListing = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { 
      title, 
      description, 
      type,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      securityDeposit,
      deliveryCharges,
      category, 
      condition, 
      location,
      deliveryAvailable,
      contactInfo,
      price
    } = req.body;
    const sellerId = req.user._id;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required'
      });
    }

    // Save images and get their IDs
    const imageIds = await Promise.all(
      images.map(async (image) => {
        const newImage = new Image({
          data: image.buffer.toString('base64'),
          contentType: image.mimetype,
          filename: image.originalname
        });
        await newImage.save();
        return newImage._id;
      })
    );

    let priceData;
    if (type === 'sale') {
      // Parse price if it's a string
      try {
        priceData = typeof price === 'string' ? JSON.parse(price) : price;
      } catch (error) {
        console.error('Error parsing price:', error);
        priceData = { amount: 0 };
      }
    } else {
      priceData = {
        perDay: parseFloat(pricePerDay),
        perWeek: parseFloat(pricePerWeek),
        perMonth: parseFloat(pricePerMonth),
        securityDeposit: parseFloat(securityDeposit),
        deliveryCharges: deliveryAvailable ? parseFloat(deliveryCharges) : 0
      };
    }

    console.log('Creating listing with data:', {
      seller: sellerId,
      title,
      description,
      type,
      price: priceData,
      category,
      condition,
      images: imageIds,
      location,
      deliveryAvailable,
      contactInfo
    });

    const listing = new Listing({
      seller: sellerId,
      title,
      description,
      type,
      price: priceData,
      category,
      condition,
      images: imageIds,
      location,
      deliveryAvailable,
      contactInfo
    });

    await listing.save();

    // Populate images before sending response
    const populatedListing = await Listing.findById(listing._id).populate('images');

    res.status(201).json({
      success: true,
      data: {
        listing: populatedListing
      }
    });
  } catch (error) {
    console.error('Create listing error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      error: 'Server error while creating listing'
    });
  }
};

// Get user's listings
exports.getUserListings = async (req, res) => {
  try {
    const userId = req.user._id;
    const listings = await Listing.find({ seller: userId })
      .populate('images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        listings
      }
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching listings'
    });
  }
};

// Update listing
exports.updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;
    const updates = req.body;
    const newImages = req.files;

    const listing = await Listing.findOne({
      _id: listingId,
      seller: userId
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Handle new images if provided
    if (newImages && newImages.length > 0) {
      const imageIds = await Promise.all(
        newImages.map(async (image) => {
          const newImage = new Image({
            data: image.buffer.toString('base64'),
            contentType: image.mimetype,
            filename: image.originalname
          });
          await newImage.save();
          return newImage._id;
        })
      );

      // Delete old images
      await Image.deleteMany({ _id: { $in: listing.images } });
      
      // Update with new image IDs
      listing.images = imageIds;
    }

    // Update other fields
    Object.keys(updates).forEach(key => {
      if (key !== 'images') {
        if (key === 'price') {
          // Parse price if it's a string
          try {
            const priceData = typeof updates[key] === 'string' ? JSON.parse(updates[key]) : updates[key];
            listing[key] = priceData;
          } catch (error) {
            console.error('Error parsing price:', error);
            listing[key] = updates[key];
          }
        } else {
          listing[key] = updates[key];
        }
      }
    });

    await listing.save();

    // Populate images before sending response
    const updatedListing = await Listing.findById(listing._id).populate('images');

    res.json({
      success: true,
      data: {
        listing: updatedListing
      }
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating listing'
    });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;

    const listing = await Listing.findOne({
      _id: listingId,
      seller: userId
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Delete associated images
    await Image.deleteMany({ _id: { $in: listing.images } });
    
    // Delete the listing
    await listing.deleteOne();

    res.json({
      success: true,
      data: {
        message: 'Listing deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting listing'
    });
  }
};

// Get single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;

    const listing = await Listing.findOne({
      _id: listingId,
      seller: userId
    }).populate('images');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    res.json({
      success: true,
      data: {
        listing
      }
    });
  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching listing'
    });
  }
};

// Rent an item
exports.rentItem = async (req, res) => {
  try {
    const listingId = req.params.id;
    const { startDate, endDate, quantity, totalAmount } = req.body;
    const userId = req.user._id;

    const listing = await Listing.findById(listingId).populate('seller', '_id');
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is trying to rent their own item
    if (listing.seller._id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot rent your own item'
      });
    }

    if (listing.type !== 'rental') {
      return res.status(400).json({
        success: false,
        error: 'This item is not available for rent'
      });
    }

    if (listing.status === 'rented') {
      return res.status(400).json({
        success: false,
        error: 'Item is already rented'
      });
    }

    // Update listing status
    listing.status = 'rented';
    listing.renter = userId;
    listing.rentalStartDate = startDate;
    listing.rentalEndDate = endDate;
    listing.rentalQuantity = quantity;
    listing.rentalTotalAmount = totalAmount;

    await listing.save();

    // Populate the listing with necessary fields before sending response
    const populatedListing = await Listing.findById(listing._id)
      .populate('seller', 'username')
      .populate('renter', 'username')
      .populate('images');

    res.json({
      success: true,
      data: {
        listing: populatedListing
      }
    });
  } catch (error) {
    console.error('Rent item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while renting item'
    });
  }
};

// Return a rented item
exports.returnItem = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user._id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    if (listing.type !== 'rental') {
      return res.status(400).json({
        success: false,
        error: 'This item is not a rental'
      });
    }

    if (listing.status !== 'rented') {
      return res.status(400).json({
        success: false,
        error: 'Item is not currently rented'
      });
    }

    if (listing.renter.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to return this item'
      });
    }

    listing.status = 'available';
    listing.renter = null;
    listing.rentalStartDate = null;
    listing.rentalEndDate = null;

    await listing.save();

    res.json({
      success: true,
      data: {
        listing
      }
    });
  } catch (error) {
    console.error('Return item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while returning item'
    });
  }
}; 