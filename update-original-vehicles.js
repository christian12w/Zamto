// Script to update specific vehicles with original MongoDB data
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read current JSON data
const jsonData = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'vehicles.json'), 'utf8'));

// Original data from CSV files
const originalVehicles = [
  {
    name: "Toyota Hilux",
    category: "PICKUP TRUCKS",
    price: "K752000",
    description: "4WD with duty and registration. Located at Lusaka Great East Road.",
    features: ["4WD", "Duty and registration", "2400cc Diesel"],
    year: "2018",
    mileage: "97300 km",
    transmission: "Manual",
    fuelType: "Diesel",
    engineSize: "2400cc",
    color: "Black",
    type: "sale"
  },
  {
    name: "Toyota Land Cruiser Prado TZ-G",
    category: "SUV",
    price: "K1170000",
    description: "2023 model with 4WD and duty registration. Located at Lusaka Great East Road.",
    features: ["4WD", "Duty and registration", "2800cc Diesel"],
    year: "2023",
    mileage: "59480 km",
    transmission: "Automatic",
    fuelType: "Diesel",
    engineSize: "2800cc",
    color: "White",
    type: "sale"
  }
];

// Update vehicles with original data
const updatedVehicles = jsonData.map(vehicle => {
  const originalVehicle = originalVehicles.find(v => v.name.includes(vehicle.name) || vehicle.name.includes(v.name));
  
  if (originalVehicle) {
    console.log(`Updating vehicle: ${vehicle.name}`);
    return {
      ...vehicle,
      category: originalVehicle.category,
      price: originalVehicle.price,
      description: originalVehicle.description,
      features: originalVehicle.features,
      year: parseInt(originalVehicle.year),
      mileage: originalVehicle.mileage,
      transmission: originalVehicle.transmission,
      fuelType: originalVehicle.fuelType,
      engineSize: originalVehicle.engineSize,
      color: originalVehicle.color,
      type: originalVehicle.type
    };
  }
  
  return vehicle;
});

// Write updated data back to JSON file
writeFileSync(
  join(process.cwd(), 'src', 'data', 'vehicles-updated.json'),
  JSON.stringify(updatedVehicles, null, 2)
);

console.log('Updated vehicles data written to src/data/vehicles-updated.json');
console.log('Successfully updated 2 vehicles with original MongoDB data');