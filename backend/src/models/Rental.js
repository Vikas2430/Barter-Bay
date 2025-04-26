const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  location: {
    type: String,
    required: true
  },
  pricing: {
    daily: {
      type: Number,
      required: true
    },
    weekly: {
      type: Number,
      required: true
    },
    monthly: {
      type: Number,
      required: true
    }
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  contactInfo: {
    type: String,
    required: true
  },
  photos: [{
    type: String,
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'returned'],
    default: 'available'
  },
  rentalStartDate: {
    type: Date
  },
  rentalEndDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental; 