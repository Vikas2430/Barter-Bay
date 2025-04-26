const Rental = require('../models/Rental');

// Get all available rentals
exports.getAvailableRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: 'available' })
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's rentals (both rented and owned)
exports.getUserRentals = async (req, res) => {
  try {
    const userId = req.user._id;
    const rentals = await Rental.find({
      $or: [
        { owner: userId },
        { renter: userId }
      ]
    }).populate('owner renter', 'username email');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new rental
exports.createRental = async (req, res) => {
  try {
    const rental = new Rental({
      ...req.body,
      owner: req.user._id
    });
    const savedRental = await rental.save();
    res.status(201).json(savedRental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Rent an item
exports.rentItem = async (req, res) => {
  try {
    const { rentalId, startDate, endDate } = req.body;
    
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for rent' });
    }
    
    rental.renter = req.user._id;
    rental.status = 'rented';
    rental.rentalStartDate = startDate;
    rental.rentalEndDate = endDate;
    
    const updatedRental = await rental.save();
    res.json(updatedRental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Return a rented item
exports.returnItem = async (req, res) => {
  try {
    const { rentalId } = req.params;
    
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to return this item' });
    }
    
    rental.status = 'returned';
    rental.renter = null;
    rental.rentalStartDate = null;
    rental.rentalEndDate = null;
    
    const updatedRental = await rental.save();
    res.json(updatedRental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 