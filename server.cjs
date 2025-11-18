// Simple backend server for testing the Zamto Africa frontend integration
// This is a basic example for development purposes only

// Load environment variables
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
// Add MongoDB dependencies
const { connectDB } = require('./db/config.cjs');
const User = require('./db/models/User.cjs');
const Vehicle = require('./db/models/Vehicle.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://zamtoafrica.com',
      // Add your Netlify domain here
      'https://zamtoafrica.netlify.app',
      'https://zamtoafrica.netlify.com',
      // Render default domains
      'https://zamto-1.onrender.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Increase the payload limit for JSON and URL-encoded data to allow larger images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path} from ${req.get('origin') || 'no origin'}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Connect to MongoDB
connectDB().then(async () => {
  // Check if we need to seed initial data
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Default admin user created');
  }
  
  // Check if we need to seed initial vehicles
  const vehicleCount = await Vehicle.countDocuments();
  if (vehicleCount === 0) {
    // Create default vehicles
    const defaultVehicles = [
      {
        name: 'Toyota Land Cruiser Prado',
        category: 'SUV',
        price: 'ZMW 450,000',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        images: [{
          url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
          label: 'exterior'
        }],
        description: 'Premium SUV perfect for Zambian terrain. Powerful, reliable, and luxurious.',
        features: ['4WD', '7-seater', 'Leather interior', 'Sunroof'],
        popular: true,
        year: 2018,
        mileage: '85,000 km',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        type: 'sale',
        engineSize: '4.0L V6',
        doors: 5,
        seats: 7,
        color: 'White',
        condition: 'Good',
        serviceHistory: 'Full service history with Toyota dealership',
        accidentHistory: 'No accident history',
        warranty: '6 months',
        registrationStatus: 'Valid until 2026'
      }
    ];
    
    await Vehicle.insertMany(defaultVehicles);
    console.log('Default vehicles created');
  }
});

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'zamto_africa_secret_key';

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
}

// Admin middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
}

// API Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    // Return success response
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate password strength (basic validation)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin' // For this admin panel, all users are admins
    });
    
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser);
    
    // Return success response
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real implementation, you would invalidate the token
  // For JWT, this typically involves maintaining a blacklist
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Check if new password is different
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }
    
    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
});

// User management routes
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Return all users (excluding passwords)
    const users = await User.find({}, '-password');
    
    res.json({
      success: true,
      users: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving users'
    });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userToDelete = await User.findById(id);
    
    if (userToDelete && userToDelete.role === 'admin' && adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last admin user'
      });
    }
    
    // Delete user
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting user'
    });
  }
});

// Vehicle routes
app.get('/api/vehicles', async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Default to 50 vehicles per page
    const skip = (page - 1) * limit;
    
    // Add sorting for better performance
    const startTime = Date.now();
    const [vehicles, total] = await Promise.all([
      Vehicle.find()
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance
      Vehicle.countDocuments()
    ]);
    const endTime = Date.now();
    
    console.log(`Vehicle query took ${endTime - startTime}ms for ${vehicles.length} vehicles`);
    
    res.json({
      success: true,
      vehicles: vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Vehicles retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving vehicles: ' + error.message
    });
  }
});

app.post('/api/vehicles', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const vehicleData = req.body;
    
    console.log('Adding new vehicle with data:', JSON.stringify(vehicleData, null, 2));
    
    // Fix any HTML entity encoding issues
    if (vehicleData.category) {
      vehicleData.category = vehicleData.category.replace(/&amp;/g, '&');
    }
    
    // Create new vehicle (with flexible validation)
    const startTime = Date.now();
    const newVehicle = new Vehicle(vehicleData);
    await newVehicle.save();
    const endTime = Date.now();
    
    console.log(`Database operation took ${endTime - startTime}ms`);
    
    res.status(201).json({
      success: true,
      vehicle: newVehicle,
      message: 'Vehicle added successfully'
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding vehicle: ' + error.message
    });
  }
});

app.put('/api/vehicles/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`Updating vehicle ${id} with data:`, JSON.stringify(updates, null, 2));
    
    // Fix any HTML entity encoding issues
    if (updates.category) {
      updates.category = updates.category.replace(/&amp;/g, '&');
    }
    
    // Find and update vehicle
    const startTime = Date.now();
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    const endTime = Date.now();
    
    console.log(`Database operation took ${endTime - startTime}ms`);
    
    if (!updatedVehicle) {
      console.log(`Vehicle ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    console.log(`Successfully updated vehicle ${id}`);
    res.json({
      success: true,
      vehicle: updatedVehicle,
      message: 'Vehicle updated successfully'
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating vehicle: ' + error.message
    });
  }
});

app.delete('/api/vehicles/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting vehicle ${id}`);
    
    // Delete vehicle
    const startTime = Date.now();
    const result = await Vehicle.findByIdAndDelete(id);
    const endTime = Date.now();
    
    console.log(`Database operation took ${endTime - startTime}ms`);
    
    if (!result) {
      console.log(`Vehicle ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    console.log(`Successfully deleted vehicle ${id}`);
    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting vehicle: ' + error.message
    });
  }
});

// Bulk import route
app.post('/api/vehicles/import', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { vehicles } = req.body;
    
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicles data is required and must be an array'
      });
    }
    
    // Insert all vehicles
    const result = await Vehicle.insertMany(vehicles);
    
    res.status(201).json({
      success: true,
      imported: result.length,
      message: `${result.length} vehicles imported successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while importing vehicles: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Add a keep-alive endpoint
app.get('/api/keep-alive', (req, res) => {
  res.json({
    success: true,
    message: 'Keep-alive ping received',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
});

module.exports = app;