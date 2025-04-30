import { Service, ServiceProvider, User } from "../models"
import connectDB from "./db"
import bcrypt from "bcryptjs"

const services = [
  {
    name: "Plumbing",
    slug: "plumbing",
    description: "Pipe repairs, installations, leakages, bathroom fittings and more",
    icon: "Wrench",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "Pipe Repair",
        description: "Fix leaking or damaged pipes",
        basePrice: 300,
        priceUnit: "hour",
      },
      {
        name: "Tap Installation",
        description: "Install new taps or replace old ones",
        basePrice: 250,
        priceUnit: "job",
      },
      {
        name: "Toilet Repair",
        description: "Fix toilet flush, leakage or installation",
        basePrice: 400,
        priceUnit: "job",
      },
    ],
  },
  {
    name: "Electrical",
    slug: "electrical",
    description: "Wiring, repairs, installations, electrical appliance setup and maintenance",
    icon: "Zap",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "Wiring Repair",
        description: "Fix electrical wiring issues",
        basePrice: 350,
        priceUnit: "hour",
      },
      {
        name: "Switch/Socket Installation",
        description: "Install new switches or sockets",
        basePrice: 200,
        priceUnit: "job",
      },
      {
        name: "Fan Installation",
        description: "Install ceiling or wall fans",
        basePrice: 450,
        priceUnit: "job",
      },
    ],
  },
  {
    name: "Mechanical",
    slug: "mechanical",
    description: "Vehicle repairs, maintenance, parts replacement and diagnostics",
    icon: "Tool",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "Car Service",
        description: "Regular car maintenance service",
        basePrice: 1500,
        priceUnit: "job",
      },
      {
        name: "Bike Repair",
        description: "Fix bike issues and maintenance",
        basePrice: 800,
        priceUnit: "job",
      },
      {
        name: "Vehicle Diagnostics",
        description: "Diagnose vehicle problems",
        basePrice: 500,
        priceUnit: "job",
      },
    ],
  },
  {
    name: "Carpentry",
    slug: "carpentry",
    description: "Furniture assembly, repairs, custom woodwork and installations",
    icon: "Hammer",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "Furniture Assembly",
        description: "Assemble new furniture",
        basePrice: 400,
        priceUnit: "hour",
      },
      {
        name: "Door Repair",
        description: "Fix door issues or install new doors",
        basePrice: 600,
        priceUnit: "job",
      },
      {
        name: "Custom Shelving",
        description: "Build custom shelves or cabinets",
        basePrice: 800,
        priceUnit: "job",
      },
    ],
  },
  {
    name: "Painting",
    slug: "painting",
    description: "Interior and exterior painting, wall textures, and touch-ups",
    icon: "Paintbrush",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "Room Painting",
        description: "Paint a single room",
        basePrice: 2500,
        priceUnit: "job",
      },
      {
        name: "Wall Texture",
        description: "Apply textured finish to walls",
        basePrice: 80,
        priceUnit: "hour",
      },
      {
        name: "Touch-up Painting",
        description: "Touch up existing paint",
        basePrice: 300,
        priceUnit: "hour",
      },
    ],
  },
  {
    name: "AC & Appliance Repair",
    slug: "ac-appliance-repair",
    description: "AC servicing, refrigerator, washing machine and appliance repairs",
    icon: "Thermometer",
    image: "/placeholder.svg",
    subServices: [
      {
        name: "AC Service",
        description: "Regular AC maintenance and cleaning",
        basePrice: 600,
        priceUnit: "job",
      },
      {
        name: "Refrigerator Repair",
        description: "Fix refrigerator issues",
        basePrice: 500,
        priceUnit: "job",
      },
      {
        name: "Washing Machine Repair",
        description: "Fix washing machine problems",
        basePrice: 450,
        priceUnit: "job",
      },
    ],
  },
]

