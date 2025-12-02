import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        const radius = parseFloat(searchParams.get('radius') || '10'); // Default 10km

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        // Use PostGIS ST_DWithin for efficient spatial query
        // ST_DWithin uses meters for geography type
        const query = `
      SELECT 
        id,
        osm_id,
        osm_type,
        name,
        name_en,
        name_ny,
        amenity,
        building,
        healthcare,
        healthcare_speciality,
        operator_type,
        capacity_persons,
        addr_full,
        addr_city,
        source,
        ST_X(geometry) as longitude,
        ST_Y(geometry) as latitude,
        ST_Distance(
          geometry::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 as distance_km
      FROM health_facilities
      WHERE ST_DWithin(
        geometry::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3 * 1000
      )
      ORDER BY distance_km
    `;

        const result = await pool.query(query, [lng, lat, radius]);

        // Convert to GeoJSON format
        const geojson = {
            type: 'FeatureCollection',
            features: result.rows.map(row => ({
                type: 'Feature',
                properties: {
                    name: row.name,
                    'name:en': row.name_en,
                    'name:ny': row.name_ny,
                    amenity: row.amenity,
                    building: row.building,
                    healthcare: row.healthcare,
                    'healthcare:speciality': row.healthcare_speciality,
                    'operator:type': row.operator_type,
                    'capacity:persons': row.capacity_persons,
                    'addr:full': row.addr_full,
                    'addr:city': row.addr_city,
                    source: row.source,
                    osm_id: row.osm_id,
                    osm_type: row.osm_type,
                    distance_km: parseFloat(row.distance_km).toFixed(2)
                },
                geometry: {
                    type: 'Point',
                    coordinates: [row.longitude, row.latitude]
                }
            }))
        };

        return NextResponse.json(geojson);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch nearby facilities' },
            { status: 500 }
        );
    }
}
