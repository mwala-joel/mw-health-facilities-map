$env:DATABASE_URL = "postgresql://neondb_owner:npg_Vq6aEnwj7its@ep-muddy-river-a4crf6xe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
"DATABASE_URL=$env:DATABASE_URL" | Out-File -FilePath .env.local -Encoding utf8
Write-Host ".env.local file created successfully!"