const serviceProviders = [
  {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh@example.com",
    password: "password123",
    phone: "9876543210",
    profileImage: "/placeholder.svg",
    experience: 8,
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      landmark: "Near City Hospital",
    },
    location: {
      type: "Point",
      coordinates: [72.8777, 19.076], // Mumbai coordinates
    },
    serviceArea: 15,
    availability: {
      isAvailable: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      workingHours: {
        start: "09:00",
        end: "18:00",
      },
    },
    identityProof: "ID12345",
    addressProof: "ADDR12345",
    isVerified: true,
    isActive: true,
    rating: 4.8,
    totalReviews: 124,
    totalBookings: 150,
    completedBookings: 145,
    bankDetails: {
      accountHolderName: "Rajesh Kumar",
      accountNumber: "1234567890",
      ifscCode: "ABCD0001234",
      bankName: "State Bank of India",
      branch: "Mumbai Main",
    },
  },
  {
    firstName: "Sunil",
    lastName: "Sharma",
    email: "sunil@example.com",
    password: "password123",
    phone: "9876543211",
    profileImage: "/placeholder.svg",
    experience: 10,
    address: {
      street: "456 Park Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      landmark: "Near Central Park",
    },
    location: {
      type: "Point",
      coordinates: [72.8856, 19.1136], // Malad, Mumbai coordinates
    },
    serviceArea: 10,
    availability: {
      isAvailable: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      workingHours: {
        start: "08:00",
        end: "20:00",
      },
    },
    identityProof: "ID67890",
    addressProof: "ADDR67890",
    isVerified: true,
    isActive: true,
    rating: 4.9,
    totalReviews: 156,
    totalBookings: 180,
    completedBookings: 178,
    bankDetails: {
      accountHolderName: "Sunil Sharma",
      accountNumber: "0987654321",
      ifscCode: "EFGH0005678",
      bankName: "HDFC Bank",
      branch: "Malad",
    },
  },
  {
    firstName: "Amit",
    lastName: "Patel",
    email: "amit@example.com",
    password: "password123",
    phone: "9876543212",
    profileImage: "/placeholder.svg",
    experience: 6,
    address: {
      street: "789 Lake Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400091",
      landmark: "Near Railway Station",
    },
    location: {
      type: "Point",
      coordinates: [72.8562, 19.2183], // Borivali, Mumbai coordinates
    },
    serviceArea: 12,
    availability: {
      isAvailable: false,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHours: {
        start: "10:00",
        end: "19:00",
      },
    },
    identityProof: "ID24680",
    addressProof: "ADDR24680",
    isVerified: true,
    isActive: true,
    rating: 4.7,
    totalReviews: 98,
    totalBookings: 120,
    completedBookings: 115,
    bankDetails: {
      accountHolderName: "Amit Patel",
      accountNumber: "2468013579",
      ifscCode: "IJKL0009876",
      bankName: "ICICI Bank",
      branch: "Borivali",
    },
  },
  {
    firstName: "Priya",
    lastName: "Singh",
    email: "priya@example.com",
    password: "password123",
    phone: "9876543213",
    profileImage: "/placeholder.svg",
    experience: 5,
    address: {
      street: "101 Hill View",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400014",
      landmark: "Near Market Square",
    },
    location: {
      type: "Point",
      coordinates: [72.8296, 19.0178], // Dadar, Mumbai coordinates
    },
    serviceArea: 8,
    availability: {
      isAvailable: true,
      workingDays: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"],
      workingHours: {
        start: "09:00",
        end: "17:00",
      },
    },
    identityProof: "ID13579",
    addressProof: "ADDR13579",
    isVerified: true,
    isActive: true,
    rating: 4.6,
    totalReviews: 87,
    totalBookings: 95,
    completedBookings: 92,
    bankDetails: {
      accountHolderName: "Priya Singh",
      accountNumber: "1357924680",
      ifscCode: "MNOP0001357",
      bankName: "Axis Bank",
      branch: "Dadar",
    },
  },
  {
    firstName: "Mohammed",
    lastName: "Khan",
    email: "mohammed@example.com",
    password: "password123",
    phone: "9876543214",
    profileImage: "/placeholder.svg",
    experience: 12,
    address: {
      street: "202 Sea View",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      landmark: "Near Beach Road",
    },
    location: {
      type: "Point",
      coordinates: [72.8296, 19.0596], // Bandra, Mumbai coordinates
    },
    serviceArea: 20,
    availability: {
      isAvailable: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      workingHours: {
        start: "08:00",
        end: "21:00",
      },
    },
    identityProof: "ID97531",
    addressProof: "ADDR97531",
    isVerified: true,
    isActive: true,
    rating: 4.9,
    totalReviews: 132,
    totalBookings: 160,
    completedBookings: 158,
    bankDetails: {
      accountHolderName: "Mohammed Khan",
      accountNumber: "9753102468",
      ifscCode: "QRST0009753",
      bankName: "Kotak Mahindra Bank",
      branch: "Bandra",
    },
  },
  {
    firstName: "Lakshmi",
    lastName: "Rao",
    email: "lakshmi@example.com",
    password: "password123",
    phone: "9876543215",
    profileImage: "/placeholder.svg",
    experience: 7,
    address: {
      street: "303 Green Valley",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
      landmark: "Near Shopping Mall",
    },
    location: {
      type: "Point",
      coordinates: [72.9052, 19.1163], // Powai, Mumbai coordinates
    },
    serviceArea: 15,
    availability: {
      isAvailable: true,
      workingDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
      workingHours: {
        start: "10:00",
        end: "18:00",
      },
    },
    identityProof: "ID86420",
    addressProof: "ADDR86420",
    isVerified: true,
    isActive: true,
    rating: 4.8,
    totalReviews: 104,
    totalBookings: 125,
    completedBookings: 120,
    bankDetails: {
      accountHolderName: "Lakshmi Rao",
      accountNumber: "8642097531",
      ifscCode: "UVWX0008642",
      bankName: "Punjab National Bank",
      branch: "Powai",
    },
  },
]

