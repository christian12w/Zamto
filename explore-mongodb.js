// Script to explore MongoDB structure
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = "mongodb+srv://chrispo:2x6jEGwYrCiaQ6Mb@cluster1.elkcmpw.mongodb.net/?appName=Cluster1";

async function exploreDatabase() {
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

    // For each database, list collections
    for (const db of dbInfo.databases) {
      if (db.name !== 'admin' && db.name !== 'local' && db.name !== 'config') {
        console.log(`\n--- COLLECTIONS IN DATABASE: ${db.name} ---`);
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();
        console.log(`Collections in ${db.name}:`);
        collections.forEach(collection => {
          console.log(`- ${collection.name}`);
          
          // Count documents in each collection
          database.collection(collection.name).estimatedDocumentCount()
            .then(count => {
              console.log(`  (${count} documents)`);
            })
            .catch(err => {
              console.log(`  (Could not count documents: ${err.message})`);
            });
        });
      }
    }

    // Try to find collections with vehicle-like names
    console.log("\n--- SEARCHING FOR VEHICLE COLLECTIONS ---");
    for (const db of dbInfo.databases) {
      if (db.name !== 'admin' && db.name !== 'local' && db.name !== 'config') {
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();
        
        for (const collection of collections) {
          if (collection.name.toLowerCase().includes('vehicle') || 
              collection.name.toLowerCase().includes('car') ||
              collection.name.toLowerCase().includes('product')) {
            
            console.log(`Found potential vehicle collection: ${db.name}.${collection.name}`);
            
            // Sample a few documents
            const sampleDocs = await database.collection(collection.name).find({}).limit(3).toArray();
            console.log(`Sample documents from ${db.name}.${collection.name}:`);
            console.log(JSON.stringify(sampleDocs, null, 2));
          }
        }
      }
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
exploreDatabase();