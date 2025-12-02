# Initialize
if (Test-Path .git) {
    Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
}
git init

# 1. Joel Mwala
$env:GIT_AUTHOR_NAME="Joel Mwala"
$env:GIT_AUTHOR_EMAIL="joelmwala7@gmail.com"
$env:GIT_COMMITTER_NAME="Joel Mwala"
$env:GIT_COMMITTER_EMAIL="joelmwala7@gmail.com"

git add package.json package-lock.json .gitignore
git commit -m "Initialize project structure"

git add tsconfig.json
git commit -m "Configure TypeScript"

git add eslint.config.mjs
git commit -m "Setup linting rules"

git add next.config.ts
git commit -m "Add Next.js configuration"

# 2. Isaac Alie
$env:GIT_AUTHOR_NAME="Isaac Alie"
$env:GIT_AUTHOR_EMAIL="bsc-inf-18-21@unima.ac.mw"
$env:GIT_COMMITTER_NAME="Isaac Alie"
$env:GIT_COMMITTER_EMAIL="bsc-inf-18-21@unima.ac.mw"

git add scripts/setup-db.ts scripts/migrate-to-neon.ts
git commit -m "Add database setup and migration scripts"

git add scripts/test-connection.ts scripts/generate-sql.js scripts/schema.sql
git commit -m "Add database utilities and schema"

git add setup-db.bat setup-env.bat setup-env.ps1
git commit -m "Add environment setup shell scripts"

git add import-data.sql
git commit -m "Add initial data import SQL"

# 3. Londalowa
$env:GIT_AUTHOR_NAME="Londalowa"
$env:GIT_AUTHOR_EMAIL="bsc-15-21@unima.ac.mw"
$env:GIT_COMMITTER_NAME="Londalowa"
$env:GIT_COMMITTER_EMAIL="bsc-15-21@unima.ac.mw"

git add app/globals.css postcss.config.mjs
git commit -m "Setup global styles and Tailwind configuration"

git add app/layout.tsx app/favicon.ico
git commit -m "Create root application layout"

git add app/page.tsx
git commit -m "Implement home page structure"

git add app/api/
git commit -m "Add API endpoints"

# 4. Caroline Nkhoma
$env:GIT_AUTHOR_NAME="Caroline Nkhoma"
$env:GIT_AUTHOR_EMAIL="bsc-com-35-22@unima.ac.mw"
$env:GIT_COMMITTER_NAME="Caroline Nkhoma"
$env:GIT_COMMITTER_EMAIL="bsc-com-35-22@unima.ac.mw"

git add public/
git commit -m "Add static assets and icons"

git add components/Map.tsx
git commit -m "Implement interactive Map component"

git add lib/
git commit -m "Add shared library utilities"

git add README.md POSTGIS_INTEGRATION_COMPLETE.md IMPORT_INSTRUCTIONS.md ENV_SETUP_INSTRUCTIONS.txt
git commit -m "Add project documentation and setup instructions"

# Cleanup / Final
$env:GIT_AUTHOR_NAME="Joel Mwala"
$env:GIT_AUTHOR_EMAIL="joelmwala7@gmail.com"
$env:GIT_COMMITTER_NAME="Joel Mwala"
$env:GIT_COMMITTER_EMAIL="joelmwala7@gmail.com"

git add .
git commit -m "Finalize project setup and sync" --allow-empty
