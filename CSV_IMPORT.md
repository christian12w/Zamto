# Vehicle CSV Import Feature

This document explains how to use the CSV import feature to bulk upload vehicles to your inventory.

## CSV File Format

The CSV file should have the following columns:

- `name` (required): Vehicle name
- `category` (required): Vehicle category (SUV, SMALL CARS, GROUPS & FAMILY CARS, PICKUP TRUCKS)
- `price` (required): Sale price
- `dailyRate` (optional): Daily rate for hire vehicles
- `image` (optional): Main image URL
- `images` (optional): JSON array of images with URL and label
- `description` (required): Vehicle description
- `features` (optional): Comma-separated list of features
- `popular` (optional): true/false
- `year` (optional): Vehicle year
- `mileage` (optional): Mileage information
- `transmission` (optional): Automatic/Manual/CVT
- `fuelType` (optional): Petrol/Diesel/Hybrid
- `type` (optional): sale/hire (default: sale)
- `engineSize` (optional): Engine size
- `doors` (optional): Number of doors
- `seats` (optional): Number of seats
- `color` (optional): Vehicle color
- `condition` (optional): Excellent/Good/Fair/Poor
- `serviceHistory` (optional): Service history details
- `accidentHistory` (optional): Accident history
- `warranty` (optional): Warranty information
- `registrationStatus` (optional): Registration status
- `insuranceStatus` (optional): Insurance status (for hire vehicles)

## Example CSV

See the `public/vehicles-template.csv` file for a sample CSV template.

## How to Import

1. Prepare your CSV file with vehicle data
2. Log in to the admin panel
3. Click the "Import CSV" button
4. Select your CSV file
5. Click "Import Vehicles"
6. Wait for the import to complete

## Requirements

- Maximum file size: 10MB
- File format: CSV only
- Required columns must be filled for each vehicle