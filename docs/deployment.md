# Deployment

Run the Next.js app behind an approved HTTPS reverse proxy. No database or ETL worker is used; each page request queries A360 from the server. Keep Control Room credentials in the hosting platform's secret store and never include them in a client bundle or image.

Local setup: copy `.env.example` to `.env`, configure the Control Room base URL and one supported auth method, run `npm install`, then `npm run dev`. The production deployment uses `npm run build` and `npm start`.

Before production, validate the tenant Swagger request/response schemas, add the organization's approved user authentication and access policy, confirm least-privilege A360 permissions, and configure monitoring for source API availability and request failures. Reassess pagination and caching if source datasets become large.
