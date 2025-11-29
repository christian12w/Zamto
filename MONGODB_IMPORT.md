# MongoDB Vehicle Data Import Guide

This guide explains how to switch from static vehicle data to MongoDB data and import the vehicle data into your MongoDB database.

## Configuration Changes

The application has been configured to use MongoDB data instead of static data by changing the environment variable:

```env
VITE_USE_STATIC_DATA=false
```

This change was made in the `.env` file, which tells the application to fetch vehicle data from the MongoDB database via the API instead of using the static JSON file.

## How the Import Process Works

1. The application now connects to the MongoDB database via the API endpoints
2. Vehicle data is stored persistently in MongoDB rather than in localStorage
3. All visitors will see the same current vehicle inventory across all browsers and devices

## Importing Vehicle Data

There are two ways to import the vehicle data into MongoDB:

### Method 1: Using the HTML Import Tool

1. Start your server by running:
   ```
   node server.cjs
   ```

2. Open `import-vehicles.html` in your browser

3. Click the "Import Vehicles" button

4. The tool will:
   - Authenticate as the admin user
   - Load vehicle data from `all-mongodb-vehicles.json`
   - Import vehicles in batches of 10 to avoid overwhelming the server
   - Show progress and completion status

### Method 2: Using the Node.js Script

1. Start your server by running:
   ```
   node server.cjs
   ```

2. Run the import script:
   ```
   node import-mongodb-vehicles.js
   ```

3. The script will:
   - Authenticate as the admin user
   - Load vehicle data from `all-mongodb-vehicles.json`
   - Import vehicles in batches of 10
   - Show progress and completion status

## Default Admin Credentials

The default admin credentials are:
- Username: `admin`
- Password: `admin123`

These credentials are created automatically when the server starts if no users exist in the database.

## Verification

After importing the vehicle data:

1. Visit your website
2. All visitors should now see the current vehicle inventory from MongoDB
3. Changes to vehicle data will be reflected for all users immediately
4. Cached data issues should be resolved

## Troubleshooting

If you encounter issues:

1. Make sure the server is running on `http://localhost:3001`
2. Verify MongoDB is connected and accessible
3. Check that the admin user exists in the database
4. Ensure the `all-mongodb-vehicles.json` file is in the correct location
5. Check the browser console and server logs for error messages

## Benefits of Using MongoDB

1. **Real-time Updates**: All visitors see current vehicle data
2. **Persistence**: Data is stored permanently in the database
3. **Consistency**: Same inventory across all browsers and devices
4. **Scalability**: Can handle large amounts of vehicle data
5. **Admin Features**: Full CRUD operations for vehicle management