import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Get statistics about the facilities
        const statsQuery = `
      SELECT 
        COUNT(*) as total_facilities,
        COUNT(DISTINCT amenity) as amenity_types,
        COUNT(CASE WHEN amenity = 'hospital' THEN 1 END) as hospitals,
        COUNT(CASE WHEN amenity = 'clinic' THEN 1 END) as clinics,
        COUNT(CASE WHEN amenity = 'pharmacy' THEN 1 END) as pharmacies,
        COUNT(CASE WHEN amenity = 'dentist' THEN 1 END) as dentists
      FROM health_facilities
    `;

        const amenityBreakdownQuery = `
      SELECT amenity, COUNT(*) as count
      FROM health_facilities
      WHERE amenity IS NOT NULL
      GROUP BY amenity
      ORDER BY count DESC
    `;

        const operatorBreakdownQuery = `
      SELECT operator_type, COUNT(*) as count
      FROM health_facilities
      WHERE operator_type IS NOT NULL
      GROUP BY operator_type
      ORDER BY count DESC
    `;

        const [stats, amenityBreakdown, operatorBreakdown] = await Promise.all([
            pool.query(statsQuery),
            pool.query(amenityBreakdownQuery),
            pool.query(operatorBreakdownQuery)
        ]);

        return NextResponse.json({
            summary: stats.rows[0],
            by_amenity: amenityBreakdown.rows,
            by_operator: operatorBreakdown.rows
        });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
