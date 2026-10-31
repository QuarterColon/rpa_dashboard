# Data dictionary and metric rules

The dashboard queries A360 directly and keeps no database or synthetic fixture. Queue records use the source queue `id` and `name`. Work-item records map `id`, `queueId`, `automationId`, `createdOn`, `startTime`, `endTime`, `totalPausedTime`, `status`, `result`, and `error` when returned by WLM.

`createdOn` is displayed as **Added to queue**. Queue wait = `startTime - createdOn`. Processing duration = `endTime - startTime`. Total duration = `endTime - createdOn`. Missing timestamps stay unavailable; negative intervals are invalid. Success rate is distinct completed items divided by completed plus failed terminal items. P95 uses nearest-rank percentile over valid processing durations. Retry/attempt counts are not inferred when the source does not provide authoritative attempt identifiers.
