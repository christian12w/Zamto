// Vehicle model
const { mongoose } = require('../../db/config.cjs');

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
    required: true,
    enum: ['SUV', 'SMALL CARS', 'GROUPS & FAMILY CARS', 'PICKUP TRUCKS'],
    default: 'SUV'
  },
  price: {
    type: String,
    required: true
  },
  dailyRate: {
    type: String
  },
  image: {
    type: String,
    default: ''
  },
  images: [vehicleImageSchema],
  description: {
    type: String,
    required: true
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
  }
}, {
  timestamps: true
});

// Indexes
vehicleSchema.index({ name: 'text', description: 'text' });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ popular: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);