const users = [
  {
    firstName: "Rahul",
    lastName: "Gupta",
    email: "rahul@example.com",
    password: "password123",
    phone: "9876543220",
    address: {
      street: "404 City Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      landmark: "Near Central Mall",
    },
    profileImage: "/placeholder.svg",
  },
  {
    firstName: "Neha",
    lastName: "Verma",
    email: "neha@example.com",
    password: "password123",
    phone: "9876543221",
    address: {
      street: "505 Ocean View",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      landmark: "Near Beach",
    },
    profileImage: "/placeholder.svg",
  },
  {
    firstName: "Vikram",
    lastName: "Mehta",
    email: "vikram@example.com",
    password: "password123",
    phone: "9876543222",
    address: {
      street: "606 Mountain Heights",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
      landmark: "Near Hill Park",
    },
    profileImage: "/placeholder.svg",
  },
]

async function seedDatabase() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing data
    await Service.deleteMany({})
    await ServiceProvider.deleteMany({})
    await User.deleteMany({})

    console.log("Cleared existing data")

    // Insert services
    const createdServices = await Service.insertMany(services)
    console.log(`Inserted ${createdServices.length} services`)

    // Hash passwords for service providers
    const hashedServiceProviders = await Promise.all(
      serviceProviders.map(async (provider) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(provider.password, salt)

        // Assign service IDs to providers
        const serviceIndex = Math.floor(Math.random() * createdServices.length)
        const service = createdServices[serviceIndex]

        return {
          ...provider,
          password: hashedPassword,
          profession: service._id,
          services: service.subServices.map((subService) => ({
            service: service._id,
            price: subService.basePrice + Math.floor(Math.random() * 100), // Add some variation
            priceUnit: subService.priceUnit,
          })),
        }
      }),
    )

    // Insert service providers
    const createdProviders = await ServiceProvider.insertMany(hashedServiceProviders)
    console.log(`Inserted ${createdProviders.length} service providers`)

    // Update services with provider references
    for (const provider of createdProviders) {
      await Service.findByIdAndUpdate(provider.profession, { $push: { providers: provider._id } })
    }

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)

        return {
          ...user,
          password: hashedPassword,
        }
      }),
    )

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers)
    console.log(`Inserted ${createdUsers.length} users`)

    console.log("Database seeded successfully")

    return {
      services: createdServices,
      providers: createdProviders,
      users: createdUsers,
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

export default seedDatabase
