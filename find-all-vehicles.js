// Script to find and extract vehicle data from all MongoDB collections
import { MongoClient } from 'mongodb';
import { writeFileSync } from 'fs';
import { join } from 'path';

// MongoDB connection string
const uri = "mongodb+srv://chrispo:2x6jEGwYrCiaQ6Mb@cluster1.elkcmpw.mongodb.net/?appName=Cluster1";

async function findAllVehicles() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    // List all databases
    console.log("\n--- DATABASES ---");
    const adminDb = client.db().admin();
    const dbInfo = await adminDb.listDatabases();
    console.log("Available databases:");
    dbInfo.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });

    let allVehicles = [];
    let foundVehicles = false;

    // Check each database for vehicle collections
    for (const db of dbInfo.databases) {
      if (db.name !== 'admin' && db.name !== 'local' && db.name !== 'config') {
        console.log(`\n--- CHECKING DATABASE: ${db.name} ---`);
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();
        
        // Check each collection in this database
        for (const collection of collections) {
          console.log(`Checking collection: ${db.name}.${collection.name}`);
          
          // Count documents
          const count = await database.collection(collection.name).estimatedDocumentCount();
          console.log(`  Documents: ${count}`);
          
          // If collection has documents, check if they look like vehicles
          if (count > 0) {
            const sampleDocs = await database.collection(collection.name).find({}).limit(5).toArray();
            
            // Check if documents have vehicle-like fields
            const hasVehicleFields = sampleDocs.some(doc => {
              const keys = Object.keys(doc);
              return keys.some(key => 
                ['name', 'price', 'category', 'type', 'year', 'mileage'].includes(key)
              );
            });
            
            if (hasVehicleFields) {
              console.log(`  *** FOUND VEHICLE-LIKE DATA IN ${db.name}.${collection.name} ***`);
              foundVehicles = true;
              
              // Extract all vehicles from this collection
              const vehicles = await database.collection(collection.name).find({}).toArray();
              console.log(`  Extracting ${vehicles.length} vehicles...`);
              
              // Process and add to allVehicles
              const processedVehicles = vehicles.map(vehicle => {
                const cleanedVehicle = { ...vehicle };
                
                // Convert ObjectId to string
                if (cleanedVehicle._id) {
                  cleanedVehicle._id = cleanedVehicle._id.toString();
                }
                
                // Add source information
                cleanedVehicle._source = `${db.name}.${collection.name}`;
                
                // Remove MongoDB-specific fields
                delete cleanedVehicle.__v;
                delete cleanedVehicle.createdAt;
                delete cleanedVehicle.updatedAt;
                
                return cleanedVehicle;
              });
              
              allVehicles = allVehicles.concat(processedVehicles);
              
              console.log(`  Added ${processedVehicles.length} vehicles from ${db.name}.${collection.name}`);
            }
          }
        }
      }
    }

    if (foundVehicles) {
      // Write all vehicles to JSON file
      const outputPath = join(process.cwd(), 'all-mongodb-vehicles.json');
      writeFileSync(outputPath, JSON.stringify(allVehicles, null, 2));
      
      console.log(`\n*** SUCCESS! ***`);
      console.log(`Found ${allVehicles.length} vehicles across all collections`);
      console.log(`Data written to ${outputPath}`);
      
      // Display summary
      console.log("\nSummary of extracted vehicles:");
      allVehicles.slice(0, 10).forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name || vehicle._id} (${vehicle.type || 'N/A'}) from ${vehicle._source}`);
      });
      
      if (allVehicles.length > 10) {
        console.log(`... and ${allVehicles.length - 10} more vehicles`);
      }
    } else {
      console.log("\n*** NO VEHICLE DATA FOUND ***");
      console.log("No collections with vehicle-like data were found in any database.");
    }

  } catch (error) {
    console.error("Error exploring database:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("\nConnection closed.");
  }
}

// Run the exploration
findAllVehicles();