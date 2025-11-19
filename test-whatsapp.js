// Simple test script to check WhatsApp field in vehicles
async function testWhatsAppField() {
  try {
    console.log('Testing WhatsApp field in vehicles...');
    
    const response = await fetch('https://zamto-1.onrender.com/api/vehicles');
    const data = await response.json();
    
    console.log('Total vehicles:', data.vehicles?.length);
    
    if (data.vehicles && data.vehicles.length > 0) {
      const firstVehicle = data.vehicles[0];
      console.log('First vehicle name:', firstVehicle.name);
      console.log('First vehicle WhatsApp:', firstVehicle.whatsappContact);
      
      // Check if WhatsApp field exists
      if (firstVehicle.whatsappContact) {
        console.log('✅ WhatsApp field is present');
      } else {
        console.log('❌ WhatsApp field is missing');
      }
    } else {
      console.log('No vehicles found');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWhatsAppField();