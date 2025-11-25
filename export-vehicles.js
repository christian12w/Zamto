// Export vehicles from MongoDB to JSON format
import { connectDB } from './db/config.cjs';
import Vehicle from './db/models/Vehicle.cjs';
import { writeFileSync } from 'fs';

async function exportVehicles() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully!');
    
    // Fetch all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles in database`);
    
    // Transform vehicles to match the static data format
    const staticVehicles = vehicles.map((vehicle, index) => {
      // Convert MongoDB document to plain object
      const vehicleObj = vehicle.toObject();
      
      // Create the static vehicle format
      return {
        id: vehicleObj._id.toString(),
        name: vehicleObj.name,
        category: vehicleObj.category || 'SUV',
        price: vehicleObj.price || '',
        dailyRate: vehicleObj.dailyRate || '',
        image: vehicleObj.image || '',
        images: vehicleObj.images || [],
        description: vehicleObj.description || '',
        features: vehicleObj.features || [],
        popular: vehicleObj.popular || false,
        year: vehicleObj.year,
        mileage: vehicleObj.mileage || '',
        transmission: vehicleObj.transmission,
        fuelType: vehicleObj.fuelType,
        type: vehicleObj.type || 'sale',
        engineSize: vehicleObj.engineSize || '',
        doors: vehicleObj.doors,
        seats: vehicleObj.seats,
        color: vehicleObj.color || '',
        condition: vehicleObj.condition,
        serviceHistory: vehicleObj.serviceHistory || '',
        accidentHistory: vehicleObj.accidentHistory || '',
        warranty: vehicleObj.warranty || '',
        registrationStatus: vehicleObj.registrationStatus || '',
        insuranceStatus: vehicleObj.insuranceStatus || '',
        whatsappContact: vehicleObj.whatsappContact || '+260572213038'
      };
    });
    
    // Output the JSON to console
    console.log('\n=== VEHICLE DATA IN JSON FORMAT ===\n');
    console.log(JSON.stringify(staticVehicles, null, 2));
    
    // Also save to a file
    writeFileSync('exported-vehicles.json', JSON.stringify(staticVehicles, null, 2));
    console.log('\nVehicles exported to exported-vehicles.json');
    
    process.exit(0);
  } catch (error) {
    console.error('Export failed:', error.message);
    process.exit(1);
  }
}

exportVehicles();