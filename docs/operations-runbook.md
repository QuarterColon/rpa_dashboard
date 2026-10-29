# Operations runbook

## Current demo

Set `APP_MODE=mock`. Demo data is synthetic and visibly labeled; it is not production evidence. `npm run etl:sync -- --dry-run` reads `fixtures/demo-work-items.json` and reports normalized lifecycle records without writing data. `--queue <fixture-id>` filters fixture ingestion.

## Production readiness blockers

The live API client, source-data cache, incremental watermark and external schedule are not enabled. Before turning on live mode, export the configured Control Room Swagger contract, verify supported WLM and execution-history APIs, establish event timestamp/correlation semantics, implement and test bounded file or memory caching if required, then add organization-approved authentication. Keep incremental checkpoint unchanged after partial failure.

## Troubleshooting guidance

For source failures, inspect sanitized ETL run metadata, verify the Control Room is reachable, confirm service account permissions/token validity, and retry through the external scheduler after fixing the cause. Never include tokens, raw payloads, or unredacted error details in incident logs. For missing lifecycle times, review API mapping and bot instrumentation rather than filling them with refresh time. Restore the fixture file from source control; if a live cache is later introduced, document its recovery procedure separately.
