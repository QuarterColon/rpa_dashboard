# Deployment

The intended runtime is Next.js behind an approved HTTPS reverse proxy, with a separately scheduled Node worker if live ingestion is later added. There is no database. Keep Control Room credentials in the hosting platform's secret store. Never bake them into the image. Configure a daily 02:00 Asia/Kolkata external scheduler only after live ingestion has been validated. The current worker is fixture-only and read-only.

Local development: copy `.env.example` to `.env`, install dependencies with `npm install`, and start the web app with `npm run dev`; fixture preview uses `npm run etl:sync -- --dry-run`.

Before production: integrate organization authentication, provision least-privilege A360 access, validate tenant Swagger mappings, decide whether a cache or persistent store is needed, configure worker scheduling and monitoring, and test recovery for the chosen storage approach. Health checks should include app readiness, last successful sync age and recent extraction failure count.
