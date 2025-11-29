// Script to verify the MongoDB vehicle data extraction
import { readFileSync } from 'fs';
import { join } from 'path';

function verifyExtractedData() {
  try {
    // Read the extracted vehicle data
    const dataPath = join(process.cwd(), 'all-mongodb-vehicles.json');
    const rawData = readFileSync(dataPath, 'utf8');
    const vehicles = JSON.parse(rawData);
    
    console.log("=== MongoDB Vehicle Data Verification ===");
    console.log(`Total vehicles extracted: ${vehicles.length}`);
    
    if (vehicles.length > 0) {
      console.log("\nFirst 5 vehicles:");
      vehicles.slice(0, 5).forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name || 'Unnamed Vehicle'} - ${vehicle.category || 'No Category'}`);
      });
      
      // Show data structure of first vehicle
      console.log("\nSample vehicle structure:");
      console.log(JSON.stringify(vehicles[0], null, 2));
      
      // Check for data from different sources
      const sources = [...new Set(vehicles.map(v => v._source).filter(Boolean))];
      if (sources.length > 0) {
        console.log(`\nData sources found: ${sources.join(', ')}`);
      }
    } else {
      console.log("No vehicles found in the extracted data.");
    }
    
    console.log("\n=== Verification Complete ===");
  } catch (error) {
    console.error("Error verifying data:", error.message);
    
    // Check if file exists
    try {
      const dataPath = join(process.cwd(), 'all-mongodb-vehicles.json');
      readFileSync(dataPath, 'utf8');
      console.log("File exists but there might be a parsing error.");
    } catch (fileError) {
      console.log("File does not exist or is not accessible.");
    }
  }
}

// Run verification
verifyExtractedData();