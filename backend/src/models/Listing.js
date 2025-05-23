const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sale', 'rental'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: function() { return this.type === 'sale'; },
      min: 0
    },
    perDay: {
      type: Number,
      required: function() { return this.type === 'rental'; },
      min: 0
    },
    perWeek: {
      type: Number,
      required: function() { return this.type === 'rental'; },
      min: 0
    },
    perMonth: {
      type: Number,
      required: function() { return this.type === 'rental'; },
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: function() { return this.type === 'rental'; },
      min: 0
    },
    deliveryCharges: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  }],
  status: {
    type: String,
    enum: ['available', 'rented', 'returned', 'sold', 'inactive'],
    default: 'available'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rentalStartDate: {
    type: Date
  },
  rentalEndDate: {
    type: Date
  },
  rentalQuantity: {
    type: Number,
    min: 1,
    default: 1
  },
  rentalTotalAmount: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing; 