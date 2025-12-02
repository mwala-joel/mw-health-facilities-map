import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Database connection - hardcoded for now
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Vq6aEnwj7its@ep-muddy-river-a4crf6xe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});

interface GeoJSONFeature {
    type: string;
    properties: {
        name?: string;
        'name:en'?: string;
        'name:ny'?: string;
        amenity?: string;
        building?: string;
        healthcare?: string;
        'healthcare:speciality'?: string;
        'operator:type'?: string;
        'capacity:persons'?: number;
        'addr:full'?: string;
        'addr:city'?: string;
        source?: string;
        osm_id?: number;
        osm_type?: string;
    };
    geometry: {
        type: string;
        coordinates: any;
    };
}

interface GeoJSONCollection {
    type: string;
    features: GeoJSONFeature[];
}

async function migrateData() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting migration...\n');

        // Read GeoJSON files
        const pointsPath = path.join(process.cwd(), 'public', 'facilities.geojson');

        console.log('📖 Reading GeoJSON files...');
        const pointsData: GeoJSONCollection = JSON.parse(fs.readFileSync(pointsPath, 'utf-8'));

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await client.query('TRUNCATE TABLE health_facilities RESTART IDENTITY CASCADE');

        // Insert point facilities
        console.log(`📍 Inserting ${pointsData.features.length} point facilities...`);
        let insertedCount = 0;

        for (const feature of pointsData.features) {
            const props = feature.properties;
            const [lng, lat] = feature.geometry.coordinates;

            await client.query(
                `INSERT INTO health_facilities (
          osm_id, osm_type, name, name_en, name_ny, amenity, building, 
          healthcare, healthcare_speciality, operator_type, capacity_persons,
          addr_full, addr_city, source, geometry
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, ST_SetSRID(ST_MakePoint($15, $16), 4326))`,
                [
                    props.osm_id,
                    props.osm_type,
                    props.name,
                    props['name:en'],
                    props['name:ny'],
                    props.amenity,
                    props.building,
                    props.healthcare,
                    props['healthcare:speciality'],
                    props['operator:type'],
                    props['capacity:persons'],
                    props['addr:full'],
                    props['addr:city'],
                    props.source,
                    lng,
                    lat
                ]
            );
            insertedCount++;

            if (insertedCount % 20 === 0) {
                process.stdout.write(`\r   Inserted ${insertedCount}/${pointsData.features.length} facilities...`);
            }
        }
        console.log(`\n✅ Inserted ${insertedCount} point facilities`);

        // Verify data
        const result = await client.query('SELECT COUNT(*) FROM health_facilities');
        console.log(`\n✅ Migration complete! Total facilities in database: ${result.rows[0].count}`);

        // Show some stats
        const statsResult = await client.query(`
      SELECT amenity, COUNT(*) as count 
      FROM health_facilities 
      WHERE amenity IS NOT NULL 
      GROUP BY amenity 
      ORDER BY count DESC
    `);

        console.log('\n📊 Facility breakdown by type:');
        statsResult.rows.forEach((row: any) => {
            console.log(`   ${row.amenity}: ${row.count}`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run migration
migrateData()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((err: any) => {
        console.error('\n💥 Fatal error:', err);
        process.exit(1);
    });
// Added error logging
