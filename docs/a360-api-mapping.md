# A360 endpoints used by the dashboard

This code uses live server-side requests only; it has no fixture fallback.

| Purpose | Method and route | Code mapping |
|---|---|---|
| Obtain a Control Room token | `POST /v2/authentication` | Sends server-side `username` with `apiKey` (preferred) or `password`, then reads `token` or `jwtToken`; alternatively uses configured OAuth bearer token. |
| Discover queues | `POST /v3/wlm/queues/list` | Sends filter, ascending ID sort and page controls; maps `list[].id` and `list[].name`. |
| List queue items | `POST /v3/wlm/queues/{id}/workitems/list` | Paginates with `page.offset`/`page.length` and filters by `automationId` locally when process ID is entered. |
| Execution detail (available adapter helper) | `GET /v3/activity/execution/{id}` | Can supply supplemental execution detail; no item-to-execution association is assumed. |

Work-item fields map from the documented response names: `createdOn` (displayed as Added to queue), `startTime`, `endTime`, `totalPausedTime`, `automationId`, `queueId`, `id`, and `status`. Queue wait is `startTime - createdOn`; processing duration is `endTime - startTime`; total wall-clock duration is `endTime - createdOn`. Missing fields remain unavailable. The WLM list example confirming these fields is in older Enterprise documentation, so the target A360 Swagger remains the source of truth for the target release. API request bodies in code use the WLM list filter/sort/page shape; tenant error responses will be surfaced as sanitized HTTP errors.

## Limits and caveats

- WLM item listing should use pages of at most 1,000 items (or 300 MB per response). The app defaults to 200, caps the configured page size at 1,000, and bounds pagination.
- Work-item history and process filtering use WLM queue APIs; queue-based monitoring is supported. Non-queue process runs are not yet presented as work items.
- Retry attempt count and correlation are not inferred from duplicate/status snapshots. Use only an authoritative attempt/run identifier if the source exposes it.
- API credentials stay on the server. Raw payloads are not returned.
- The app calls the public documented routes but has not been tested against a real Control Room response.

Sources: [Control Room API portal](https://docs.automationanywhere.com/r/cloud-control-room-apis), [WLM v3 reference](https://docs.automationanywhere.com/r/control-room-apis/wlm-api-supported-v3), [work-item list response example](https://docs.automationanywhere.com/bundle/enterprise-v11.3/page/enterprise/topics/control-room/control-room-api/get-all-work-items-in-queues-api.html), [WLM pagination guidance](https://docs.automationanywhere.com/r/automation-360/rpa-workload-guidelines), [Bot Execution Orchestrator v3](https://docs.automationanywhere.com/r/control-room-apis/bot-execution-orchestrator-api-supported-v3).
