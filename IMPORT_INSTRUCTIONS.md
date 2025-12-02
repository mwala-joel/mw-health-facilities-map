# 🎯 How to Import Data into Neon Database

Since the network connection is blocking the automatic migration, follow these steps to import your data manually:

## Step 1: Open the SQL File

The file `import-data.sql` has been generated in this folder. It contains all 166 INSERT statements for your health facilities.

## Step 2: Go to Neon Dashboard

1. Go to https://console.neon.tech
2. Select your project
3. Click on "SQL Editor" in the left sidebar

## Step 3: Copy and Paste the SQL

1. Open the `import-data.sql` file
2. Copy ALL the contents (Ctrl+A, then Ctrl+C)
3. Paste it into the Neon SQL Editor
4. Click "Run" or press Ctrl+Enter

## Step 4: Verify the Import

After running the SQL, you should see:
- "166 facilities inserted" message
- You can verify by running: `SELECT COUNT(*) FROM health_facilities;`

## Step 5: Test the API

Once the data is imported, you can test the API routes:

1. Start your development server:
   ```bash
   cd health-facilities-map
   npm run dev
   ```

2. Test the API endpoints in your browser:
   - All facilities: http://localhost:3000/api/facilities
   - Stats: http://localhost:3000/api/facilities/stats
   - Nearby search: http://localhost:3000/api/facilities/nearby?lat=-15.8&lng=35.0&radius=50

## Next Steps

After the data is imported, we can:
1. Update the frontend Map component to fetch from the API
2. Add real-time filtering using database queries
3. Implement the nearby search feature

---

**Note**: The `import-data.sql` file is ready to use. Just open it and copy-paste into Neon!
