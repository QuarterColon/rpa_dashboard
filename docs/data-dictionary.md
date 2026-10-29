# Data dictionary and metric rules

The local JSON fixture contains queue and work-item examples. There is no database or persisted ETL audit store. A future live integration can remain database-free by querying and caching source data in bounded local files or memory, if caching is needed.

Event timestamps are nullable ISO 8601 strings in the fixture; absent timestamps do not become zero or ETL observation times. Wait = pickup to first start. Processing duration = attempt start to attempt end. Elapsed = pickup to terminal completion. Negative intervals are invalid and excluded. Success rate = distinct completed business items divided by distinct completed + failed terminal items; unfinished items are excluded. P95 uses valid completed durations with nearest-rank percentile. Retry attempts count as attempts, not additional business items.

