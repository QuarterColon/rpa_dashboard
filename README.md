# A360 Work Item Monitor

An internal dashboard starter for queue-level Automation Anywhere A360 work-item lifecycle monitoring. The app has no database layer. The current UI and worker operate in **demonstration mode** using a local JSON fixture. No real Control Room integration, login, or production metric has been verified.

## Start locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and set `APP_MODE=mock`.
3. Run `npm install`.
4. Run `npm run dev` and open http://localhost:3000.
5. Run the fixture preview with `npm run etl:sync -- --dry-run`.

The package includes `test`, `typecheck`, and `build` scripts. No database setup or migration is required. The fixture worker is read-only; live A360 ingestion is not implemented yet.

## Current features

- Responsive overview with distinct-item KPI definitions and visible demo labeling.
- Lifecycle durations that preserve missing/invalid timestamps as unavailable.
- Demo queue, work-item list, item detail, summary, ETL history and protected admin-run route stubs.
- JSON fixture data for queues and work items.
- Fixture-only ETL CLI with dry-run and queue selection.

## Configuration

See `.env.example`. `APP_MODE=mock` is the only supported mode. `A360_BASE_URL`, version, and auth placeholders are not sufficient to enable live sync. Do not store real secrets in source control. `AUTH_MODE=demo` is not production authentication.

## API discovery and limitations

Public Automation Anywhere documentation confirms WLM v3 and v4 API generations, and documents POST queue/work-item listing operations. Public WLM listing does not by itself establish authoritative pickup time, attempt start/end, retry ordering, or a work-item-to-bot-run correlation. The tenant version/Swagger is needed before production integration. See [docs/a360-api-mapping.md](docs/a360-api-mapping.md).

Further setup, retention and operational guidance: [implementation plan](docs/implementation-plan.md), [data dictionary](docs/data-dictionary.md), [deployment](docs/deployment.md), [operations runbook](docs/operations-runbook.md).
