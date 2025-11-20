// Vehicle model
const { mongoose } = require('../config.cjs');

const vehicleImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  label: {
    type: String,
    enum: ['exterior', 'interior', 'front', 'back', 'additional'],
    required: true
  }
});

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: false, // Make category optional
    enum: ['SUV', 'SMALL CARS', 'GROUPS & FAMILY CARS', 'PICKUP TRUCKS'],
    default: 'SUV'
  },
  price: {
    type: String,
    required: false // Make price optional to allow for hire vehicles
  },
  dailyRate: {
    type: String,
    required: false // Make dailyRate optional for sale vehicles
  },
  image: {
    type: String,
    default: ''
  },
  images: [vehicleImageSchema],
  description: {
    type: String,
    required: false // Make description optional
  },
  features: [{
    type: String
  }],
  popular: {
    type: Boolean,
    default: false
  },
  year: {
    type: Number
  },
  mileage: {
    type: String
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual', 'CVT']
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Hybrid']
  },
  type: {
    type: String,
    enum: ['sale', 'hire'],
    default: 'sale'
  },
  engineSize: {
    type: String
  },
  doors: {
    type: Number
  },
  seats: {
    type: Number
  },
  color: {
    type: String
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  serviceHistory: {
    type: String
  },
  accidentHistory: {
    type: String
  },
  warranty: {
    type: String
  },
  registrationStatus: {
    type: String
  },
  insuranceStatus: {
    type: String
  },
  // Add WhatsApp contact field
  whatsappContact: {
    type: String,
    default: '+260572213038' // Default company WhatsApp number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
vehicleSchema.index({ name: 'text', description: 'text' });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ popular: 1 });
vehicleSchema.index({ createdAt: -1 }); // For sorting by creation date
vehicleSchema.index({ type: 1, category: 1 }); // Compound index for common queries
vehicleSchema.index({ popular: 1, type: 1 }); // Compound index for popular vehicles by type

module.exports = mongoose.model('Vehicle', vehicleSchema);