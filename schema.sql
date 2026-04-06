CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  endpoint TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  severity TEXT DEFAULT 'error',
  fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  request_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT,
  service_name TEXT NOT NULL,
  route TEXT,
  total_duration_ms INTEGER,
  status_code INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trace_spans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trace_id UUID REFERENCES traces(id) ON DELETE CASCADE,
  span_name TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  metadata_json JSONB DEFAULT '{}'::jsonb
);
