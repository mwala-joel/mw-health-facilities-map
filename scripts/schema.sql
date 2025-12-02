-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create health facilities table with spatial column
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
);

-- Create spatial index for efficient geographic queries
CREATE INDEX IF NOT EXISTS idx_health_facilities_geometry 
ON health_facilities USING GIST(geometry);

-- Create index on amenity for filtering
CREATE INDEX IF NOT EXISTS idx_health_facilities_amenity 
ON health_facilities(amenity);

-- Create index on healthcare type
CREATE INDEX IF NOT EXISTS idx_health_facilities_healthcare 
ON health_facilities(healthcare);

-- Create index on operator type
CREATE INDEX IF NOT EXISTS idx_health_facilities_operator 
ON health_facilities(operator_type);
