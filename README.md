# SignalLens

SignalLens is a developer-focused observability and performance monitoring platform designed for modern web services. Built as a comprehensive full-stack solution, it captures, processes, and visualizes system behaviors, including runtime errors, semantic logs, trace execution waterfalls, and critical latency metrics.

## Architecture

SignalLens operates on a decoupled architecture prioritizing high-throughput analysis:

- **Frontend (web):** A high-performance interface built with Next.js (App Router), TypeScript, Tailwind CSS, and Recharts. Designed with a dark-mode first, dense engineering aesthetic to mimic industry-standard SaaS APM tools.
- **Backend (api):** A standalone Node.js and Express server responsible for asynchronous ingestion of traces, errors, and logs.
- **Real-Time Streaming:** Operates on long-polling Server-Sent Events (SSE) to broadcast analytical data directly to the frontend client without persistent socket overhead.
- **Data Warehouse:** Integrates tightly with PostgreSQL via Supabase, utilizing robust relational schema queries for multidimensional metric aggregating.

## Core Abilities

### Distributed Tracing
Tracks end-to-end request lifecycles across segmented boundaries. Trace spans are recorded and presented in high-fidelity waterfall diagrams to isolate latency regressions in database queries or middleware logic instantly.

### Error Tracking & Fingerprinting
Captures runtime exceptions across services with complete stack traces. Employs algorithm-based fingerprinting for algorithmic recurrence indexing and severity prioritization.

### Live Telemetry Streaming
Ingests semantic log outputs alongside serialized JSON metadata. Features live consumption streams filtering directly from the backend SSE pipelines for instantaneous resolution of failing systems.

### Performance Analytics
Aggregates high-percentile latency profiles across active application nodes to identify degradation bottlenecks and enforce rigid threshold constraints.

## Technical Implementation Constraints
- Backend endpoints execute asynchronous, non-blocking ingestion pathways to preserve the performance integrity of the upstream services reporting metrics.
- Separation of presentation-layer state caching from network stream hooks to prevent React DOM hydration mismatches during high-frequency log updates.
- Database layout strictly utilizes UUIDv4 primary keys and temporal tracking for scalable, immutable observability ledgers.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase PostgreSQL instance

### Local Initialization

1. Construct the database tables by executing `schema.sql` against your PostgreSQL instance.
2. Configure the Node environment. Supply `SUPABASE_URL` and your secret `SUPABASE_KEY` to `api/.env`.
3. Boot the backend ingestion engine:
   ```bash
   cd api
   npm install
   npm run dev
   ```
4. Boot the Next.js visual dashboard:
   ```bash
   cd web
   npm install
   npm run build
   npm start
   ```
5. Navigate to the local host port specified (typically `http://localhost:3000`) to access the observability platform.
