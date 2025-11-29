import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const VehicleSchema = z.object({
  name: z.string(),
  category: z.string().optional(),
  price: z.string().optional(),
  dailyRate: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.object({
    label: z.string().optional(),
    url: z.string(),
  })).optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  popular: z.boolean().optional(),
  year: z.coerce.number().nullable().optional(),
  mileage: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  type: z.enum(['sale', 'hire']).optional(),
  engineSize: z.string().optional(),
  doors: z.coerce.number().nullable().optional(),
  seats: z.coerce.number().nullable().optional(),
  color: z.string().optional(),
  condition: z.string().optional(),
  serviceHistory: z.string().optional(),
  accidentHistory: z.string().optional(),
  warranty: z.string().optional(),
  registrationStatus: z.string().optional(),
  insuranceStatus: z.string().optional(),
  whatsappContact: z.string().optional(),
})

export type Vehicle = z.infer<typeof VehicleSchema> & {
  slug: string
}

const vehiclesDirectory = path.join(process.cwd(), 'content/vehicles')

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const filenames = fs.readdirSync(vehiclesDirectory)
    const vehicles = filenames
      .filter(name => name.endsWith('.json'))
      .map((filename) => {
        const filePath = path.join(vehiclesDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(fileContents)
        const slug = filename.replace(/\.json$/, '')
        return { ...VehicleSchema.parse(data), slug }
      })
    return vehicles
  } catch (error) {
    console.error('Error reading vehicles:', error)
    return []
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const filePath = path.join(vehiclesDirectory, `${slug}.json`)
    if (!fs.existsSync(filePath)) {
      console.log(`Vehicle file not found: ${filePath}`)
      return null
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    console.log(`Vehicle data for ${slug}:`, data) // Debug log
    return { ...VehicleSchema.parse(data), slug }
  } catch (error) {
    console.error('Error reading vehicle:', error)
    return null
  }
}

export async function getVehiclesByType(type: 'sale' | 'hire'): Promise<Vehicle[]> {
  const vehicles = await getVehicles()
  return vehicles.filter(v => v.type === type)
}