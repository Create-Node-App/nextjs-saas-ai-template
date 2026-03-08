#!/bin/bash
# =============================================================================
# Post-create script for SkillHouse DevContainer
# This script runs after the container is created
# =============================================================================

set -e

echo "🚀 Setting up SkillHouse development environment..."

# Navigate to workspace
cd /workspaces/internal-skillshouse-app || cd /workspaces/*

# -----------------------------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------------------------
echo "📦 Installing dependencies with pnpm..."
# Use --force to avoid interactive prompts about existing node_modules
pnpm install --force

# -----------------------------------------------------------------------------
# Setup direnv
# -----------------------------------------------------------------------------
echo "🔧 Configuring environment..."

# Copy .envrc.dev.example to .envrc if it doesn't exist
if [ ! -f .envrc ]; then
  echo "📝 Creating .envrc from .envrc.dev.example..."
  cp .envrc.dev.example .envrc

    # Update DATABASE_URL for Docker network
    sed -i 's|postgresql://skillhouse:skillhouse@localhost:5432/skillhouse_dev|postgresql://skillhouse:skillhouse@db:5432/skillhouse_dev|g' .envrc

    echo "✅ .envrc created with DevContainer settings"
else
    echo "ℹ️  .envrc already exists, skipping..."
fi

# Create .env.local for additional overrides (AUTH_SECRET)
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local with auto-generated AUTH_SECRET..."
    AUTH_SECRET=$(openssl rand -base64 32)
    echo "# Auto-generated for DevContainer" > .env.local
    echo "AUTH_SECRET=$AUTH_SECRET" >> .env.local
    echo "✅ .env.local created"
fi

# Allow direnv for this directory
direnv allow .

# -----------------------------------------------------------------------------
# Setup database
# -----------------------------------------------------------------------------
echo "🗄️  Waiting for database to be ready..."
until pg_isready -h db -p 5432 -U skillhouse -d skillhouse_dev > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done

echo "🗄️  Applying database migrations..."
# Source environment for db:migrate
eval "$(direnv export bash)"
pnpm db:migrate

# -----------------------------------------------------------------------------
# Setup MinIO bucket
# -----------------------------------------------------------------------------
echo "📦 Setting up MinIO bucket..."

# Wait for MinIO to be ready
until curl -sf http://minio:9000/minio/health/live > /dev/null 2>&1; do
    echo "   Waiting for MinIO..."
    sleep 2
done

# Configure mc (MinIO Client) and create bucket
mc alias set skillhouse http://minio:9000 skillhouse skillhouse123 2>/dev/null || true
mc mb skillhouse/skillhouse-uploads --ignore-existing 2>/dev/null || true
mc anonymous set download skillhouse/skillhouse-uploads 2>/dev/null || true

# Configure CORS for browser uploads
echo "🔧 Configuring MinIO CORS policy..."
cat > /tmp/cors.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-meta-*"]
    }
  ]
}
EOF
mc anonymous set-json /tmp/cors.json skillhouse/skillhouse-uploads 2>/dev/null || \
  echo "   (CORS may need manual setup via MinIO console)"
rm -f /tmp/cors.json

echo "✅ MinIO bucket 'skillhouse-uploads' ready"

# -----------------------------------------------------------------------------
# Done!
# -----------------------------------------------------------------------------
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  ✅ SkillHouse development environment is ready!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "  Environment is managed by direnv (auto-loads when you cd into project)"
echo ""
echo "  Available commands:"
echo "    pnpm dev          - Start Next.js development server"
echo "    pnpm db:studio    - Open Drizzle Studio (database GUI)"
echo "    pnpm build        - Build for production"
echo "    pnpm test         - Run tests"
echo "    pnpm lint         - Run linter"
echo ""
echo "  Database connection:"
echo "    Host: db (or localhost from outside container)"
echo "    Port: 5432"
echo "    User: skillhouse"
echo "    Database: skillhouse_dev"
echo ""
echo "  To customize environment: edit .env.local (overrides .envrc defaults)"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
