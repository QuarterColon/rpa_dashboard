# A360 Work Item Monitor

An internal dashboard starter for queue-level Automation Anywhere A360 work-item lifecycle monitoring. The app has no database layer or synthetic data fallback. It calls the configured Control Room from server-side route handlers and requires live credentials.

## Start locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and configure the Control Room URL and either username/API key or OAuth bearer token.
3. Run `npm install`.
4. Run `npm run dev` and open http://localhost:3000.
The package includes `test`, `typecheck`, `lint`, and `build` scripts. No database setup is required.

## Current features

- Responsive overview with queue/process selection and live lifecycle KPIs.
- Lifecycle durations that preserve missing/invalid timestamps as unavailable.
- Live queue listing, WLM item listing, detail, summary, trends and CSV export routes.

## Configuration

See `.env.example`. Set `A360_BASE_URL` and `A360_WLM_VERSION`. Set either `A360_OAUTH_BEARER_TOKEN` or `A360_USERNAME` and `A360_API_KEY` (the server adapter also supports `A360_PASSWORD` where enabled). Keep `.env` private and out of source control.

## API discovery and limitations

The app calls `POST /v2/authentication`, `POST /v3/wlm/queues/list`, and `POST /v3/wlm/queues/{id}/workitems/list`. Lifecycle fields map from `createdOn`, `startTime`, `endTime`, and `totalPausedTime`. API credentials and request success have not been verified against your Control Room from this workspace. See [docs/a360-api-mapping.md](docs/a360-api-mapping.md).

Further setup, retention and operational guidance: [implementation plan](docs/implementation-plan.md), [data dictionary](docs/data-dictionary.md), [deployment](docs/deployment.md), [operations runbook](docs/operations-runbook.md).
