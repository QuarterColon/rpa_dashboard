# Implementation plan: modular A360 process monitor

## Product goal

Build a database-free, modular dashboard where an operator selects or enters a process/automation ID and, for queue-based processes, a queue ID or name. The dashboard then displays queue-item lifecycle information: **item-added-to-queue time**, processing start, processing end, and total duration. Pickup means the time the item was added to the queue; it does not mean the time a bot runner picked it up. Keep these as distinct events in labels and data models.

## Feasibility

- Process ID input and optional queue selection are feasible as dashboard controls and query parameters.
- Work-item list data is available through documented WLM listing APIs, subject to tenant version, permissions, and response schema.
- The documented WLM work-item-list response example includes `createdOn`, `startTime`, and `endTime`; it also includes `automationId`, `queueId`, `id`, `status`, and `totalPausedTime`. Use `createdOn` as the candidate item-added-to-queue timestamp and `startTime`/`endTime` as candidate process lifecycle timestamps. The field evidence is from older Enterprise documentation, so verify field names and semantics against the target A360 tenant's v3 Swagger and a real response before finalizing the adapter.
- Prefer WLM work-item records as the primary lifecycle source if the target A360 response retains those fields. Bot Execution Orchestrator activity list/detail APIs (`POST /v3/activity/list`, `GET /v3/activity/execution/{id}`) are supplemental for execution detail and errors. Their use for correlation is optional unless the WLM response lacks lifecycle fields or richer attempt history is required; no stable work-item-to-bot-run join has yet been verified.
- If the source does not provide an event, keep it null. If needed, instrument the automation to write authoritative start/end timestamps and a work-item correlation key to an approved source. Never substitute API fetch time.
- Total duration should be clearly defined. Default candidate: item-added-to-queue through final successful/terminal processing end. Also show processing duration (start to end) separately when those events exist.

## Modular feature stages

### 1. Process selection

- Accept process/automation ID from the user.
- Provide queue ID/name selection for queue-based workflows; allow a process with no queue.
- Resolve process and queue labels through documented read APIs only after confirming the tenant contract.
- Validate inputs and display the selected IDs in the current dashboard context.

### 2. Source adapters

- Authentication adapter: documented A360 v2 authentication or approved OAuth bearer flow.
- Queue adapter: WLM queue listing, currently identified as `POST /v3/wlm/queues/list`; verify exact request body/version in tenant Swagger.
- Work-item adapter: `POST /v3/wlm/queues/{id}/workitems/list`; paginate with supported limits.
- Execution adapter: Bot Execution Orchestrator `POST /v3/activity/list` and `GET /v3/activity/execution/{id}` as documented candidates; establish process ID filters and work-item correlation from tenant schema.
- Keep source mapping in isolated modules so API version changes do not leak into UI/metric code.

### 3. Lifecycle normalization and metrics

- Normalize source records into item-added, process-start, process-end, status, process ID, queue ID, item ID, and execution-attempt records.
- Preserve original source status and source timestamps; normalize timezone-aware values consistently.
- Handle multiple attempts without counting retries as extra business items.
- Calculate queue wait (`startTime - createdOn`), processing duration (`endTime - startTime`), and total duration (`terminal endTime - createdOn`) only when required timestamps exist and intervals are non-negative. Inspect `totalPausedTime` and make pause inclusion explicit; initial total duration is wall-clock elapsed time unless the product explicitly adds an active-processing metric.
- Show missing/unverified events as unavailable, never zero.

### 4. Dashboard modules

- **Overview:** total distinct items, completed/failed/running counts, success rate, average and P95 durations.
- **Item register:** item ID/reference, queue, added time, start, end, total duration, status, attempts; search and pagination.
- **Item detail:** lifecycle timeline and per-attempt execution history with source IDs.
- **Process performance:** volume and durations grouped by process and queue.
- **Data quality:** missing event counts, unmatched executions, last successful source refresh and safe error summaries.
- No database. Start with demo JSON; live mode may query A360 on demand and use bounded in-memory/file caching if needed. Do not add persistence unless an explicit operational need emerges.

### 5. Security and operations

- Keep credentials server-side; never return tokens or sensitive work-item payloads.
- Add the organization's authentication and authorization before exposing production data.
- Use bounded request timeouts, retries, pagination, rate-limit handling, and redacted logs.
- Keep refresh-data separate from any action that changes queue or automation state.

### 6. Verification gates

- **Gate A — tenant contract:** obtain Control Room release/version and Swagger; verify auth, process/automation lookup, queue list, work-item list, activity list/detail, filters, pagination, permissions, retention, and the presence/meaning of `createdOn`, `startTime`, `endTime`, `totalPausedTime`, `automationId`, and queue/item IDs.
- **Gate B — lifecycle validation:** compare at least ten real WLM work items against Control Room UI/API values, including an item with retries and a paused item if available. Verify `createdOn` means queue insertion, verify start/end semantics and pause behavior, and determine how retries appear. Only require a work-item-to-execution join if WLM lacks the needed attempt detail. If timestamps are missing, identify required bot instrumentation.
- **Gate C — implementation:** implement source adapters, interactive process/queue selection, API routes, lifecycle metrics, dashboard modules, and auth; keep database-free.
- **Gate D — validation:** add tests for pagination, normalization, timezones, retries, missing events, invalid intervals and correlation; run typecheck, lint, build, and manual tenant comparisons.

## Current state

The existing Next.js dashboard is a demo-only shell backed by synthetic JSON. It has no database. Its displayed process/queue charts and selector are not yet connected to A360. Public WLM examples show candidate fields `createdOn`, `startTime`, `endTime`, and `totalPausedTime`, but the detailed example is older Enterprise documentation. The target tenant's version, Swagger, and live response have not been inspected; confirm those in Gate A and Gate B before claiming the requested metrics are available.
