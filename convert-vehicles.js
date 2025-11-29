const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('all-mongodb-vehicles.json', 'utf8'));

const converted = data.map(v => ({
  name: v.name || '',
  category: v.category || '',
  price: v.price || '',
  dailyRate: v.dailyRate || '',
  image: v.image || '',
  images: (v.images || []).map(img => ({
    label: img.label || 'additional',
    url: typeof img === 'string' ? img : (img.url || '')
  })),
  description: v.description || '',
  features: Array.isArray(v.features) ? v.features : (v.features ? [v.features] : []),
  popular: v.popular || false,
  year: v.year || null,
  mileage: v.mileage || '',
  transmission: v.transmission || '',
  fuelType: v.fuelType || '',
  type: v.type || 'sale',
  engineSize: v.engineSize || '',
  doors: v.doors || null,
  seats: v.seats || null,
  color: v.color || '',
  condition: v.condition || '',
  serviceHistory: v.serviceHistory || '',
  accidentHistory: v.accidentHistory || '',
  warranty: v.warranty || '',
  registrationStatus: v.registrationStatus || '',
  insuranceStatus: v.insuranceStatus || '',
  whatsappContact: v.whatsappContact || ''
}));

fs.mkdirSync('content/vehicles', { recursive: true });

converted.forEach((v, i) => {
  const slug = v.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `vehicle-${i}`;
  fs.writeFileSync(
    path.join('content', 'vehicles', `${slug}.json`),
    JSON.stringify(v, null, 2)
  );
});

console.log(`Converted ${converted.length} vehicles`);

