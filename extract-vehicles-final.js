// Script to extract vehicle data from MongoDB vehicles database
import { MongoClient } from 'mongodb';
import { writeFileSync } from 'fs';
import { join } from 'path';

// MongoDB connection string
const uri = "mongodb+srv://chrispo:2x6jEGwYrCiaQ6Mb@cluster1.elkcmpw.mongodb.net/?appName=Cluster1";
const dbName = "vehicles";
const collectionName = "vehicles";

async function extractVehicles() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    // Access the database and collection
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Extract all vehicles
    console.log("Extracting vehicles...");
    const vehicles = await collection.find({}).toArray();
    
    console.log(`Found ${vehicles.length} vehicles`);

    // Convert ObjectId to string for JSON serialization and clean up the data
    const serializedVehicles = vehicles.map(vehicle => {
      const cleanedVehicle = { ...vehicle };
      
      // Convert ObjectId to string
      if (cleanedVehicle._id) {
        cleanedVehicle._id = cleanedVehicle._id.toString();
      }
      
      // Remove MongoDB-specific fields
      delete cleanedVehicle.__v;
      delete cleanedVehicle.createdAt;
      delete cleanedVehicle.updatedAt;
      
      return cleanedVehicle;
    });

    // Write to JSON file
    const outputPath = join(process.cwd(), 'mongodb-vehicles.json');
    writeFileSync(outputPath, JSON.stringify(serializedVehicles, null, 2));
    
    console.log(`Vehicles extracted successfully! Data written to ${outputPath}`);
    
    // Display summary
    console.log("\nSummary of extracted vehicles:");
    serializedVehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.name || vehicle._id} (${vehicle.type || 'N/A'})`);
    });
    
    // Show sample of first vehicle
    if (serializedVehicles.length > 0) {
      console.log("\nSample of first vehicle data:");
      console.log(JSON.stringify(serializedVehicles[0], null, 2));
    }
  } catch (error) {
    console.error("Error extracting vehicles:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed.");
  }
}

// Run the extraction
extractVehicles();