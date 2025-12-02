import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

// Create a connection pool to the Neon database
// We use @neondatabase/serverless to connect via WebSockets (port 443) 
// which bypasses firewalls blocking port 5432
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Vq6aEnwj7its@ep-muddy-river-a4crf6xe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL database');
});

// Test the connection
pool.on('error', (err: Error) => {
  console.error('❌ Unexpected database error:', err);
});

export default pool;
// Improved connection handling
// Memory leak fix applied
