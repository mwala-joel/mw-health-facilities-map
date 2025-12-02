const fs = require('fs');
const path = require('path');

// Read the GeoJSON file
const geojsonPath = path.join(__dirname, '../public/facilities.geojson');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));

console.log('-- SQL INSERT statements for Neon PostgreSQL + PostGIS');
console.log('-- Copy and paste this entire output into Neon SQL Editor\n');
console.log('-- Clear existing data');
console.log('TRUNCATE TABLE health_facilities RESTART IDENTITY CASCADE;\n');
console.log('-- Insert facilities');

let count = 0;
for (const feature of geojson.features) {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    // Escape single quotes in strings
    const escape = (str) => {
        if (str === null || str === undefined) return 'NULL';
        return `'${String(str).replace(/'/g, "''")}'`;
    };

    const values = [
        props.osm_id || 'NULL',
        escape(props.osm_type),
        escape(props.name),
        escape(props['name:en']),
        escape(props['name:ny']),
        escape(props.amenity),
        escape(props.building),
        escape(props.healthcare),
        escape(props['healthcare:speciality']),
        escape(props['operator:type']),
        props['capacity:persons'] || 'NULL',
        escape(props['addr:full']),
        escape(props['addr:city']),
        escape(props.source),
        lng,
        lat
    ];

    console.log(`INSERT INTO health_facilities (osm_id, osm_type, name, name_en, name_ny, amenity, building, healthcare, healthcare_speciality, operator_type, capacity_persons, addr_full, addr_city, source, geometry) VALUES (${values.slice(0, 14).join(', ')}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326));`);

    count++;
}

console.log(`\n-- Total: ${count} facilities inserted`);
console.log('-- Verify the data:');
console.log('SELECT COUNT(*) FROM health_facilities;');
console.log('SELECT amenity, COUNT(*) as count FROM health_facilities WHERE amenity IS NOT NULL GROUP BY amenity ORDER BY count DESC;');
