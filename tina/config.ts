import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'master'  // Changed from 'main' to 'master'

export default defineConfig({
  branch,
  
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '6e2aac42-bc7d-4839-a465-f44e0140e2ea',
  // Get this from tina.io
  token: process.env.TINA_TOKEN || '8c9607c325a9a7361dfa10c41d2d7222aaad0cde',
  
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public/vehicles',
    },
  },
  // See docs on content modeling for more info
  schema: {
    collections: [
      {
        name: 'vehicle',
        label: 'Vehicles',
        path: 'content/vehicles',
        format: 'json',
        ui: {
          router: ({ document }) => {
            return `/vehicles/${document._sys.filename}`
          },
        },
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
          },
          {
            type: 'string',
            name: 'price',
            label: 'Price',
          },
          {
            type: 'string',
            name: 'dailyRate',
            label: 'Daily Rate',
          },
          {
            type: 'string',
            name: 'image',
            label: 'Main Image URL',
          },
          {
            type: 'object',
            name: 'images',
            label: 'Images',
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.label || 'Image' }
              },
            },
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
              },
              {
                type: 'string',
                name: 'url',
                label: 'URL',
              },
            ],
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'features',
            label: 'Features',
            list: true,
          },
          {
            type: 'boolean',
            name: 'popular',
            label: 'Popular',
          },
          {
            type: 'number',
            name: 'year',
            label: 'Year',
          },
          {
            type: 'string',
            name: 'mileage',
            label: 'Mileage',
          },
          {
            type: 'string',
            name: 'transmission',
            label: 'Transmission',
            options: ['Automatic', 'Manual'],
          },
          {
            type: 'string',
            name: 'fuelType',
            label: 'Fuel Type',
            options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
          },
          {
            type: 'string',
            name: 'type',
            label: 'Type',
            options: ['sale', 'hire'],
          },
          {
            type: 'string',
            name: 'engineSize',
            label: 'Engine Size',
          },
          {
            type: 'number',
            name: 'doors',
            label: 'Doors',
          },
          {
            type: 'number',
            name: 'seats',
            label: 'Seats',
          },
          {
            type: 'string',
            name: 'color',
            label: 'Color',
          },
          {
            type: 'string',
            name: 'condition',
            label: 'Condition',
          },
          {
            type: 'string',
            name: 'serviceHistory',
            label: 'Service History',
          },
          {
            type: 'string',
            name: 'accidentHistory',
            label: 'Accident History',
          },
          {
            type: 'string',
            name: 'warranty',
            label: 'Warranty',
          },
          {
            type: 'string',
            name: 'registrationStatus',
            label: 'Registration Status',
          },
          {
            type: 'string',
            name: 'insuranceStatus',
            label: 'Insurance Status',
          },
          {
            type: 'string',
            name: 'whatsappContact',
            label: 'WhatsApp Contact',
          },
          {
            type: 'string',
            name: 'status',
            label: 'Status',
            options: ['available', 'sold'],
            required: true,
          },
        ],
      },
    ],
  },
})