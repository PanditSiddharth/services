'use client';

import { useState } from 'react';
import { 
  seedUsers, 
  seedServices, 
  seedServiceProviders, 
  seedBookings, 
  seedReviews, 
  seedDatabase,
} from '@/lib/seeder';

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: string }>({});

  const handleSeed = async (seedFunction: () => Promise<any>, name: string) => {
    try {
      // Set loading state for this specific function
      setLoading(prev => ({ ...prev, [name]: true }));
      setResults(prev => ({ ...prev, [name]: 'Processing...' }));

      // Execute the seed function
      await seedFunction();
      
      // Update the result
      setResults(prev => ({ 
        ...prev, 
        [name]: `✅ ${name} seeded successfully!` 
      }));
    } catch (error: any) {
      console.error(`Error seeding ${name}:`, error);
      setResults(prev => ({ 
        ...prev, 
        [name]: `❌ Error: ${error.message || 'Something went wrong'}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Seeder</h1>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-bold">Warning</p>
        <p>This will delete all existing data in the database and replace it with sample data.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SeedCard 
          title="Seed All Data"
          description="Seeds all collections (users, services, providers, bookings, reviews)"
          isLoading={loading['All']}
          result={results['All']}
          onClick={() => handleSeed(seedDatabase, 'All')}
        />

        <SeedCard 
          title="Seed Users"
          description="Creates 100 sample users"
          isLoading={loading['Users']}
          result={results['Users']}
          onClick={() => handleSeed(seedUsers, 'Users')}
        />

        <SeedCard 
          title="Seed Services"
          description="Creates service categories and sub-services"
          isLoading={loading['Services']}
          result={results['Services']}
          onClick={() => handleSeed(seedServices, 'Services')}
        />

        <SeedCard 
          title="Seed Service Providers"
          description="Creates 100 sample service providers"
          isLoading={loading['Providers']}
          result={results['Providers']}
          onClick={() => handleSeed(seedServiceProviders, 'Providers')}
        />

        <SeedCard 
          title="Seed Bookings"
          description="Creates 200 sample bookings"
          isLoading={loading['Bookings']}
          result={results['Bookings']}
          onClick={() => handleSeed(seedBookings, 'Bookings')}
        />

        <SeedCard 
          title="Seed Reviews"
          description="Creates reviews for completed bookings"
          isLoading={loading['Reviews']}
          result={results['Reviews']}
          onClick={() => handleSeed(seedReviews, 'Reviews')}
        />
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Seeding Order</h2>
        <p>To manually seed collections, follow this order:</p>
        <ol className="list-decimal ml-5">
          <li>Users</li>
          <li>Services</li>
          <li>Service Providers</li>
          <li>Bookings</li>
          <li>Reviews</li>
        </ol>
      </div>
    </div>
  );
}

interface SeedCardProps {
  title: string;
  description: string;
  isLoading?: boolean;
  result?: string;
  onClick: () => void;
}

function SeedCard({ title, description, isLoading, result, onClick }: SeedCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`px-4 py-2 rounded font-medium ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Processing...' : 'Run Seeder'}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${
          result.includes('✅') ? 'bg-green-50 text-green-800' : 
          result.includes('❌') ? 'bg-red-50 text-red-800' : 
          'bg-gray-50 text-gray-800'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
}