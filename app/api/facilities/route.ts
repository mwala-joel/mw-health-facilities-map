import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const amenity = searchParams.get('amenity');
        const operatorType = searchParams.get('operator_type');
        const healthcare = searchParams.get('healthcare');

        let query = `
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
        ST_Y(geometry) as latitude
      FROM health_facilities
      WHERE 1=1
    `;

        const params: any[] = [];
        let paramCount = 1;

        // Add filters
        if (amenity) {
            query += ` AND amenity = $${paramCount}`;
            params.push(amenity);
            paramCount++;
        }

        if (operatorType) {
            query += ` AND operator_type = $${paramCount}`;
            params.push(operatorType);
            paramCount++;
        }

        if (healthcare) {
            query += ` AND healthcare = $${paramCount}`;
            params.push(healthcare);
            paramCount++;
        }

        query += ' ORDER BY name';

        const result = await pool.query(query, params);

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
                    osm_type: row.osm_type
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
            { error: 'Failed to fetch facilities' },
            { status: 500 }
        );
    }
}
