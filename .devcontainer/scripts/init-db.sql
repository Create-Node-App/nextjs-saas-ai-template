-- =============================================================================
-- PostgreSQL initialization script for Agentic A8n Hub
-- This script runs when the database container is first created
-- =============================================================================

-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create dedicated schemas
CREATE SCHEMA IF NOT EXISTS a8n_hub;
CREATE SCHEMA IF NOT EXISTS drizzle;

-- Set default search_path for the app user
ALTER ROLE a8nhub SET search_path TO a8n_hub, public, drizzle;

-- Grant privileges to a8nhub user
GRANT ALL PRIVILEGES ON DATABASE a8n_hub_dev TO a8nhub;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Agentic A8n Hub database initialized with extensions: vector, uuid-ossp, pg_trgm';
END $$;
