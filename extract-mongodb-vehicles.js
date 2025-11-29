// Script to extract vehicle data from MongoDB
import { MongoClient } from 'mongodb';
import { writeFileSync } from 'fs';
import { join } from 'path';

// MongoDB connection string (replace with your actual connection string)
const uri = "mongodb+srv://chrispo:2x6jEGwYrCiaQ6Mb@cluster1.elkcmpw.mongodb.net/?appName=Cluster1";
const dbName = "vehicles"; // Replace with your actual database name
const collectionName = "vehicles"; // Replace with your actual collection name

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

    // Convert ObjectId to string for JSON serialization
    const serializedVehicles = vehicles.map(vehicle => {
      return {
        ...vehicle,
        _id: vehicle._id.toString()
      };
    });

    // Write to JSON file
    const outputPath = join(process.cwd(), 'extracted-vehicles.json');
    writeFileSync(outputPath, JSON.stringify(serializedVehicles, null, 2));
    
    console.log(`Vehicles extracted successfully! Data written to ${outputPath}`);
    
    // Also display a sample of the data
    console.log("\nSample of extracted data:");
    console.log(JSON.stringify(serializedVehicles.slice(0, 2), null, 2));
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