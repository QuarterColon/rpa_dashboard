# Automation Anywhere A360 API mapping

## Verification status

Reviewed the official Automation Anywhere Control Room API portal and WLM guidance on 2026-10-29. No configured Control Room, tenant Swagger/OpenAPI document, deployment version, or credentials were available. Public documentation confirms multiple API generations: v3 and v4 WLM. Documentation warns that selected v3 operations are deprecated beginning with A360 v.43 in favor of v4. The tenant's `/swagger/` is authoritative for final request/response schemas. No live calls were made.

| Operation | Method / path | What public documentation establishes | Dashboard use / status |
|---|---|---|---|
| Authentication | POST `/v2/authentication` (or OAuth bearer flow where configured) | v1 auth was discontinued from v.33; API calls use either X-Authorization token or OAuth Authorization bearer token, not both. Exact tenant auth policy unverified. | Not implemented; credentials remain server-side placeholders. |
| Queue list | POST `/v3/wlm/queues/list` or tenant-supported v4 equivalent | WLM queue listing is a documented operation. Exact v4 body/response mapping must come from tenant Swagger. | Candidate discovery operation; not called. |
| Work-item list | POST `/v3/wlm/queues/{id}/workitems/list` or tenant-supported v4 equivalent | Pagination uses `page.offset` and `page.length`; public guidance recommends no more than 1000 items (or 300 MB) per request. | Candidate ingestion operation; not called. |
| Work-item detail/status | WLM queue/work-item operations | UI statuses documented include New, Active, Completed, Failed, Unknown, etc.; API enum names may differ by version. | Normalize only known status strings; source status retained. |
| Execution history | Bot Execution Orchestrator API, including v3 activity list and execution detail | Public API portal provides execution monitoring operations. No verified public contract establishes a stable mapping from WLM work-item ID to each bot run or authoritative pickup/start/end event. | Unmatched/unknown until tenant configuration establishes a safe join. |

## Lifecycle field rules

- **Pickup time:** Not established in the documented WLM work-item listing contract reviewed. Keep null unless a documented source or configured bot instrumentation provides this event.
- **Process start/end:** Work-item status is not itself proof of an attempt's start/end timestamps. Populate only from a documented execution-history field confirmed in the tenant Swagger and correlated by stable identifier.
- **Retries/attempt number:** Do not infer ordering solely from work-item status snapshots. Require a stable execution ID or source ordering field; otherwise retain correlation as unresolved.
- **Watermarks:** The reviewed WLM list pagination documentation does not establish a supported updated-time filter. Do not advance an incremental watermark until the tenant API supports a verified change filter or a complete reconciliation has succeeded.
- **Raw payloads:** Dashboard APIs do not expose payloads. A production ingestion implementation must allowlist safe fields and redact sensitive values before persistence/logging.

## Next verification steps

1. Obtain the target Control Room version and its `/swagger/` OpenAPI export.
2. Confirm the supported WLM API version, auth flow, queue and work-item response schemas, filtering, limits and retention.
3. Inspect Bot Execution Orchestrator schemas for execution IDs, timestamps and fields that correlate to work-item IDs.
4. Validate with at least ten representative items, including retries and failures, then enable live ETL only after mapping review.

Sources: [Control Room API portal](https://docs.automationanywhere.com/r/cloud-control-room-apis), [WLM recommended practices](https://docs.automationanywhere.com/r/automation-360/rpa-workload-guidelines), [API version comparison](https://docs.automationanywhere.com/r/control-room-apis/api-comparison-matrix), [work item statuses](https://docs.automationanywhere.com/r/cloud-manage/cloud-workload-an-overview/working-with-work-items).
