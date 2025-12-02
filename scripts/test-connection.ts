import { Pool, neonConfig } from '@neondatabase/serverless';
import WebSocket from 'ws';

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Vq6aEnwj7its@ep-muddy-river-a4crf6xe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
    connectionTimeoutMillis: 10000,
});

async function testConnection() {
    console.log('🔍 Testing connection to Neon database (Serverless Driver)...\n');

    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        const result = await client.query('SELECT version()');
        console.log('✅ PostgreSQL version:', result.rows[0].version);

        const postgisResult = await client.query('SELECT PostGIS_version()');
        console.log('✅ PostGIS version:', postgisResult.rows[0].postgis_version);

        client.release();
        await pool.end();

        console.log('\n🎉 Connection test passed!');
    } catch (error: any) {
        console.error('❌ Connection failed:', error);
        if (error.cause) console.error('Cause:', error.cause);

        console.error('\nPossible solutions:');
        console.error('1. Check your internet connection');
        console.error('2. Try connecting to a VPN if you\'re on a restricted network');
        console.error('3. Check if your firewall is blocking port 443 (HTTPS)');
        process.exit(1);
    }
}

testConnection();
