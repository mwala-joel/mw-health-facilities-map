@echo off
echo Setting up database schema...
psql "postgresql://neondb_owner:npg_Vq6aEnwj7its@ep-muddy-river-a4crf6xe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -f scripts\schema.sql
echo Database schema created!
pause
