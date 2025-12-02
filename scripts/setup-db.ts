import { Pool } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('🚀 Setting up database schema...\n');

        // Enable PostGIS extension
        console.log('📦 Enabling PostGIS extension...');
        await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
        console.log('✅ PostGIS enabled');

        // Create table
        console.log('\n📋 Creating health_facilities table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS health_facilities (
          id SERIAL PRIMARY KEY,
          osm_id BIGINT,
          osm_type VARCHAR(50),
          name VARCHAR(255),
          name_en VARCHAR(255),
          name_ny VARCHAR(255),
          amenity VARCHAR(100),
          building VARCHAR(100),
          healthcare VARCHAR(100),
          healthcare_speciality VARCHAR(255),
          operator_type VARCHAR(100),
          capacity_persons INTEGER,
          addr_full TEXT,
          addr_city VARCHAR(100),
          source VARCHAR(100),
          geometry GEOMETRY(Point, 4326),
          created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        console.log('✅ Table created');

        // Create indexes
        console.log('\n🔍 Creating spatial indexes...');
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_health_facilities_geometry 
      ON health_facilities USING GIST(geometry)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_health_facilities_amenity 
      ON health_facilities(amenity)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_health_facilities_healthcare 
      ON health_facilities(healthcare)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_health_facilities_operator 
      ON health_facilities(operator_type)
    `);
        console.log('✅ Indexes created');

        console.log('\n🎉 Database setup complete!');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run setup
setupDatabase()
    .then(() => {
        console.log('\n✨ All done! You can now run: npm run migrate');
        process.exit(0);
    })
    .catch((err: any) => {
        console.error('\n💥 Fatal error:', err);
        process.exit(1);
    });
// Seed data updated
